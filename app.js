const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
// const WebSocket = require("ws");
const jwt = require("jsonwebtoken");

//cors
const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

//dotenv

dotenv.config();

//App iniat
const app = express();
const server = app.listen(process.env.PORT);
// const wss = new WebSocket.Server({ server });

// wss.on("connection", (ws) => {
//   ws.send(JSON.stringify({type:"New Message",message:"Hello Client this is your first message connection !"}));
// });

// wss.on("connection", (ws) => {
//   ws.on("message", (message) => {
//     console.log(`Received message: ${message}`);
//   });
// });
// let clients = [];

// wss.on('connection', (ws) => {
//   clients.push(ws);
// });
//DB MONGO
mongoose.set("strictQuery", false);
mongoose.connect(
  process.env.DBURI,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log("Connected to DB");
  }
);

//middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors(corsOptions));

//blog model
const Blog = require("./Models/Blog");
const User = require("./Models/User");


//Routes
app.get("/", (req, res) => {
  res.send("Hello");
});

app.post("/api/insert/blog", (req, res) => {
  const newBlog = new Blog(req.body);
  newBlog.save((err, blog) => {
    if (err) {
      res.status(500).send(err);
    } else {
      // clients.forEach((client) => {
      //   client.send(JSON.stringify({ type: 'newBlog',blog }));
      // });
      res.status(200).send(blog);
    }
  });
});

app.get("/api/blogs", (req, res) => {
  Blog.find({}, (err, blogs) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(blogs);
    }
  });
});

app.post("/api/user/login", (req, res) => {
  let { email, password } = req.body;
  if (email && password) {
    User.findOne({ email }).then((response) => {
      if (response) {
        if (response.password === password) {
          const token = jwt.sign({ id: response.id }, process.env.SECRET, {
            expiresIn: "1h",
          });
          res.send({ success: true, token });
        } else {
          res.send({
            success: false,
            message: "Incorrect password. Please try again.",
          });
        }
      } else {
        res.send({
          success: false,
          message: "Email not found! Please try a correct Email.",
        });
      }
    });
  } else {
    res.send({
      success: false,
      message:
        "Error: Missing credentials. Please Provide `Email` and to succeeded.",
    });
  }
});