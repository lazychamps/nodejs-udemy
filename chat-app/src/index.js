const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const Badwords = require("bad-words");
const {
  generateMessages,
  generateLocationMessages,
} = require("./utils/messages");
const {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
} = require("./utils/users");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;
const publicDirPath = path.join(__dirname, "../public");

app.use(express.static(publicDirPath));

io.on("connection", (socket) => {
  console.log("connected", socket.id);

  socket.on("join", ({ username, room }, callback) => {
    console.log({ username, room });
    const { error, user } = addUser({ id: socket.id, username, room });
    console.log({ user });

    if (error) {
      return callback(error);
    }

    socket.join(user.room);

    socket.emit("message", generateMessages("Admin", "Welcome"));
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        generateMessages("Admin", `${user.username} has joined`)
      );
    io.to(user.room).emit("roomData", {
      room: user.room,
      users: getUsersInRoom(user.room),
    });
  });

  socket.on("sendMessage", (message, callback) => {
    const user = getUser(socket.id);
    const badWords = new Badwords();

    if (badWords.isProfane(message)) {
      return callback("Profanity is not allowed");
    }

    io.to(user.room).emit("message", generateMessages(user.username, message));
    callback();
  });

  socket.on("disconnect", () => {
    const user = removeUser(socket.id);
    if (user) {
      io.to(user.room).emit(
        "message",
        generateMessages("Admin", `${user.username} has left`)
      );
      io.to(user.room).emit("roomData", {
        room: user.room,
        users: getUsersInRoom(user.room),
      });
    }
  });

  socket.on("sendLocation", (location, callback) => {
    const user = getUser(socket.id);
    io.to(user.room).emit(
      "locationMsg",
      generateLocationMessages(user.username, location)
    );
    callback();
  });
});

server.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
