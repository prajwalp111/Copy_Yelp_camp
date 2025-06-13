const express = require('express')
const routes = express.Router()
const User = require('../models/user')
const passport = require('passport')
const catchAsync = require('../utils/catchAsync')
const { storeReturnTo } = require('../middleware');

routes.get('/register', (req, res)=>{
    res.render('users/register')
})

routes.post('/register', catchAsync(async(req, res, next)=>{
    try{
        const { username, email, password } = req.body;
        const user = new User({email, username})
        const registeredUser = await User.register(user, password)   // ()   {x}
        req.login(registeredUser, function (err) {          //registeredUser  we r passong this bcoz login needs to konwn which user is logging in
        if (err) {
            return next(err);
        }
        req.flash('success', 'Welcome to the Campgrounds')
        res.redirect('/campgrounds')
    });
        
    }catch(e){
        req.flash('error',e.message)
        res.redirect('/register')
    }
}))

routes.get('/login',(req, res)=>{
    res.render('users/login')
})

routes.post('/login', storeReturnTo, passport.authenticate('local', { failureFlash:true, failureRedirect:'/login'}), (req, res)=>{
    req.flash('success','Welcome back to the campgrounds')
    const redirectUrl = res.locals.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
})

routes.get('/logout', (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/campgrounds');
    });
});
module.exports = routes