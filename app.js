const express = require("express");
const userModel = require("./models/user");
const cookieParser = require("cookie-parser");
const app = express();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("Register");
});

app.post("/register", (req, res) => {
  let { studentname, email, password } = req.body;

  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, async (err, hash) => {
      let createUser = await userModel.create({
        studentname,
        email,
        password: hash,
      });

      

      let token = jwt.sign({ email }, "secret");
      res.cookie("token", token);

       res.send("User registered successfully");
    });
  });
});

app.get("/login", (req, res) => {
  res.render("Login");
});

app.post("/login", async (req, res) => {
  let { email, password } = req.body;
  let User = await userModel.findOne({ email });
  if (!User) return res.send("something went wrong");

  let result = await bcrypt.compare(password, User.password);

  if (!result) return res.send("Invalid credentials");

  let token = jwt.sign({ email: User.email, id: User._id }, "secret");
  res.cookie("token", token);

  res.send("Login successful");
  console.log(email, password);
  console.log(User);
  console.log(User.password);
});

app.get('/profile',(req,res)=>{
    let token=req.cookies.token;

    if(!token) return res.send('login required');

    let decoded=jwt.verify(token,'secret');

    res.send("Welcome " + decoded.email);
})

app.get('/logout',(req,res)=>{
    res.cookie('token','');
    res.send('Loged out')
})

app.listen(3000, () => {
  console.log("running");
});
