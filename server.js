require('dotenv').config(); // Load variables from .env f
var express = require("express")
var bodyParser = require("body-parser")
var app = express()
var http = require("http").Server(app)
var io = require("socket.io")(http)
var mongoose = require("mongoose")
var port = process.env.PORT || 5000

app.use(express.static(__dirname))
app.use(bodyParser.json()) 
app.use(bodyParser.urlencoded({extended:true})) 

var db_urls = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.PASSWORD_KEY}@mongo-cluster-node.apqemg5.mongodb.net/?appName=mongo-cluster-node`

var Message = mongoose.model("Message",{
    name:String,
    message:String
})


app.get("/messages",(req,res)=>{
    Message.find({})
    .then(messages => res.send(messages))
    .catch(err => res.sendStatus(500))
})

app.post("/messages",(req,res)=>{
    var message = new Message(req.body)
    message.save()
    .then(() => {
        io.emit("message", req.body)
        res.sendStatus(200)
    })
    .catch(err => {
        res.sendStatus(500)
    })
})

io.on("connection",(socket)=>{
    console.log("a user connected")
})

mongoose.connect(db_urls)
    .then(() => {
        console.log("MongoDB connected successfully");
    })
    .catch((err) => {
        console.error("MongoDB connection error:", err);
    });

var server = http.listen(port,()=>{
    console.log("Server is running on port",port)
})