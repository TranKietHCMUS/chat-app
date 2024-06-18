const {Server} = require("socket.io");
const io = new Server({cors: "http://127.0.0.1:5173"});

let onlineUsers = []

io.on("connection", (socket) => {
    console.log("new connection ", socket.id);

    //listen to a connection
    socket.on("addNewUser", (userId) => {
        userId !== null &&
        !onlineUsers.some((user) => user.userId === userId) &&
            onlineUsers.push({
                userId,
                socketId: socket.id
            });
        console.log("online users: ", onlineUsers);

        io.emit("getOnlineUsers", onlineUsers);
    });

    // send message
    socket.on("sendMessage", (message) => {
        const user = onlineUsers.find((user => user.userId === message.user_id2));

        if (user) {
            io.to(user.socketId).emit("getMessage", message);
        }
    })

    // disconnect
    socket.on("disconnect", () => {
        onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);

        io.emit("getOnlineUsers", onlineUsers);
    });
});

io.listen(3000);