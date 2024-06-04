import { Stack } from "react-bootstrap";

const UserChat = ({chat, user}) => {
    console.log(chat)
    return (
        <Stack
            direction="horizontal"
            gap={3}
            className="user-card align-items-center p-2 justify-content-between"
        >
            <div className="d-flex">
                <div className="me-2">
                        A
                </div>
                <div className="text-content">
                    <div className="name">{chat}</div>
                    <div className="text">Text Message</div>
                </div>
                <div className="d-flex flex-column align-items-end">
                    <div className="date">
                        01-01-2024
                    </div>
                    <div className="this-user-notifications">2</div>
                    <span className="user-online"></span>
                </div>
            </div>
        </Stack>
    );
}

export default UserChat;