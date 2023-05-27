import { useState, useEffect } from "react";
import {
  useGetChatsQuery,
  useAddNewMessageMutation,
  useAddNewChatMutation,
  useAddNewChatMessageMutation,
} from "./chatsApiSlice";
import useAuth from "../../hooks/useAuth";
import useTitle from "../../hooks/useTitle";
import { useNavigate } from "react-router-dom";
import { useSendLogoutMutation } from "../auth/authApiSlice";

const Chat = () => {
  useTitle("New Chat");
  const [value, setValue] = useState("");
  const navigate = useNavigate();
  const [currentChat, setCurrentChat] = useState(null);
  const { userId } = useAuth();
  const { data: chatData, isLoading, isError } = useGetChatsQuery(userId);
  const [addNewChat] = useAddNewChatMutation();
  const [addNewMessage] = useAddNewMessageMutation();
  const [addNewChatMessage] = useAddNewChatMessageMutation();
  const [sendLogout, { isLoading: isLoggingOut }] = useSendLogoutMutation();

  useEffect(() => {
    document.title = currentChat?.title || "New Chat";
  }, [currentChat]);

  const createNewChat = async () => {
    setValue("");
    setCurrentChat((await addNewChat({ userId: userId })).data);
    document.title = currentChat.title;
  };

  const changeChat = (selectedChat) => {
    setCurrentChat(selectedChat);
    setValue("");
  };

  const getMessages = async () => {
    const message = { role: "user", content: value };
    setValue("");
    if (!currentChat) {
      setCurrentChat(
        (
          await addNewChatMessage({
            userId: userId,
            role: "user",
            content: value,
          })
        ).data
      );
    } else {
      setCurrentChat(
        (await addNewMessage({ chatId: currentChat._id, message })).data
      );
    }
  };

  const handleLogout = () => {
    sendLogout();
    navigate("/");
  };

  const reversedChatHistory = chatData ? Object.values(chatData.entities) : [];
  const chatHistory = reversedChatHistory.reverse();

  const renderedChatHistory = chatHistory.map((chat) => (
    <li
      key={chat.id}
      onClick={() => changeChat(chat)}
      className={currentChat === chat ? "active" : ""}
    >
      {chat.title}
    </li>
  ));
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      getMessages();
    }
  };
  

  return (
    <div className="app">
      <section className="side-bar">
        <button onClick={createNewChat}>+ New Chat</button>
        <ul className="history">{renderedChatHistory}</ul>
        <nav>
          <button
            className="logout-button"
            onClick={handleLogout}
            disabled={isLoggingOut}
          >
            Logout
          </button>
          <button
            className="navigate-button"
            onClick={() => navigate("/dalle")}
            disabled={isLoggingOut}
          >
            Dalle
          </button>
        </nav>
      </section>

      <section className="main">
        {!currentChat && <h1 className="title">MustafaGPT</h1>}
        {isError ? (
          <div className="error">Error loading chats</div>
        ) : isLoading ? (
          <div className="loading">Loading chats...</div>
        ) : (
          <ul className="feed">
          {currentChat?.messages?.map((message, index) => (
            <li key={index}>
              <div
                className={`message-container ${
                  message.role === "user" ? "user-message" : "assistant-message"
                }`}
              >
                {message.role === "user" ? (
                  <img
                    className="role-icon-user"
                    src={require("../../img/user.png")}
                    alt="User"
                  />
                ) : (
                  <img
                    className="role-icon-assistant"
                    src={require("../../img/ChatGPTLogo.png")}
                    alt="Assitant"
                  />
                )}
                <p className="chatContent">{message.content}</p>
              </div>
            </li>
          ))}
        </ul>)}
        <div className="bottom-section">
          <div className="input-container">
            <input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Send a message..."
            />
            <div id="submit" onClick={getMessages}>
              ➢
            </div>
          </div>
          <p className="info">
            Powered by Chat GPT May 20 Version, a Free Research Preview.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Chat;
