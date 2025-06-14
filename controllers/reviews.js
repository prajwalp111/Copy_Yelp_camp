const CampGround = require('../models/campGround')
const Review = require('../models/review')

module.exports.createReview = async(req, res)=>{
    const campground = await CampGround.findById(req.params.id)
    const review = new Review(req.body.review)
    review.author = req.user._id
    campground.reviews.push(review)
    await campground.save()
    await review.save()
    req.flash('success', 'You have successfully added the CampGround review')
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.deleteReview = async(req, res)=>{
    const { id, idReview } = req.params;
    await CampGround.findByIdAndUpdate(id, {$pull : {reviews : idReview}})
    await Review.findByIdAndDelete(idReview)
    req.flash('success', 'You have successfully deleted the CampGround review')
    res.redirect(`/campgrounds/${id}`)
}