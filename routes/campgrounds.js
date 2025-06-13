const express = require('express')
const routes = express.Router();

const ExpressError = require('../utils/ExpressError')
const catchAsync = require('../utils/catchAsync')

const { campgroundSchema } = require('../schemas.js')
const CampGround = require('../models/campGround')

const { isLoggedin } = require('../middleware.js')

const validationCamp = (req, res, next)=>{
     const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(', ');
        throw new ExpressError(msg, 400);  // Assuming you are using a custom ExpressError class
    }else{
        next()
    }
}

routes.get('/', async (req, res)=>{
    const campgrounds = await CampGround.find({});
    res.render('campgrounds/index',{campgrounds});
})

routes.get('/new', isLoggedin, (req, res)=>{
    res.render('campgrounds/new');
})

routes.post('/', isLoggedin, validationCamp,catchAsync(async (req, res) => {
    //    if (!req.body.campground) throw new Error('No campground submitted');
    const newcamp = new CampGround(req.body.campground);
    await newcamp.save();
    req.flash('success', 'You have successfully created a new CampGround')
    res.redirect(`/campgrounds/${newcamp._id}`);
}));

routes.get('/:id',  catchAsync(async (req, res)=>{
    const campground = await CampGround.findById(req.params.id).populate('reviews')
    if(!campground){
        req.flash('error', 'campground not found')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', {campground});
}))

routes.get('/:id/edit', isLoggedin,catchAsync(async (req, res)=>{
    const campground = await CampGround.findById(req.params.id);
    if(!campground){
        req.flash('error', 'campground not found')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit', { campground });
}))

routes.put('/:id', isLoggedin, validationCamp, catchAsync(async(req,res)=>{
    const { id } = req.params;
    const campground =await CampGround.findByIdAndUpdate(id, {...req.body.campground})
    req.flash('success', 'You have successfully udated the CampGround')
    res.redirect(`/campgrounds/${campground._id}`)
}))

routes.delete('/:id', isLoggedin, catchAsync(async (req,res)=>{
    const { id } = req.params;
    await CampGround.findByIdAndDelete(id);
    req.flash('success', 'You have successfully Deleted the CampGround')
    res.redirect('/campgrounds');
}))


module.exports = routes