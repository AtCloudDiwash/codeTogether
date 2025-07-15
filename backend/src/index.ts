import dotenv from "dotenv";
import { WebSocketServer, WebSocket } from "ws";
import { IncomingMessage } from "http";

dotenv.config();

interface CodeRoom {
  socket: WebSocket;
  payload: {
    roomId: string;
  };
}

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 8080;
const wss = new WebSocketServer({ host: "0.0.0.0", port: PORT });

let codeRooms: CodeRoom[] = [];
let userChats = new Map<string, string>();
let onlineUserNumber = new Map<string, number>();

function getRoomId(url?: string): string | undefined {
  if (!url) return undefined;
  return url.split("/")[1];
}

function sendAll(codeRooms: CodeRoom[], message: string, roomId: string) {
  codeRooms.forEach((coder) => {
    if (coder.payload.roomId === roomId) {
      coder.socket.send(message);
    }
  });
}

wss.on("connection", (socket: WebSocket, req: IncomingMessage) => {
  const roomId = getRoomId(req.url);

  if (!roomId) {
    console.log("Invalid room ID");
    return;
  }

  codeRooms.push({ socket, payload: { roomId } });

  const currentCount = onlineUserNumber.get(roomId) || 0;
  onlineUserNumber.set(roomId, currentCount + 1);

  if (userChats.has(roomId)) {
    sendAll(
      codeRooms,
      JSON.stringify({
        message: userChats.get(roomId),
        onlineUserNumber: onlineUserNumber.get(roomId),
      }),
      roomId
    );
  } else {
    userChats.set(roomId, "//code here you ducker");
    socket.send(JSON.stringify({ message: "", onlineUserNumber: 1 }));
  }

  socket.on("message", (msg: string | Buffer) => {
    const message = msg.toString();
    userChats.set(roomId, message);

    codeRooms.forEach((coder) => {
      if (coder.payload.roomId === roomId) {
        coder.socket.send(
          JSON.stringify({
            message,
            onlineUserNumber: onlineUserNumber.get(roomId),
          })
        );
      }
    });
  });

  socket.on("close", () => {
    console.log("User disconnected");

    codeRooms = codeRooms.filter((coder) => coder.socket !== socket);

    const current = onlineUserNumber.get(roomId) || 1;
    onlineUserNumber.set(roomId, Math.max(current - 1, 0));
  });
});
