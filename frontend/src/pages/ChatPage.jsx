import { useContext, useEffect } from "react";
import { ChatContext } from "../context/ChatContext";
import { Container, Stack } from "react-bootstrap";
import UserChat from "../components/Chat/UserChat";
import { AuthContext } from "../context/AuthContext";
import ChatBox from "../components/Chat/ChatBox";


export default function ChatPage() {
    const {user} = useContext(AuthContext);
    const {userChats, isUserChatsLoading, userChatsError, getUserChats, updateCurrentChat} = useContext(ChatContext);

    useEffect(() => {
        getUserChats();
    }, [user])

    return (
        <Container>
            {userChats?.length < 1 ? null : (
            <Stack direction="horizontal" gap={4} className="align-items-start">
                <Stack className="messages-box flex-grow-0 pe-3" gap={3}>
                    {isUserChatsLoading && <p>Loading chats...</p>}
                    {userChats?.map((chat, index) => {
                        return (
                            <div key={index} onClick = {() => updateCurrentChat(chat)}>
                                <UserChat chat={chat} user={user}/>
                            </div>
                        )
                    })}
                </Stack>
                <ChatBox />
            </Stack>)}
        </Container>    
    );
};