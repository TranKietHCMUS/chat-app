import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function ChatPage() {
    const {user} = useContext(AuthContext);
    return (
        <>
            <span className='text-warning'>Logged in as {user?.username}</span>
        </>
    );
};