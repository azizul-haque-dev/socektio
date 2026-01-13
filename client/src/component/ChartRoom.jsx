import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";

export default function ChatRoom({ userName, room }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [typingUser, setTypingUser] = useState("");
  const messagesEndRef = useRef(null);

  const socketRef = useRef(null);

  useEffect(() => {
    // Initialize socket
    socketRef.current = io("https://reimagined-space-orbit-qrjqx9pvx7r3xrp6-3001.app.github.dev/"); // Replace with deployed URL

    // Join room
    socketRef.current.emit("join_room", room);

    // Receive messages
    socketRef.current.on("receive_message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    // Typing indicator
    socketRef.current.on("user_typing", (username) => {
      if (username !== userName) setTypingUser(username);
      setTimeout(() => setTypingUser(""), 1000);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [room, userName]);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!message.trim()) return;

    const messageData = {
      id: Date.now(),
      room,
      author: userName,
      message,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    socketRef.current.emit("send_message", messageData);
    setMessages((prev) => [...prev, messageData]);
    setMessage("");
  };

  const handleTyping = () => {
    socketRef.current.emit("typing", { username: userName, room });
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Header */}
      <div className="bg-indigo-600 text-white px-6 py-4 font-semibold">
        Room: {room}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`max-w-xs px-4 py-2 rounded-lg text-sm ${
              msg.author === userName
                ? "bg-indigo-600 text-white ml-auto"
                : "bg-white text-gray-800"
            }`}
          >
            <span className="block text-xs font-medium opacity-70">
              {msg.author}
            </span>
            <p>{msg.message}</p>
            <span className="block text-[10px] text-right opacity-60 mt-1">
              {msg.time}
            </span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Typing Indicator */}
      {typingUser && (
        <div className="px-4 text-sm text-gray-500">{typingUser} is typing...</div>
      )}

      {/* Input */}
      <div className="p-4 bg-white flex gap-2 border-t">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            handleTyping();
            if (e.key === "Enter") sendMessage();
          }}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          onClick={sendMessage}
          className="bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700"
        >
          Send
        </button>
      </div>
    </div>
  );
}
