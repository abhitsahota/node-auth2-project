const router = require("express").Router();
const methods = require('./user-methods')

const bcryptjs = require("bcryptjs");
const jwt = require('jsonwebtoken')

const secrets = require('../config/secrets')

router.post('/register', inputCheck, async (req, res, next) => {
    let user = req.body

    const hash = bcryptjs.hashSync(user.password, 4);
    user.password = hash

    try {
        const result = await methods.add(user)
        res.status(200).json({ result: result })
    }
    catch (err) {
        res.sendStatus(401)
        console.log('registration error', err)
    }

})

router.post('/login', inputCheck, async (req, res, next) => {
    const { username, password } = req.body;

    try {
        const user = await methods.findBy(username)
        console.log(user.password)

        if (user && bcryptjs.compareSync(password, user.password)) {
            const token = generateToken(user)
            res.status(200).json({ msg: "Welcome", token });
        } else {
            res.status(401).json({ msg: "Invalid credentials" });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
        console.log(err)
    }
})

router.get('/users', sessionCheck, async (req, res, next) => {
    try {
        const result = await methods.find()
        res.status(200).json({ result: result })
    } catch {
        res.sendStatus(500)
        console.log('server error', err)
    }
})

// router.get('/logout', async (req, res, next) => {
    
// })


// Middleware

function inputCheck(req, res, next) {
    const user = req.body

    if (user.username && user.password && typeof user.password === "string") {
        next()
    } else {
        res.sendStatus(400)
    }
}

function sessionCheck(req, res, next) {
    const token = req.headers.authorization

    if (token) {
      jwt.verify(token, secrets.jwtSecret, (err, decodeToken) => {
        err ? res.sendStatus(401) : req.decodedJWT = decodeToken
        next()
      })
    } else {
      res.sendStatus(401)
    }
}

function generateToken(user) {
    const payload = {
      subject: user.id,
      username: user.username,
      department: user.department
    }
  
    const options = {
      expiresIn: '1d'
    }
  
    return jwt.sign(payload, secrets.jwtSecret, options)
  }

module.exports = router