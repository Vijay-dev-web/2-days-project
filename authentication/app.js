const express = require('express')
const bcrypt = require('bcrypt')
const app = express()
app.use(express.json())

let users = [];

app.post('/user/signup', async (req, res) => {
    try {
        let password = await bcrypt.hash(req.body.password, 10)
        let user = {
            name: req.body.username,
            password: password
        }
        console.log('user : ', user);
        users.push(user)
        res.sendStatus(201)
    } catch (err) {

    }

})

app.post('/user/login', async (req, res) => {
    let user = users.find(user => user.name === req.body.username)
    if (!user) res.status(401).send(`user ${req.body.username} not found, please register`)
    try {
        if (await bcrypt.compare(req.body.password, user.password)) {
            res.sendStatus(200)
        } else {
            res.status(403).send('Invalid Passowrd!!!')
        }
    } catch (err) {
        res.sendStatus(500)
    }


})

app.listen(3000, () => {
    console.log('Server started');
})