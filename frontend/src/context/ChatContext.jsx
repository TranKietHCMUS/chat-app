import { createContext, useCallback, useEffect, useState } from "react";
import { baseUrl, getRequest, postRequest } from "../utils/services";
import { io } from "socket.io-client"

export const ChatContext = createContext();

export const ChatContextProvider = ({children, user}) => {
    const [userChats, setUserChats] = useState(null);
    const [isUserChatsLoading, setIsUserChatsLoading] = useState(false);
    const [userChatsError, setUserChatsError] = useState(null);
    const [currentChat, setCurrentChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [isMessagesLoading, setIsMessagesLoading] = useState(false);
    const [messagesError, setMessagesError] = useState(null);
    const [sendTextMessageError, setSendTextMessageError] = useState(null);
    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);

    // connect
    useEffect(() => {
        if (!user) return;
        const newSocket = io("http://127.0.0.1:3000");
        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        }
    }, [user]);

    // add online user
    useEffect(() => {
        if (socket === null) return;
        socket.emit("addNewUser", user?.id);
        socket.on("getOnlineUsers", (res) => {
            setOnlineUsers(res);
        })
    }, [socket]);

    // receive message
    useEffect(() => {
        if (socket === null) return;
        
        socket.on("getMessage", res => {
            if (user.id !== res.user_id2) return;

            setMessages(prev => [...prev, res]);
        })

        return () => {
            socket.off("getMessage");
        }
    }, [socket, currentChat]);

    const getUserChats = async() => {
        if (user?.id) {
            setIsUserChatsLoading(true)
            setUserChatsError(null)

            const response = await getRequest(`${baseUrl}/chat/finduserchats?user_id=${user?.id}`)

            setIsUserChatsLoading(false)

            if (response.error) {
                return setUserChatsError(response)
            }

            setUserChats(response.user_chats)
        }
    }

    const updateCurrentChat = useCallback((chat) => {
        setCurrentChat({
            'id': chat?.id,
            'name': chat?.first_name + " " + chat?.last_name
        });
    }, []);

    const sendTextMessage = useCallback(async (textMessage, setTextMessage) => {
        setSendTextMessageError(null);
        if (!textMessage)
            return console.log("you must type something!")
        const response = await postRequest(`${baseUrl}/chat/messages/`, JSON.stringify({
            "user_id1": user?.id,
            "user_id2": currentChat?.id,
            "text": textMessage
        }));

        if (response.error) 
            return setSendTextMessageError(response);

        socket.emit("sendMessage", {
            "user_id1": user?.id,
            "user_id2": currentChat?.id,
            "text": textMessage
        });

        setMessages(prev => [...prev, response.data]);
        setTextMessage("");
    })

    const getMessages = async () => {
        setIsMessagesLoading(true);
        setMessagesError(null);

        const response = await getRequest(`${baseUrl}/chat/messages/?user_id1=${user?.id}&user_id2=${currentChat?.id}`);

        setIsMessagesLoading(false);

        if (response?.error) {
            return setMessagesError(response);
        }

        setMessages(response.data);
    }

    return (
        <ChatContext.Provider value={{
            userChats,
            isUserChatsLoading,
            userChatsError,
            getUserChats,
            updateCurrentChat,
            currentChat,
            messages,
            isMessagesLoading,
            sendTextMessage,
            getMessages,
            onlineUsers
        }}>{children}</ChatContext.Provider>
    )
};