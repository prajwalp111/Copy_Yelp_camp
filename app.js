const express = require('express')
const app = express();
const path = require('path');
const mongoose = require('mongoose')
const ejsMate = require('ejs-mate')
const methodOverride = require('method-override')
const ExpressError = require('./utils/ExpressError')
//routes
const userRoutes = require('./routes/user')
const campgroundRoutes = require('./routes/campgrounds')
const reviewRoutes = require('./routes/reviews')

const session = require('express-session')
const flash = require('connect-flash')

const User = require('./models/user')

const passport = require('passport')
const LocalStrategy = require('passport-local')

const sessionConfig = {
    secret : 'thisisaverydangerousplace',
    resave : false,
    saveUninitialized : true,
    cookie : {
        httpOnly : true,
        expire : Date.now() + 1000 * 60 * 60 * 7 * 24,
        maxAge : 1000 * 60 * 60 * 7 *24

    }
} 

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');

app.use(express.urlencoded({ extended: true }));
app.engine('ejs',ejsMate);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')))
//app.use(express.static('public'))

app.use(session(sessionConfig))

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())             //how to store user info
passport.deserializeUser(User.deserializeUser())         //how to extract user info

const db = mongoose.connection;
db.on("error",console.error.bind(console,"connection error:"));
db.once('open',()=>{
    console.log('Database connection established');
});

app.get('/', (req, res)=>{
    res.render('home');
})

app.use(flash());

app.use((req, res, next)=>{
    res.locals.currentUser = req.user
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next();
})

app.use('/', userRoutes)
app.use('/campgrounds', campgroundRoutes)
app.use('/campgrounds/:id/reviews', reviewRoutes)

app.all(/(.*)/,(req, res, next)=>{
    next(new ExpressError('NOT FOUND', 404))
})

app.use((err, req, res, next)=>{
    const { statusCode = 500} =err;
    if(!err.message) err.message = 'somrthing went wrong..... e..r...r...o...r...';
    res.status(statusCode).render('error',{ err });    
})

app.listen(5050,()=>{
    console.log('Connection opened at port 5050')
})

