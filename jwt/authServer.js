const express = require('express')
const app = express()
app.use(express.json())
require('dotenv').config()
const jwt = require('jsonwebtoken')

refresh_tokens = []
app.post('/login', (req, res) => {

    let user = req.body
    let access_token = jwt.sign(user, process.env.SECRET_ACCESS_TOKEN, {expiresIn: '10s'})
    let refresh_token = jwt.sign(user, process.env.REFRESH_ACCESS_TOKEN)
    refresh_tokens.push(refresh_token)
    res.json({
        access_token: access_token,
        refresh_token: refresh_token
    })
})

app.post('/token', (req, res) => {
    let token = req.headers['authorization']
    token = token.split(' ')[1]
    if(token && token != null){
        if(!refresh_tokens.includes(token)) res.sendStatus(403)
        jwt.verify(token, process.env.REFRESH_ACCESS_TOKEN, (err, user) => {
            if(err) {
                res.sendStatus(403)
            }
            let access_token = generateAccessToken(user)
            res.json({
                access_token: access_token
            })
        })
    } else {
        res.sendStatus(401)
    }
})

app.get('/logout', (req, res) => {
    refresh_tokens = []
    res.sendStatus(200)
})

function generateAccessToken(user) {
    let tok = jwt.sign(user, process.env.SECRET_ACCESS_TOKEN, {expiresIn: '20s'})
    return tok;
}

app.listen(4000, () => {
    console.log('Server started at port 4000');
})