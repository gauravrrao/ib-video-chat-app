const express = require("express")
const app = express()
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
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

app.post("/signup", async(req,res)=>{
    const {name, password} = req.body;
    if(user.find((val)=>val.name == name)){
        res.status(400).send("username is already present")
    }
    let salt = 10
    let hash = bcrypt.hash(password,salt)
    user.push({
        name:name,
        hash:hash
    })
    res.status(200).send("user created successfully")
})

app.post("/signin", async(req,res)=>{
    const {name, password} = req.body
    let isPresent = user.find((val)=>(val.name == name))
    let match = await bcrypt.compare(password,hash)
    if(isPresent && match){
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
