"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const ws_1 = require("ws");
dotenv_1.default.config();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 8080;
const wss = new ws_1.WebSocketServer({ host: "0.0.0.0", port: PORT });
let codeRooms = [];
let userChats = new Map();
let onlineUserNumber = new Map();
function getRoomId(url) {
    if (!url)
        return undefined;
    return url.split("/")[1];
}
function sendAll(codeRooms, message, roomId) {
    codeRooms.forEach((coder) => {
        if (coder.payload.roomId === roomId) {
            coder.socket.send(message);
        }
    });
}
wss.on("connection", (socket, req) => {
    const roomId = getRoomId(req.url);
    if (!roomId) {
        console.log("Invalid room ID");
        return;
    }
    codeRooms.push({ socket, payload: { roomId } });
    const currentCount = onlineUserNumber.get(roomId) || 0;
    onlineUserNumber.set(roomId, currentCount + 1);
    if (userChats.has(roomId)) {
        sendAll(codeRooms, JSON.stringify({
            message: userChats.get(roomId),
            onlineUserNumber: onlineUserNumber.get(roomId),
        }), roomId);
    }
    else {
        userChats.set(roomId, "//code here you ducker");
        socket.send(JSON.stringify({ message: "", onlineUserNumber: 1 }));
    }
    socket.on("message", (msg) => {
        const message = msg.toString();
        userChats.set(roomId, message);
        codeRooms.forEach((coder) => {
            if (coder.payload.roomId === roomId) {
                coder.socket.send(JSON.stringify({
                    message,
                    onlineUserNumber: onlineUserNumber.get(roomId),
                }));
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
