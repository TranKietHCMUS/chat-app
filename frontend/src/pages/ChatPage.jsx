import { useContext } from "react";
import { ChatContext } from "../context/ChatContext";

export default function ChatPage() {
    const {userChats, isUserChatsLoading, userChatsError} = useContext(ChatContext)
    console.log(userChats)
    return (
        <>
            Chat
        </>
    );
};