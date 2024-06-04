import { createContext, useEffect, useState } from "react";
import { baseUrl, getRequest, postRequest } from "../utils/services";

export const ChatContext = createContext();

export const ChatContextProvider = ({children, user}) => {
    const [userChats, setUserChats] = useState(null)
    const [isUserChatsLoading, setIsUserChatsLoading] = useState(false)
    const [userChatsError, setUserChatsError] = useState(null)

    const getUserChats = async() => {
        if (user?.id) {
            setIsUserChatsLoading(true)
            setUserChatsError(null)

            const response = await getRequest(`${baseUrl}/finduserchats?user_id=${user?.id}`)

            setIsUserChatsLoading(false)

            if (response.error) {
                return setUserChatsError(response)
            }

            console.log(response?.detail)

            setUserChats(response.user_chats)
        }
    }

    return (
        <ChatContext.Provider value={{
            userChats,
            isUserChatsLoading,
            userChatsError,
            getUserChats
        }}>{children}</ChatContext.Provider>
    )
};