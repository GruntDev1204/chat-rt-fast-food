import React, { useState, useEffect } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:3001");

const Form = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [sender, setSender] = useState("");
  const [isMySender, setIsMySender] = useState(false);

  useEffect(() => {
    const storedSender = localStorage.getItem("sender");
    if (storedSender) {
      setSender(storedSender);
    } else {
      const inputSender = prompt("Nhập tên của bạn:");
      if (inputSender) {
        setSender(inputSender);
        localStorage.setItem("sender", inputSender);
      }
    }

    socket.on("chat-message", handleReceivedMessage);

    return () => {
      socket.off("chat-message", handleReceivedMessage);
    };
  }, []);

  const handleReceivedMessage = (message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  const handleSendMessage = () => {
    if (!sender) {
      alert("Vui lòng nhập tên của bạn trước khi gửi tin nhắn.");
      return;
    }

    const messageData = `${sender}: ${message}`;
    socket.emit("chat-message", messageData);
    setMessage("");
  };

  const handleDeleteName = () => {
    if (isMySender) {
      localStorage.removeItem("sender");
      alert('đã xóa tên user của bạn')
      setSender("");
    }
  };

  useEffect(() => {
    setIsMySender(true);
  }, [sender]);

  return (
    <div className="container">
      <div className="row mt-5">
        <div className="card card-primary">
          <div className="card-header">
            <h3 className="card-title">Khung chat</h3>
          </div>
          <div className="card-body">
            <div className="card-body">
              {messages.map((msg, index) => {
                const [msgSender, msgContent] = msg.split(":");
                const isMyMessage = msgSender.trim() === sender;
                return (
                  <div
                    className={`alert ${
                      isMyMessage ? "alert-success text-right" : "alert-primary"
                    }`}
                    role="alert"
                    key={index}
                  >
                    {isMyMessage ? (
                      <strong>{msgContent}</strong>
                    ) : (
                      <>
                        <strong>{msgSender}: </strong>
                        {msgContent}
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="card-footer">
            <div className="row">
              <textarea
                cols={150}
                className="from-control"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              ></textarea>
              <button
                type="button"
                className="btn btn-dark  mt-5"
                onClick={handleSendMessage}
              >
                Gửi
              </button>
            </div>
          </div>
          {isMySender && (
            <div className="card-footer">
              <div className="row">
                <button
                  className="btn btn-danger"
                  onClick={handleDeleteName}
                >
                  Xóa tên người dùng
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Form;
