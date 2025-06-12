const express = require('express')
const routes = express.Router()
const User = require('../models/user')

routes.get('/register', (req, res)=>{
    res.render('users/register')
})

routes.post('/register', async(req, res)=>{
    res.send(req.body)
})

module.exports = routes