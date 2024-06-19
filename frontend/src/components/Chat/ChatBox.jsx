import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";
import { Stack } from "react-bootstrap";
import moment from "moment"
import InputEmoji from "react-input-emoji"

const ChatBox = () => {
    const {user} = useContext(AuthContext);
    const {currentChat, messages, isMessagesLoading, sendTextMessage, getMessages} = useContext(ChatContext);
    const [textMessage, setTextMessage] = useState("");
    const scroll = useRef();

    useEffect(() => {
        getMessages();
    }, [currentChat]);

    useEffect(() => {
        scroll.current?.scrollIntoView({behavior: "smooth"});
    }, [messages]);

    function handleKeyPress(event) {
        if (event.key === 'Enter') {
            sendTextMessage(textMessage, setTextMessage);
        }
      }

    if (!currentChat?.id)
        return (
            <p style={{textAlign:"center", width:"100%"}}>Let's Chat</p>
        )

    if (isMessagesLoading)
        return (
            <p style={{textAlign:"center", width:"100%"}}>Loading Chat...</p>
        )
    return (
        <Stack gap={4} className="chat-box">
            <div className="chat-header">
                <strong>{currentChat?.name}</strong>
            </div>

            <Stack gap={3} className="messages">
                {messages && messages.map((message, index) => (
                <Stack key={index} className={message?.user_id1 === user?.id ? "message self align-self-end flex-grow-0" : "message align-self-start flex-grow-0"} ref={scroll}>
                    <span>{message.text}</span>
                    <span className="message-footer">{moment(message.time).calendar()}</span>
                </Stack>))}
            </Stack>

            <Stack direction="horizontal" gap={3} className="chat-input flex-grow-0">
                <InputEmoji value={textMessage} 
                    onChange={setTextMessage} 
                    fontFamily="nunito" 
                    borderColor="rbga(72, 112, 223, 0.2)" 
                    onKeyDown={handleKeyPress}
                ></InputEmoji>
                <button className="send-btn" onClick={() => sendTextMessage(textMessage, setTextMessage)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-send-fill" viewBox="0 0 16 16">
                        <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471z"/>
                    </svg>
                </button>
            </Stack>
        </Stack>
    )
};

export default ChatBox;