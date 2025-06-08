const express = require('express')
const routes = express.Router({mergeParams : true});

const CampGround = require('../models/campGround')
const Review = require('../models/review')
const ExpressError = require('../utils/ExpressError')
const catchAsync = require('../utils/catchAsync')
const { reviewSchema } = require('../schemas.js')

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

routes.post('/', validationReveiw, catchAsync(async(req, res)=>{
    const campground = await CampGround.findById(req.params.id)
    const review = new Review(req.body.review)
    campground.reviews.push(review)
    await campground.save()
    await review.save()
    req.flash('success', 'You have successfully added the CampGround review')
    res.redirect(`/campgrounds/${campground._id}`)
}))

routes.delete('/:idReview', catchAsync(async(req, res)=>{
    const { id, idReview } = req.params;
    await CampGround.findByIdAndUpdate(id, {$pull : {reviews : idReview}})
    await Review.findByIdAndDelete(idReview)
    req.flash('success', 'You have successfully deleted the CampGround review')
    res.redirect(`/campgrounds/${id}`)
}))

module.exports = routes;