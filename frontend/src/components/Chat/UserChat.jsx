import { Stack } from "react-bootstrap";
import male from "../../assets/male.svg"
import female from "../../assets/female.svg"
import { useContext, useEffect, useState } from "react";
import { ChatContext } from "../../context/ChatContext";
import { unreadNotificationsFunc } from "../../utils/unreadNotifications";
import { baseUrl, getRequest } from "../../utils/services";
import moment from "moment";

const UserChat = ({chat, user}) => {
    const {onlineUsers, notifications, markThisUserNotificationsAsRead, newMessages} = useContext(ChatContext);
    const unreadNotifications = unreadNotificationsFunc(notifications);
    const [latestMessage, setLatestMessage] = useState({});
    const thisUserNotifications = unreadNotifications?.filter(
        n => n.senderId == chat?.id
    );

    useEffect(() => {
        const getMessage = async () => {
            const response = await getRequest(`${baseUrl}/chat/getlatestmessage/?user_id1=${user?.id}&user_id2=${chat?.id}`);
            if (response?.error) {
                console.log(response);
            }
            else {
                setLatestMessage(response?.data);
            }
        }

        getMessage();
    }, [newMessages ,notifications]);

    const truncateText = (text) => {
        let shortText = text.substring(0, 20);
        if (text.length > 20) {
            shortText += "...";
        }
        return shortText;
    };

    return (
        <Stack
            direction="horizontal"
            gap={3}
            className="user-card align-items-center p-2 justify-content-between"
            role="button"
            onClick={() => markThisUserNotificationsAsRead(thisUserNotifications, notifications)}
        >
            <div className="d-flex">
                <div className="me-2">
                    {chat?.gender == "Male" ? <img src={male} height="35px"></img> : <img src={female} height="35px"></img>}
                </div>
                <div className="text-content">
                    <div className="name">{chat?.first_name + " " + chat?.last_name}</div>
                    <div className="text">
                        {latestMessage?.text && (
                            <span>{truncateText(latestMessage.text)}</span>
                        )}
                    </div>
                </div>
                <div className="d-flex flex-column align-items-end">
                    <div className="date">
                        {moment(latestMessage?.time).calendar()}
                    </div>
                    <div className={thisUserNotifications.length > 0 && "this-user-notifications"}>{thisUserNotifications?.length > 0 && thisUserNotifications.length}</div>
                    {onlineUsers?.some((u) => u?.userId === chat?.id) && <span className="user-online"></span>}
                </div>
            </div>
        </Stack>
    );
}

export default UserChat;