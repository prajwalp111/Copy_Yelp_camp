const express = require('express')
const routes = express.Router()
const User = require('../models/user')
const passport = require('passport')
const catchAsync = require('../utils/catchAsync')
const { storeReturnTo } = require('../middleware')
const user = require('../controllers/users')

routes.route('/register')
    .get(user.renderRegister)
    .post(catchAsync(user.register))

routes.route('/login')
    .get(user.renderLogin)
    .post( storeReturnTo, passport.authenticate('local', { failureFlash:true, failureRedirect:'/login'}), user.login)

routes.get('/logout', user.logout);
module.exports = routes