const express=require("express");
const app=express();
const path=require("path");
// we need to setup socket.io and socket io runs on http server
const http=require("http");
const socketio=require("socket.io"); 
// http server is a package that comes preinstalled in node
// its only method that we use and require are
const server=http.createServer(app);
// now we call socket io
const io=socketio(server);
// setting up ejs and publuc folder as static that will contain our images, css vgera hai
// handle socket io connection from backend
io.on("connection",function(socket){
    // ab hum yaha geolocation wala socket i.e send-location yaha accept krenge
    socket.on("send-location",function(data){ // data jo us socket se aa rha hoga
        // ab values agyi hai inko frontend pe aur sbko jo connected hai unhe bhejna hai
        //io.emit means jitne log connected hai sb ko dikhegi
        io.emit("recieve-location",{id:socket.id,...data});
    })
    socket.on("disconnect",function(){
        io.emit("user-disconnected",socket.id);
    })
    console.log("connected");
})
app.set("view engine","ejs");
app.use(express.static(path.join(__dirname,"public")));
app.get("/",function(req,res){
    res.render("index"); // index isliye kyunki hmme index page render krna hai
})
// after setting server change app to server
// app.listen(3000);
server.listen(3000);