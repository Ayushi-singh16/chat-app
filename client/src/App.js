import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import "./App.css";

const SOCKET_URL = "http://localhost:8080";

function App() {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [username, setUsername] = useState("");
  const [joined, setJoined] = useState(false);

  useEffect(() => {
    const s = io(SOCKET_URL);
    setSocket(s);

    s.on("message", (msg) => {
      // msg is guaranteed to be an object from backend
      setMessages((prev) => [...prev, msg]);
    });

    return () => s.disconnect();
  }, []);

  const joinChat = () => {
    if (!username.trim()) return alert("Enter a username");
    setJoined(true);
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    // send object with user and text
    socket.emit("message", { user: username, text: input });
    setInput("");
  };

  return (
    <div className="chat-container">
      <h1>CodTech Chat App</h1>

      {!joined ? (
        <div className="join-box">
          <input
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button onClick={joinChat}>Join Chat</button>
        </div>
      ) : (
        <>
          <div className="chat-box">
            {messages.map((m, i) => (
              <div key={i} className="chat-message">
                <strong>{m.user}:</strong> {m.text}
              </div>
            ))}
          </div>
          <form onSubmit={sendMessage} className="chat-form">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
            />
            <button type="submit">Send</button>
          </form>
        </>
      )}
    </div>
  );
}

export default App;