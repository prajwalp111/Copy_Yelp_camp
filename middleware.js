const { campgroundSchema, reviewSchema } = require('./schemas.js')
const CampGround = require('./models/campGround')
const ExpressError = require('./utils/ExpressError')
const Review = require('./models/review')

module.exports.isLoggedin = (req, res, next)=>{
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl;
        console.log(req.originalUrl)
        req.flash('error', 'You must sign in to continue')
        return res.redirect('/login')
    }
    next()
}

module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}

module.exports.validationCamp = (req, res, next)=>{
     const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(', ');
        throw new ExpressError(msg, 400);  // Assuming you are using a custom ExpressError class
    }else{
        next()
    }
}

module.exports.isAuthor = async(req, res, next)=>{
    const { id } = req.params;
    const campground = await CampGround.findById(id);
    if(!campground.author || !campground.author.equals(req.user._id)){
        req.flash('error', 'You cant update this campground unless ur a author')
        return res.redirect(`/campgrounds/${id}`)
    }
    next()
}

module.exports.isReviewAuthor = async(req, res, next)=>{
    const { id, idReview } = req.params;
    const review = await Review.findById(idReview);
    if(!review.author.equals(req.user._id)){
        req.flash('error', 'You cant delete this review unless ur a author')
        return res.redirect(`/campgrounds/${id}`)
    }
    next()
}

module.exports.validationReveiw = (req, res, next)=>{
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        console.log(error) 
        const msg = error.details.map(el => el.message).join(', ');
        throw new ExpressError(msg, 400);  // Assuming you are using a custom ExpressError class
    }else{
        next()
    }
}