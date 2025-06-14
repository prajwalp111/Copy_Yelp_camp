const express = require('express')
const routes = express.Router();
const catchAsync = require('../utils/catchAsync')
const CampGround = require('../models/campGround')
const campgrounds = require('../controllers/campgrounds.js')

const { isLoggedin, isAuthor, validationCamp } = require('../middleware.js')
//router.route
routes.route('/')
    .get( campgrounds.index )
    .post( isLoggedin, validationCamp,catchAsync(campgrounds.makeNewForm));

routes.get('/new', isLoggedin, campgrounds.renderNewForm)

routes.route('/:id')
    .get( catchAsync(campgrounds.showCampgrounds))
    .put(isLoggedin, isAuthor, validationCamp, catchAsync(campgrounds.updateCampgrounds))
    .delete(isLoggedin, isAuthor, catchAsync(campgrounds.deleteCampgrounds))

routes.get('/:id/edit', isLoggedin, isAuthor,catchAsync(campgrounds.renderEditForm))

module.exports = routes