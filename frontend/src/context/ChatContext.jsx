import { createContext, useEffect, useState } from "react";
import { baseUrl, getRequest, postRequest } from "../utils/services";

export const ChatContext = createContext();

export const ChatContextProvider = ({children, user}) => {
    const [userChats, setUserChats] = useState(null)
    const [isUserChatsLoading, setIsUserChatsLoading] = useState(false)
    const [userChatsError, setUserChatsError] = useState(null)

    const getUserChats = async() => {
        if (user?.username) {
            setIsUserChatsLoading(true)
            setUserChatsError(null)

            const response = await getRequest(`${baseUrl}/finduserchats?username=${user?.username}`)

            setIsUserChatsLoading(false)

            if (response.error) {
                return setUserChatsError(response)
            }

            setUserChats(response.user_chats)
        }
    }

    useEffect(() => {
        getUserChats()
    }, [user])

    return (
        <ChatContext.Provider value={{
            userChats,
            isUserChatsLoading,
            userChatsError
        }}>{children}</ChatContext.Provider>
    )
};