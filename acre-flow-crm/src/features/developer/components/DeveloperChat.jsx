import React, { useEffect, useRef, useState } from 'react';

const WS_URL = 'ws://localhost:4000';

const DeveloperChat = ({ developerName }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const ws = useRef(null);
  const chatEndRef = useRef(null);

  useEffect(() => {
    ws.current = new window.WebSocket(WS_URL);
    ws.current.onopen = () => {};
    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'history') {
        setMessages(data.data);
      } else if (data.type === 'message') {
        setMessages((prev) => [...prev, data.data]);
      }
    };
    ws.current.onclose = () => {};
    return () => ws.current && ws.current.close();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const msg = { sender: developerName, text: input };
    ws.current.send(JSON.stringify(msg));
    setInput('');
  };

  return (
    <div className="wa-chat-section">
      <div className="wa-chat-header">Developer Chat</div>
      <div className="wa-chat-messages">
        <div className="wa-chat-messages-inner">
          {messages.map((msg, idx) => {
            const isSelf = msg.sender === developerName;
            return (
              <div
                key={idx}
                className={`wa-chat-message${isSelf ? ' self' : ''}`}
              >
                {!isSelf && (
                  <div className="wa-chat-sender">{msg.sender}</div>
                )}
                <div className="wa-chat-bubble">
                  <span className="wa-chat-text">{msg.text}</span>
                </div>
                <div className="wa-chat-time">{msg.time}</div>
              </div>
            );
          })}
          <div ref={chatEndRef} />
        </div>
      </div>
      <form className="wa-chat-input-row" onSubmit={sendMessage}>
        <input
          className="wa-chat-input"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type a message"
        />
        <button className="wa-chat-send" type="submit">Send</button>
      </form>
    </div>
  );
};

export default DeveloperChat; 