if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
 // require('dotenv').config();

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

const helmet = require('helmet')
const MongoStore = require('connect-mongo')

/////////////
const DB_URL =process.env.DB_URL;
////////////

const secret =process.env.SECRET;

const sanitizeV5 = require('./utils/mongoSanitizeV5.js');
app.set('query parser', 'extended');

const store = MongoStore.create({
    mongoUrl: DB_URL,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret: 'thisshouldbeabettersecret!'
    }
});
store.on("error", function(e){
    console.log("session store error ")
})

const sessionConfig = {
    store,
    name : 'session',
    secret,
    resave : false,
    saveUninitialized : true,
    cookie : {
        httpOnly : true,
        //safe : true,
        expire : Date.now() + 1000 * 60 * 60 * 7 * 24,
        maxAge : 1000 * 60 * 60 * 7 *24

    }
} 

mongoose.connect(DB_URL);

app.use(express.urlencoded({ extended: true }));
app.engine('ejs',ejsMate);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')))
//app.use(express.static('public'))
app.use(sanitizeV5({ replaceWith: '_' }));
app.use(session(sessionConfig))

app.use(helmet({contentSecurityPolicy:false}));

const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    // "https://api.tiles.mapbox.com/",
    // "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
    "https://cdn.maptiler.com/", // add this
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    // "https://api.mapbox.com/",
    // "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net",
    "https://cdn.maptiler.com/", // add this
];
const connectSrcUrls = [
    // "https://api.mapbox.com/",
    // "https://a.tiles.mapbox.com/",
    // "https://b.tiles.mapbox.com/",
    // "https://events.mapbox.com/",
    "https://api.maptiler.com/", // add this
];

const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dv2fw7wkz/",
                "https://images.unsplash.com/",
                "https://img.freepik.com/" ,
                "https://api.maptiler.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);



app.use(flash());

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





app.use((req, res, next)=>{
    res.locals.currentUser = req.user
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next();
})

app.use('/', userRoutes)
app.use('/campgrounds', campgroundRoutes)
app.use('/campgrounds/:id/reviews', reviewRoutes)
app.get('/', (req, res)=>{
    res.render('home');
})

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

