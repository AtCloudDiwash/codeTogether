import dotenv from "dotenv";
import { WebSocketServer, WebSocket } from "ws";
dotenv.config();

interface codeRoom {
  socket: WebSocket;
  payload: {
    roomId: string,
  };
}

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 8081;
const wss = new WebSocketServer({host: '0.0.0.0', port: PORT });
let codeRooms: codeRoom[] = [];
let userChats = new Map();
let currentRoomId: string | undefined = undefined;
let onlineUserNumber = new Map();


function getRoomId(url?: string): string | undefined {
  if (!url) return undefined;
  const roomId = url.split("/")[1];
  return roomId;
}

function sendAll(codeRooms:codeRoom[], message:string, roomId:string){
      codeRooms.forEach((coder) => {
        if(coder.payload.roomId === roomId){
                    coder.socket.send(
                      message
                    );
        }
      });
}

wss.on("connection", (socket, req) => {
  const roomId = getRoomId(req.url);

  if (roomId && typeof req.url === "string") {
    codeRooms.push({
      socket,
      payload: {
        roomId,
      },
    });
      if (userChats.get(roomId)) {
          const activeUsers = onlineUserNumber.get(roomId);
          onlineUserNumber.set(roomId, activeUsers + 1);
          sendAll(
            codeRooms,
            JSON.stringify({
              message: userChats.get(roomId),
              onlineUserNumber: onlineUserNumber.get(roomId),
            })
          , roomId);
      } else {
        userChats.set(roomId, "//code here you ducker"); 
        onlineUserNumber.set(roomId, 1);
        socket.send(JSON.stringify({message:"",onlineUserNumber: onlineUserNumber.get(roomId)}));
      }
    
  }

  socket.on("message", (message) => {
    codeRooms.forEach((coder)=>{
        if(coder.socket == socket){
            currentRoomId = coder.payload.roomId;
            userChats.set(roomId, message.toString()); 
        }
    });

    codeRooms.forEach((coder)=>{
        if(currentRoomId == coder.payload.roomId) { 
            coder.socket.send(JSON.stringify({message: message.toString(), onlineUserNumber:onlineUserNumber.get(currentRoomId)}));
        }
    })
  });

  socket.on("close", () => {
    console.log("User disconnected");
    const activeUsers = onlineUserNumber.get(roomId);
    onlineUserNumber.set(roomId, activeUsers - 1);
  });
});
