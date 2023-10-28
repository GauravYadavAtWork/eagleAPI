import { Server } from 'socket.io';

const chatappCode = (server)=>{
  
    console.log("Chat App Server Listening for Sockets");
    const io = new Server(server, {
        cors: {
            origin: true,
        },
    });
    
    const chatapp =  io.of("chatapp");
    
    chatapp.use((socket,next)=>{
       if(socket.handshake.auth.token==="hehe"){
        socket.status="connected";
        next();
       }else{
        socket.status="invalid";
        next(new Error ("Unauthorized User"));
       }
    });
    
    
    chatapp.on('connection',socket=>{
        console.log("id:"+socket.id); // Logging the socket ID for every new connection is established.
        // Listening for the 'send-Message' event 
        socket.on("send-Message",(message,room)=>{
            console.log(`Received room id :`+room); // Logging the room ID.
            console.log("message is : "+message); // Logging the message.
    

            if(room===''){
                socket.broadcast.emit("recive-message",message); // Braadcasting 
            }else{
                socket.to(room).emit("recive-message",message); // Sending the message to the specified room.
            }
        });
        socket.on("join-room", (room, callback) => {
            socket.join(room);
            if (callback && typeof callback === 'function' && room!=="") {
                callback(`Joined : ${room}`);
            } else {
                console.log("Callback not provided or not a function.");
            }
        });
    });  
};

export default chatappCode;