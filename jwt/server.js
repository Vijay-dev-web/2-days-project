require('dotenv').config()
const express = require('express')
const app = express()
const jwt = require('jsonwebtoken')
const secret_access_token = "20cda240ddf850"
const secret_refresh_token = "5213d644754e70"
app.use(express.json())

const posts = [{
    name: "Sahaya",
    title: "Post1"
}, {
    name: "Vijay",
    title: "Post2"
}]

app.get('/posts', authUser, (req, res) => {
    let result = posts.filter(item => item.name === req.user)
    // console.log(result);
    res.send(result)
})

function authUser (req, res, next) {
    let token = req.headers['authorization']
    console.log('Token 1 : ', token);   
    if(token && token != null) {
        token = token.split(' ')[1]
        console.log('token2 : ', token);
        jwt.verify(token, secret_access_token, (err, user) => {
            if(err) {
                res.status(403).send()
            }
            console.log('user : ', user);
            req.user = user.username
        })
        
    } else {
        res.status(401).send()
    }
    next()
}

app.listen(3000, () => {
    console.log('Server listeneing');
})