const {places, descriptors} = require('./seedHelpers')
const cities = require('./cities')
const mongoose = require('mongoose')
const campGround = require('../models/campGround');
const { random } = require('colors');

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');

const db = mongoose.connection;
db.on("error",console.error.bind(console,"connection error:"));
db.once('open',()=>{
    console.log('Database connection')
});

const sample = array => array[Math.floor(Math.random()*array.length)];

const seedDB = async ()=>{
    await campGround.deleteMany({});
    for(let i=0 ; i<500 ; i++){
        const random4000 = Math.floor(Math.random() * 4000);
        const price = Math.floor(Math.random() * 20 )+10;
        const camp = new campGround({
            location : `${cities[random4000].city} , ${cities[random4000].state}`,
            title : `${sample(descriptors)} ${sample(places)}`,
            // images:`https://picsum.photos/400?random=${Math.random()}`,
            description:'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Rerum ut temporibus delectus ullam sunt, sit assumenda similique numquam ex alias accusantium repellat harum error consequatur dolorem, modi pariatur laborum obcaecati.',
            price:price,
            author : '684b2284a4d7a956495fc539',
             geometry: {
                type: 'Point',
                coordinates: [ 
                    cities[random4000].longitude,
                    cities[random4000].latitude
                ]
            },
            images : [
                {
                url: 'https://res.cloudinary.com/dv2fw7wkz/image/upload/v1750000591/copy_yelp_camp/x9xuxbc9qtrigelwz0nl.png',
                filename: 'copy_yelp_camp/x9xuxbc9qtrigelwz0nl',
         
                },
                {
                url: 'https://res.cloudinary.com/dv2fw7wkz/image/upload/v1750000591/copy_yelp_camp/gc1lflssqdhsnylgw3hj.jpg',
                filename: 'copy_yelp_camp/gc1lflssqdhsnylgw3hj',
                
                }
            ]
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})