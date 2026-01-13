import React, { useState } from "react";
import ChatRoom from "./component/ChartRoom";

function App() {
  const [userName, setUserName] = useState("");
  const [room, setRoom] = useState("");
  const [joined, setJoined] = useState(false);

  const joinRoom = () => {
    if (!userName || !room) return;
    setJoined(true);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center">
      {!joined ? (
        <div className="bg-white w-full max-w-sm p-8 rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-900 text-center">
            Join Chat Room
          </h2>
          <p className="text-sm text-gray-500 text-center mt-1 mb-6">
            Enter your name and room ID to start chatting
          </p>

          <div className="space-y-4">
            <input
              type="text"
              placeholder="Your name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            <input
              type="text"
              placeholder="Room ID"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            <button
              onClick={joinRoom}
              className="w-full py-3 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition"
            >
              Join Room
            </button>
          </div>
        </div>
      ) : (
       <ChatRoom userName={userName} room={room} />
      )}
    </div>
  );
}

export default App;
