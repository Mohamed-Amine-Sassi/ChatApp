import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
const app = express();
const port = process.env.PORT || 4000;

const server = createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

const socketSet = new Set();
io.on("connection", (socket) => {
  socketSet.add(socket.id);
  io.emit("numberOfConnection", socketSet.size);

  socket.on("disconnect", () => {
    socketSet.delete(socket.id);
    io.emit("numberOfConnection", socketSet.size);
  });

  socket.on("message", (data) => {
    console.log(data);
    io.emit("rseved_msg", data);
  });
});

server.listen(port, () => {
  console.log("Chat App Server Working ... ");
});
