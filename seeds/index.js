const {places, descriptors} = require('./seedHelpers')
const cities = require('./cities')
const mongoose = require('mongoose')
const campGround = require('../models/campGround')

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');

const db = mongoose.connection;
db.on("error",console.error.bind(console,"connection error:"));
db.once('open',()=>{
    console.log('Database connection')
});

const sample = array => array[Math.floor(Math.random()*array.length)];

const seedDB = async ()=>{
    await campGround.deleteMany({});
    for(let i=0 ; i<50 ; i++){
        const random4000 = Math.floor(Math.random() * 4000);
        const price = Math.floor(Math.random() * 20 )+10;
        const camp = new campGround({
            location : `${cities[random4000].city} , ${cities[random4000].state}`,
            title : `${sample(descriptors)} ${sample(places)}`,
            image:`https://picsum.photos/400?random=${Math.random()}`,
            description:'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Rerum ut temporibus delectus ullam sunt, sit assumenda similique numquam ex alias accusantium repellat harum error consequatur dolorem, modi pariatur laborum obcaecati.',
            price:price,
            author : '684b2284a4d7a956495fc539'
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})