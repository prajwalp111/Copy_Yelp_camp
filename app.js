const express = require('express')
const app = express();
const path = require('path');
const mongoose = require('mongoose')
const ejsMate = require('ejs-mate')
const methodOverride = require('method-override')
const CampGround = require('./models/campGround');

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');

const db = mongoose.connection;
db.on("error",console.error.bind(console,"connection error:"));
db.once('open',()=>{
    console.log('Database connection established')
});

app.engine('ejs',ejsMate);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'));

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

app.post('/campgrounds', async(req, res)=>{
    const newcamp = new CampGround(req.body.campground);
    await newcamp.save();
    res.redirect(`/campgrounds/${newcamp._id}`)
})

app.get('/campgrounds/:id',async (req, res)=>{
    const campground = await CampGround.findById(req.params.id)
    res.render('campgrounds/show', {campground});
})

app.get('/campgrounds/:id/edit',async (req, res)=>{
    const campground = await CampGround.findById(req.params.id);
    res.render('campgrounds/edit', { campground });
})

app.put('/campgrounds/:id', async(req,res)=>{
    const { id } = req.params;
    const campground =await CampGround.findByIdAndUpdate(id, {...req.body.campground})
    res.redirect(`/campgrounds/${campground._id}`)
})

app.delete('/campgrounds/:id', async (req,res)=>{
    const { id } = req.params;
    await CampGround.findByIdAndDelete(id);
    res.redirect('/campgrounds');
})

app.listen(5050,()=>{
    console.log('Connection opened')
})

