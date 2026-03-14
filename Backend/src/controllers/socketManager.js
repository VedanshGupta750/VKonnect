import path from "node:path";
import { Server } from "socket.io";

let connections = {};
let messages = {};
let timeOnline = {};

const connectToSOcket = (server) => {
  const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: "*",
    credentials: true
  }
});
  // To join new user in the chatroom
  io.on("connection", (socket) => {
    socket.on("join-call", (path) => {
      if (connections[path] === undefined) {
        connections[path] = [];
      }
      connections[path].push(socket.id);
      timeOnline[socket.id] = new Date();
      // send all(notify) the user that new user has joined the chatroom
      for (let a = 0; a < connections[path].length; a++) {
        io.to(connections[path][a]).emit(
          "user-joined",
          socket.id,
          connections[path],
        );
      }
      // send messages to newly joined person in chatroom
      if (messages[path] !== undefined) {
        for (let a = 0; a < messages[path].length; ++a) {
          io.to(socket.id).emit(
            "chat-messages",
            messages[path][a]["data"],
            messages[path][a]["sender"],
            messages[path][a]["socket-id-sender"],
          );
        }
      }
    });

    socket.on("signal", (toId, message) => {
      io.to(toId).emit("signal", socket.id, message);
    });
      // listen for chat message from user
    socket.on("chat-messages", (data, sender) => {
      // Find user from which chatroom they belongs to
      const[matchingRoom ,found ]= Object.entries(connections)
      // loop to check each room 
        .reduce(([room , isFound] , [roomKey , roomValue])=>{
          if(!isFound && roomValue.includes(socket.id)){
            return [roomKey , true]
          }
          return [room , isFound] // user not found
        },  ['' , false]); // if their is no user available in the room
        if(found === true){
          if(messages[matchingRoom]=== undefined){
            messages[matchingRoom]=[]
          }
          // Send the history of chat for all the user
          messages[matchingRoom].push({'sender': sender , "data":data , "socket-id-sender":socket.id})
          console.log("messages" , key ,':' , sender, data)

          connections[matchingRoom].forEach(element => {
            io.to(element).emit("chat-message" , data , sender , socket.id)
          });
        }
    });

    socket.on("disconnect", () => {
      // users time in meeting
      let diffTime = Math.abs(timeOnline[socket.id] - new Date());

      let key;
      // Loop through all rooms k-->room name v--> Array of socketid in that room
      for( const[k ,v ] of JSON.parse(JSON.stringify(Object.entries(connections)))){
        for(let a=0; a<v.length ; ++a){
          //Check whether the user is disconnected and if yes
          if(v[a]===socket.id){
            key = k;
            // Notify all the user that user is disconnected from the room
            for(let a=0; a< connections[key].length ; a++){
              io.to(connections[key][a]).emit('user-left' , socket.id)
            }
            // Remove the user from the room
            let index = connections[key].indexOf(socket.id)
            connections[key].splice(index , 1);
            //Delete the room if it is empty
            if(connections[key].length === 0){
              delete connections[key]
            }
          }
        }
      }
    });

    return io;
  });
};

export default connectToSOcket;
