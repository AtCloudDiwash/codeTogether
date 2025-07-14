import "./CodeRoom.css";
import { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import usersIcon from "../assets/users.svg";
import MonacoEditor from "@monaco-editor/react";

export default function CodeRoom() {
  const { id } = useParams();
  const socketRef = useRef<WebSocket | null>(null);
  const [code, setCode] = useState("");
  const [onlineUsers, setOnlineUsers] = useState(0);

  useEffect(() => {
    const ws = new WebSocket(`https://codetogether-dl2x.onrender.com/${id}`);
    socketRef.current = ws;

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setCode(data.message);
      setOnlineUsers(data.onlineUserNumber);
    };

    return () => {
      ws.close();
    };
  }, [id]);

  const handleEditorChange = (value: string | undefined) => {
    const newCode = value || "";
    setCode(newCode);
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(newCode);
    }
  };

  return (
    <div className="min-h-screen text-white">
      <nav className="bg-[#EAEBEF] h-15 flex items-center justify-between px-5 fixed z-100 w-full shadow-lg">
        <h1 className="text-2xl font-bold text-[#0550C0]">{`<CodeTogether/>`}</h1>
        <div className="flex items-center gap-2">
          <div>
            <div className="online-dot"></div>
          </div>
          <p className="text-[#000] font-medium opacity-80">{onlineUsers}</p>
          <img src={usersIcon} alt="users icon" />
        </div>
      </nav>

      <div className="px-4 pt-16">
        <MonacoEditor
          height="100vh"
          language="javascript"
          theme="vs-dark"
          onChange={handleEditorChange}
          value={code}
        />
      </div>
    </div>
  );
}
