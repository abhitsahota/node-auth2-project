const express = require("express");
const cors = require("cors");

const usersRouter = require("./api/users-router");

const server = express();

server.use(express.json());
server.use(cors());

server.use("/api", usersRouter);

server.get("/", (req, res) => {
  res.json({ msg: 'working' });
});

module.exports = server;
