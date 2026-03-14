import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import cors from "cors";
import dns from "dns";
import connectToSocket from "./controllers/socketManager.js";

dns.setServers(["1.1.1.1" , "8.8.8.8"])

import userRoutes from './routes/users.routes.js'
const app = express();
const server = createServer(app);
const io = connectToSocket(server);

const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json({ limit:"40kb"}));
app.use(express.urlencoded({limit: "40kb" , extended:true}))

app.use('/api/v1/users', userRoutes);
const start = async () => {
  const connectionWithDB = await mongoose
    .connect(
      "mongodb+srv://vedanshgupta750_db_user:HJKvs38sX1lD5YiL@cluster0.93iftlu.mongodb.net/",
    )
    console.log(`Connection to DB Successfull Host is ${connectionWithDB.connection.host}`)
  server.listen(port, () => {
    console.log("Server is running on http://localhost:5000");
  });
};

start();
