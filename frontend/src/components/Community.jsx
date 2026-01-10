import React, { useEffect, useState, useRef } from 'react';
import Sidebar from './Sidebar';
import Background from './Background';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { IoSend } from "react-icons/io5";
import { io } from "socket.io-client";

const Community = () => {
  const username = useSelector((state) => state.user.username) || 'User';
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const socketRef = useRef(null);
  const messageRef = useRef(null);
  const prevMessageRef = useRef(0); // auto scroll to last message

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    socketRef.current.emit("send-message", {
      sender: username,
      content: newMessage,
    });
    setNewMessage("");
  };


  useEffect(() => {
    if (messageRef.current && messages.length > prevMessageRef.current ) 
    {
      messageRef.current.scrollTop = messageRef.current.scrollHeight;
    }
    prevMessageRef.current = messages.length;
  }, [messages]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/messages/", { withCredentials: true });
        setMessages(response.data);
      } catch (err) {
        console.error("Error fetching messages", err);
      }
    };
    fetchMessages();

    socketRef.current = io("http://localhost:5000", {
      transports: ["websocket", "polling"]
    });
    socketRef.current.on("connect", () => {
      console.log("Connected to socket server:", socketRef.current.id);
    });
    socketRef.current.on("emit-message", (newMessage) => {
      setMessages((prev) => [...prev, newMessage]);
    });
    socketRef.current.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason);
    });
    return () => {
      if (socketRef.current) {
        socketRef.current.off("emit-message");
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []);

  return (
    <div className="relative z-0 h-screen overflow-hidden">
      <div className="ml-15 absolute top-0 left-0 w-full h-full z-0">
        <Background />
      </div>

      <div className="flex h-full relative z-10">
        <Sidebar />

        <main className="ml-20 w-full h-full overflow-y-auto px-6 py-8 sm:px-12">
          <div className="max-w-md mx-auto mb-6">
            <div className="flex flex-col items-center px-4 py-1">
              <h1 className="text-4xl font-bold text-[#5d4a7a]">Community</h1>
            </div>
          </div>

          <div className="w-full h-1 bg-gradient-to-r from-transparent via-[#b3a0d9] to-transparent mb-8 opacity-60" />

          <div className="max-w-4xl mx-auto flex flex-col h-[390px] bg-white rounded-lg shadow-md overflow-hidden">
            <div
              ref={messageRef}
              className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
              {messages.map((m) => (
                <div
                  key={m._id}
                  className={`flex ${m.sender === username ? "justify-end" : "justify-start"
                    }`}
                >
                  <div
                    className={`max-w-sm px-3 py-2 rounded-2xl shadow
                      ${m.sender === username ? "bg-[#f8f4fc] rounded-br-none" : "bg-white rounded-bl-none"}`}
                  >
                    <p className="text-sm font-bold mb-1">
                      {m.sender}
                    </p>
                    <p className="text-sm">{m.content}</p>
                    <p className="text-xs text-right opacity-70 mt-1">
                      {new Date(m.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}

            </div>

            <div className="border-t border-[#b3a0d9] bg-white px-4 py-3">
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  className="flex-1 px-4 py-2 rounded-full border border-[#b3a0d9] focus:outline-none focus:ring-1 focus:ring-[#b3a0d9] bg-white text-sm"
                />
                <button
                  onClick={sendMessage}
                  className="p-3 rounded-full bg-[#b3a0d9] hover:bg-[#9c89c0] transition">
                  <IoSend size={18} className="text-white" />
                </button>
              </div>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}

export default Community