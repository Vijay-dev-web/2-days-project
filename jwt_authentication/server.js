const express = require('express')
const app = express()
app.use(express.json())
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv-defaults').config()

let posts = [{
    name: "Sahaya",
    title: "Post-1"
}, {
    name: "Vijay",
    title: "Post-2"
}]

app.get('/posts', authUser, (req, res) => {
    let results = posts.find(post => post.name === req.user.name)
    res.status(200).send(results)
})

function authUser(req, res, next) {
    let token = req.headers['authorization']
    token = token.split(' ')[1]
    if(!token) res.status(400).json({
        error: "Token not specified"
    })
    jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
        if(err) {
            console.log('err : ', err);
            res.status(403).json({
                error: "Unauthorized!!!"
            })
        }
        req.user = user
    })
    next()
}

app.listen(3000, () => {
    console.log('Server started @ 3000');
})



