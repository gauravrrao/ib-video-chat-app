const express = require("express")
const app = express()
const jwt = require("jsonwebtoken")
const jwtsecret = "gaurav"
app.use(express.json())

let user = []

function auth(req,res,next){
    const isvalidtoken = req.headers["token"]
    let isvalid = jwt.verify(isvalidtoken,jwtsecret)
    if(isvalid){
        next()
    }else{
        res.status(400).send("invalid user")
    }
}

app.post("/signup",(req,res)=>{
    const {name, password} = req.body;
    if(user.find((val)=>val.name == name)){
        res.status(400).send("username is already present")
    }
    user.push({
        name:name,
        password:password
    })
    res.status(200).send("user created successfully")
})

app.post("/signin",(req,res)=>{
    const {name, password} = req.body
    let isPresent = user.find((val)=>(val.name == name))
    if(isPresent){
        let token = jwt.sign(name,jwtsecret)
        res.status(200).json({
            token:token
        })
    } else{
        res.status(400).send("invalid user")
    }
})

app.get("/me",auth,(req,res)=>{
    res.status(200).send("welcome")
})

app.listen(3000,()=>{console.log("app is running on port 3000")})
