const { object } = require('joi');
const mongoose = require('mongoose');
const {Schema} = mongoose;
const Review = require('./review')

const imageSchema = new Schema({
        url : String,
        filename : String
    })

imageSchema.virtual('thumbnail').get(function(){
    return this.url.replace('/upload', '/upload/w_200')
})

const opts = { toJSON: { virtuals: true } };

const campgroundSchema = new Schema({
    title:String,
    price:Number,
    geometry: {
    type: {
      type: String, 
      enum: ['Point'], 
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
    images:[imageSchema],
    description:String,
    location:String,
    author : {
        type : Schema.Types.ObjectId,
        ref : 'User'
    },
    reviews : [{
        type : Schema.Types.ObjectId,
        ref : 'Review'
    }]
},opts);

campgroundSchema.virtual('properties.popUpMarkup').get(function(){
    return `
    <strong><a href="/campgrounds/${this._id}">${this.title}</a></strong>
    <p>${this.location}</p>`
})


campgroundSchema.post('findOneAndDelete',async function (doc) {               //doc = all the thing od campground
    if(doc){
        await Review.deleteMany({
            _id : {                 //Review  -> id -> delete which are same as id in doc
                $in : doc.reviews   //in doc -> reviews
            }
        })
    }
})



module.exports = mongoose.model('campGrounds',campgroundSchema); // colection name all small -> campgrounds