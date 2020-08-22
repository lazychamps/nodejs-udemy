const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;
const publicDirPath = path.join(__dirname, "../public");

app.use(express.static(publicDirPath));

io.on("connection", (socket) => {
  console.log("connected", socket.id);

  socket.emit("message", "Welcome");
  socket.broadcast.emit("message", `User ${socket.id} had joined`);

  socket.on("sendMessage", (message) => {
    io.emit("message", message);
  });

  socket.on("disconnect", () => {
    io.emit("message", `User ${socket.id} is left`);
  });

  socket.on("sendLocation", ({ latitude, longitude }) => {
    io.emit(
      "message",
      `Location : http://google.com/map?q=${latitude},${longitude} `
    );
  });
});

server.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
