const express = require('express');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
var bodyParser = require('body-parser')
  
const app = express();
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
var cors = require('cors')
app.use(cors())
// Set up Global configuration access
dotenv.config({ path: 'app.env' })


app.get("/",(req,res)=>{
  res.send("ok")
})
//
app.post("/api-authenticate/login",(req,res)=>{
  if(req.body.username=="admin" && req.body.password=="admin"){
    let jwtSecretKey = process.env.JWT_SECRET_KEY;
    let data = {
        time: Date(),
        user: "admin",
    }
    const token = jwt.sign({data:data, exp: Math.floor(Date.now() / 1000) + (60 * 60)}, jwtSecretKey);
    res.header(process.env.TOKEN_HEADER_KEY,token);
    res.send(token);
  }else{
    res.send("login fail")
  }
   
});

app.post("/api-authenticate/validate",(req,res)=>{
   let token = req.body.token;
   let jwtSecretKey = process.env.JWT_SECRET_KEY; 
    try {
        const verified = jwt.verify(token, jwtSecretKey);
        if(verified){
            return res.json(verified);
        }else{
            // Access Denied
            return res.status(401).send(error);
        }
    } catch (error) {
        // Access Denied
        return res.status(401).send(error);
    }
})
  
let PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is up and running on ${PORT} ...`);
});