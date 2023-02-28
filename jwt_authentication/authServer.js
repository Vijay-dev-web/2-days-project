const express = require('express')
const app = express()
app.use(express.json())
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv-defaults').config()

let masterUsers = []

app.post('/user/signup', async (req, res) => {
    if(!req.body.password || !req.body.username) {
        res.status(400).json({
            error: "Username and Password are mandatory"
        })
        console.log(req.body);
    } else {
        let password = await bcrypt.hash(req.body.password, 10)
    let user = {
        name: req.body.username,
        password: password
    }
    masterUsers.push(user)
    res.status(201).json({
        success: "User successfully created"
    })
    }
    
})

app.post('/user/login', async (req, res) => {
    if(!req.body.username || !req.body.password) res.status(401).json({
        error: "Username or Password cannot be empty"
    })
    console.log('masterUsers : ', masterUsers);
    let user = masterUsers.find(user => user.name === req.body.username)
    if(!user) {
        res.status(401).send({
            message: "User not found"
        })
    }
    if(!await bcrypt.compare(req.body.password, user.password)) {
        res.status(403).send({
            error: "Invalid Password!!!"
        })
    } else {
        let userAccess = {
            name: user.name
        }
        let accessToken = jwt.sign(userAccess, process.env.ACCESS_TOKEN, {expiresIn: '20s'})
        let refreshToken = jwt.sign(userAccess, process.env.REFRESH_TOKEN, {expiresIn: '1m'})
        res.status(200).send({
            accessToken: accessToken,
            refreshToken: refreshToken
        })
    }

    
})

app.get('/token', (req, res) => {
    let token = req.headers['authorization']
    token = token.split(' ')[1]
    if(!token) res.status(401).json({ error: 'No auth token specified'})
    jwt.verify(token, process.env.REFRESH_TOKEN, (err, data) => {
        if(err) res.status(403).json({
            error: "Invalid token"
        })
        let accessToken = generateAccessToken(data)
        res.status(200).json({
            accessToken: accessToken
        })
    })
})

function generateAccessToken(user) {
    console.log('USER : ', user);
    let accessToken = jwt.sign(user, process.env.ACCESS_TOKEN)
    return accessToken
}

app.listen(4000, () => {
    console.log(`Auth serve started @ 4000`);
})