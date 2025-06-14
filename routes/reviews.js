const express = require('express')
const routes = express.Router({mergeParams : true});
const CampGround = require('../models/campGround')
const Review = require('../models/review')
const catchAsync = require('../utils/catchAsync')
const { validationReveiw, isLoggedin, isReviewAuthor } = require('../middleware')
const reviews = require('../controllers/reviews')

routes.post('/', isLoggedin, validationReveiw, catchAsync(reviews.createReview))

routes.delete('/:idReview',isLoggedin, isReviewAuthor, catchAsync(reviews.deleteReview))

module.exports = routes;