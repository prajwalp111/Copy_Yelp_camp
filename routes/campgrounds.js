const express = require('express')
const routes = express.Router();

const ExpressError = require('../utils/ExpressError')
const catchAsync = require('../utils/catchAsync')

const { campgroundSchema } = require('../schemas.js')
const CampGround = require('../models/campGround')

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

routes.get('/new', (req, res)=>{
    res.render('campgrounds/new');
})
//    if (!req.body.campground) throw new Error('No campground submitted');
routes.post('/', validationCamp,catchAsync(async (req, res) => {
    const newcamp = new CampGround(req.body.campground);
    await newcamp.save();
    res.redirect(`/campgrounds/${newcamp._id}`);
}));

routes.get('/:id',catchAsync(async (req, res)=>{
    const campground = await CampGround.findById(req.params.id).populate('reviews')
    res.render('campgrounds/show', {campground});
}))

routes.get('/:id/edit',catchAsync(async (req, res)=>{
    const campground = await CampGround.findById(req.params.id);
    res.render('campgrounds/edit', { campground });
}))

routes.put('/:id', validationCamp, catchAsync(async(req,res)=>{
    const { id } = req.params;
    const campground =await CampGround.findByIdAndUpdate(id, {...req.body.campground})
    res.redirect(`/campgrounds/${campground._id}`)
}))

routes.delete('/:id', catchAsync(async (req,res)=>{
    const { id } = req.params;
    await CampGround.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}))


module.exports = routes