const express = require('express')
const app = express();
const path = require('path');
const mongoose = require('mongoose')
const ejsMate = require('ejs-mate')
const methodOverride = require('method-override')
const CampGround = require('./models/campGround')
const ExpressError = require('./utils/ExpressError')
const catchAsync = require('./utils/catchAsync')
const Joi = require('joi')
const { campgroundSchema, reviewSchema } = require('./schemas.js')
const Review = require('./models/review')

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');

app.use(express.urlencoded({ extended: true }));
app.engine('ejs',ejsMate);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));


const db = mongoose.connection;
db.on("error",console.error.bind(console,"connection error:"));
db.once('open',()=>{
    console.log('Database connection established')
});
///campground validation
const validationCamp = (req, res, next)=>{
     const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(', ');
        throw new ExpressError(msg, 400);  // Assuming you are using a custom ExpressError class
    }else{
        next()
    }
}
///review validation
const validationReveiw = (req, res, next)=>{
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        console.log(error) 
        const msg = error.details.map(el => el.message).join(', ');
        throw new ExpressError(msg, 400);  // Assuming you are using a custom ExpressError class
    }else{
        next()
    }
}

app.get('/', (req, res)=>{
    res.render('home');
})

app.get('/campgrounds', async (req, res)=>{
    const campgrounds = await CampGround.find({});
    res.render('campgrounds/index',{campgrounds});
})

app.get('/campgrounds/new', (req, res)=>{
    res.render('campgrounds/new');
})
//    if (!req.body.campground) throw new Error('No campground submitted');
app.post('/campgrounds', validationCamp,catchAsync(async (req, res) => {
    const newcamp = new CampGround(req.body.campground);
    await newcamp.save();
    res.redirect(`/campgrounds/${newcamp._id}`);
}));

app.get('/campgrounds/:id',catchAsync(async (req, res)=>{
    const campground = await CampGround.findById(req.params.id).populate('reviews')
    res.render('campgrounds/show', {campground});
}))

app.get('/campgrounds/:id/edit',catchAsync(async (req, res)=>{
    const campground = await CampGround.findById(req.params.id);
    res.render('campgrounds/edit', { campground });
}))

app.put('/campgrounds/:id', validationCamp, catchAsync(async(req,res)=>{
    const { id } = req.params;
    const campground =await CampGround.findByIdAndUpdate(id, {...req.body.campground})
    res.redirect(`/campgrounds/${campground._id}`)
}))

app.delete('/campgrounds/:id', catchAsync(async (req,res)=>{
    const { id } = req.params;
    await CampGround.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}))

///////////////////reviews/////////////////////////

app.post('/campgrounds/:id/reviews', validationReveiw, catchAsync(async(req, res)=>{
    const campground = await CampGround.findById(req.params.id)
    const review = new Review(req.body.review)
    campground.reviews.push(review)
    await campground.save()
    await review.save()
    res.redirect(`/campgrounds/${campground._id}`)
}))

app.delete('/campgrounds/:id/reviews/:idReview', catchAsync(async(req, res)=>{
    const { id, idReview } = req.params;
    await CampGround.findByIdAndUpdate(id, {$pull : {reviews : idReview}})
    await Review.findByIdAndDelete(idReview)
    res.redirect(`/campgrounds/${id}`)
}))

////////////////////////////////////////////////////

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

