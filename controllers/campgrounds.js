const CampGround = require('../models/campGround')
const mapTGeocoding = require('@maptiler/client')
const { cloudinary } = require('../cloudinary')

mapTGeocoding.config.apiKey = process.env.MAPTILER_KEY;

module.exports.index = async (req, res)=>{
    const campgrounds = await CampGround.find({});
    res.render('campgrounds/index',{campgrounds});
}

module.exports.renderNewForm = (req, res)=>{
    res.render('campgrounds/new');
}

module.exports.makeNewForm = async (req, res) => {
    //    if (!req.body.campground) throw new Error('No campground submitted');

    const result = await mapTGeocoding.geocoding.forward(req.body.campground.location,{
        limit: 1
    });
    
    const newcamp = new CampGround(req.body.campground);
    newcamp.geometry = result.features[0].geometry;
    newcamp.images = req.files.map(f => ({ url:f.path , filename:f.filename}))
    newcamp.author = req.user._id
    await newcamp.save();

    req.flash('success', 'You have successfully created a new CampGround')
    res.redirect(`/campgrounds/${newcamp._id}`);
}

module.exports.showCampgrounds =async (req, res)=>{
    const campground = await CampGround.findById(req.params.id).populate({
        path : 'reviews',
        populate : {
            path :'author'
        }
    }).populate('author');
    if(!campground){
        req.flash('error', 'campground not found')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', {campground});
}

module.exports.renderEditForm = async (req, res)=>{
    const { id } = req.params;
    const campground = await CampGround.findById(id);
    if(!campground){
        req.flash('error', 'campground not found')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit', { campground });
}

module.exports.updateCampgrounds = async(req,res)=>{
    const { id } = req.params
    console.log(req.body)
    const campground =await CampGround.findByIdAndUpdate(id, {...req.body.campground})
    const img = req.files.map(f => ({ url:f.path , filename:f.filename}))
    campground.images.push(...img)
    await campground.save()
    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages){
            cloudinary.uploader.destroy(filename)
        }
        await campground.updateOne({$pull:{images:{filename:{$in:req.body.deleteImages}}}})
    }
    req.flash('success', 'You have successfully udated the CampGround')
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.deleteCampgrounds = async (req,res)=>{
    const { id } = req.params;
    await CampGround.findByIdAndDelete(id);
    req.flash('success', 'You have successfully Deleted the CampGround')
    res.redirect('/campgrounds');
}