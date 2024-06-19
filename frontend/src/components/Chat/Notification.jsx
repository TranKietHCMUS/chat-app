import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";
import { unreadNotificationsFunc } from "../../utils/unreadNotifications";
import moment from "moment";

const Notification = () => {
    const [isOpen, setIsOpen] = useState(false);
    const {user} = useContext(AuthContext);
    const {notifications, userChats, markAllNotificationsAsRead, markNotificationAsRead} = useContext(ChatContext);

    const unreadNotifications = unreadNotificationsFunc(notifications);

    const modifiedNotifications = notifications.map((n) => {
        const sender = userChats.find(u => u?.id === n?.senderId);

        return {
            ...n,
            senderName: sender?.first_name + " " + sender?.last_name
        }
    });

    return (
        <div className="notifications">
            <div className="notifications-icon" onClick={() => setIsOpen(!isOpen)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-chat-dots-fill" viewBox="0 0 16 16">
                    <path d="M16 8c0 3.866-3.582 7-8 7a9 9 0 0 1-2.347-.306c-.584.296-1.925.864-4.181 1.234-.2.032-.352-.176-.273-.362.354-.836.674-1.95.77-2.966C.744 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7M5 8a1 1 0 1 0-2 0 1 1 0 0 0 2 0m4 0a1 1 0 1 0-2 0 1 1 0 0 0 2 0m3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2"/>
                </svg>
                {unreadNotifications?.length !== 0 && (
                    <span className="notification-count">
                        <span>{unreadNotifications?.length}</span>
                    </span>
                )}
            </div>
            {isOpen &&
                <div className="notifications-box">
                    <div className="notifications-header">
                        <h3>Notifications</h3>
                        <div className="mark-as-read" onClick={() => markAllNotificationsAsRead(notifications)}>Mark all as read</div>
                    </div>
                    {modifiedNotifications?.length === 0 &&
                        <span className="notification">No notificaiton yet...</span>}
                    {modifiedNotifications && modifiedNotifications.map((n, index) => {
                        return (
                            <div key={index} className={n.isRead ? "notification" : "notification not-read"}
                            onClick={() => {
                                markNotificationAsRead(n, userChats, notifications);
                                setIsOpen(!isOpen);
                            }}>
                                <span>{`${n.senderName} sent you a new message`}</span>
                                <span className="notification-time">
                                    {moment(n.date).calendar()}
                                </span>
                            </div>
                        )
                    })}
                </div>
            }
        </div>
    )
};

export default Notification;