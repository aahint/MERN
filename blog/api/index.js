require("dotenv").config();
const User = require("./models/User");
const cors = require("cors");
const express = require("express");
const bcrypt = require("bcryptjs");
const { default: mongoose } = require("mongoose");
const app = express();
const jwt = require("jsonwebtoken");
const cookieParser = require('cookie-parser')
const multer = require('multer')
const uploadMiddleware = multer({dest : 'uploads/'})
const fs = require('fs');

const Post = require('./models/Post')

const salt = bcrypt.genSaltSync(10);

// Secrets come from environment variables (see .env.example), never from the code.
const secret = process.env.JWT_SECRET;
if (!process.env.MONGO_URI || !secret) {
  console.error("Missing MONGO_URI or JWT_SECRET. Copy .env.example to .env and fill in both values.");
  process.exit(1);
}

app.use(cors({credentials:true,origin:'http://localhost:3000'}));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirname + '/uploads'));

mongoose.connect(process.env.MONGO_URI);

app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    const userDoc = await User.create({
      username,
      password: bcrypt.hashSync(password, salt),
    });
    res.json(userDoc);
  } catch (e) {
    console.log(e);
    res.status(400).json(e);
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const userDoc = await User.findOne({ username });
  if (userDoc == null) {
    res.status(400).json("Username doesnt exits");
  } else {
    const passOk = bcrypt.compareSync(password, userDoc.password);
    if (passOk) {
      jwt.sign({ username, id: userDoc._id }, secret, {}, (err, token) => {
        if (err) {
          throw err;
        }
        //You are setting a cookie named "token" in the client’s browser with the value of your JWT token.
        //This cookie will be stored by the browser.
        //On future requests to your server (same domain), the browser automatically sends this "token" cookie.
        //Your backend can then read this token from req.cookies.token to verify the user’s identity or session.
        //This is a common way to keep the user logged in using JWTs stored in cookies.
        res.cookie("token", token).json({
          id:userDoc._id,
          username,
        });
      });
    } else {
      res.status(400).json("wrong credentials");
    }
  }
});

app.get('/profile',(req,res)=>{
  const {token} = req.cookies;
  jwt.verify(token,secret,{},(err,info)=>{
    if(err){
      throw err;
    }
    res.json(info);
  })
})


app.post('/logout',(req,res) => {
  res.cookie('token','').json('ok');
})

app.post('/post', uploadMiddleware.single('file'), async (req,res) => {
  const {originalname,path} = req.file;
  const parts = originalname.split('.');
  const ext = parts[parts.length - 1];
  const newPath = path+'.'+ext;
  fs.renameSync(path, newPath);

  const {token} = req.cookies;
  jwt.verify(token, secret, {}, async (err,info) => {
    if (err) throw err;
    const {title,summary,content} = req.body;
    const postDoc = await Post.create({
      title,
      summary,
      content,
      cover:newPath,
      author:info.id
    });
    res.json(postDoc);
  });

});

//returns all posts in the db in a list
app.get('/post', async (req,res) => {
  res.json(
    await Post.find()
      .populate('author', ['username'])
      .sort({createdAt: -1})
      .limit(20)
  );
});

app.get('/post/:id',async (req,res) => {
  const {id} = req.params
  const postDoc = await Post.findById(id).populate('author',['username']);
  res.json(postDoc)
})

app.get('/edit/:id')

app.listen(4000);
