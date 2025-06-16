const { object } = require('joi');
const mongoose = require('mongoose');
const {Schema} = mongoose;
const Review = require('./review')

const campgroundSchema = new Schema({
    title:String,
    price:Number,
    images:[{
        url : String,
        filename : String
    }],
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
});

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