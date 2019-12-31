const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");


require("dotenv").config();

const app = express();

//import api
const users = require("./routes/api/users");
const profile = require("./routes/api/profile");
const posts = require("./routes/api/posts");


mongoose.set('useFindAndModify', false);

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

mongoose.connect(process.env.DB_HOST,{ useNewUrlParser: true , useUnifiedTopology:true })
        .then(()=> console.log("DB Connected"))
        .catch(err => console.log(err));

app.get("/",(req,res)=>{
  res.send("hello");
})

app.use("/api/users", users);
app.use("/api/profile", profile);
app.use("/api/posts", posts);

const port = process.env.PORT || 5000;
app.listen(port,()=>{
console.log(`server running on ${port}`)
});