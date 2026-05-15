// Refactored on May 15, 2026.
// Refactor notes are marked with *refactor.

import dotenv from "dotenv";
import { WebSocketServer, WebSocket } from "ws";
import { IncomingMessage } from "http";

dotenv.config();

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 8080;
const wss = new WebSocketServer({ host: "0.0.0.0", port: PORT });

const DEFAULT_CODE = "";

// *refactor: Keep room sockets grouped by roomId so broadcasts do not scan every connected user.
const codeRooms = new Map<string, Set<WebSocket>>();

// *refactor: Rename chat storage to describe what this server actually stores.
const roomCode = new Map<string, string>();

// *refactor: Track presence by room as derived room state instead of keeping socket metadata objects.
const onlineUsersByRoom = new Map<string, number>();

function getRoomId(url?: string): string | undefined {
  if (!url) return undefined;

  // *refactor: Parse the request URL through URL instead of manually splitting raw strings.
  const parsedUrl = new URL(url, "ws://localhost");
  const roomId = parsedUrl.pathname.split("/").filter(Boolean)[0];
  return roomId;
}

// *refactor: Centralize JSON formatting so every socket message has the same shape.
function createRoomMessage(message: string, onlineUserNumber: number) {
  return JSON.stringify({ message, onlineUserNumber });
}

// *refactor: Centralize room lookup and only send to open sockets in the target room.
function sendAll(message: string, roomId: string) {
  const roomSockets = codeRooms.get(roomId);
  if (!roomSockets) return;

  roomSockets.forEach((roomSocket) => {
    if (roomSocket.readyState === WebSocket.OPEN) {
      roomSocket.send(message);
    }
  });
}

// *refactor: Hide room membership setup behind one function to keep connection flow readable.
function addSocketToRoom(roomId: string, socket: WebSocket) {
  const roomSockets = codeRooms.get(roomId) || new Set<WebSocket>();
  roomSockets.add(socket);
  codeRooms.set(roomId, roomSockets);

  const currentCount = onlineUsersByRoom.get(roomId) || 0;
  onlineUsersByRoom.set(roomId, currentCount + 1);
}

// *refactor: Keep disconnect cleanup together and remove empty rooms from socket storage.
function removeSocketFromRoom(roomId: string, socket: WebSocket) {
  const roomSockets = codeRooms.get(roomId);
  roomSockets?.delete(socket);

  if (roomSockets?.size === 0) {
    codeRooms.delete(roomId);
  }

  const current = onlineUsersByRoom.get(roomId) || 1;
  const nextCount = Math.max(current - 1, 0);
  onlineUsersByRoom.set(roomId, nextCount);
}

wss.on("connection", (socket: WebSocket, req: IncomingMessage) => {
  const roomId = getRoomId(req.url);

  if (!roomId) {
    console.log("Invalid room ID");
    return;
  }

  addSocketToRoom(roomId, socket);

  // *refactor: Initialize room code once before broadcasting room state.
  const currentCode = roomCode.get(roomId) || DEFAULT_CODE;
  roomCode.set(roomId, currentCode);

  // *refactor: Broadcast current state after joins so every client receives the latest presence count.
  sendAll(createRoomMessage(currentCode, onlineUsersByRoom.get(roomId) || 1), roomId);

  socket.on("message", (msg: string | Buffer) => {
    const message = msg.toString();
    roomCode.set(roomId, message);

    // *refactor: Reuse the broadcast helper so update behavior stays consistent.
    sendAll(createRoomMessage(message, onlineUsersByRoom.get(roomId) || 0), roomId);
  });

  socket.on("close", () => {
    console.log("User disconnected");

    // *refactor: Recalculate room membership through cleanup helper.
    removeSocketFromRoom(roomId, socket);
    sendAll(createRoomMessage(roomCode.get(roomId) || DEFAULT_CODE, onlineUsersByRoom.get(roomId) || 0), roomId);
  });
});
