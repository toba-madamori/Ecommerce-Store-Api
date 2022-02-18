const mongoose = require('mongoose')


const ProdReviewSchema = new mongoose.Schema({
    user:{
        type:mongoose.Types.ObjectId,
        ref:'Users',
        required:[true, 'Please provide the user']
    },
    product:{
        type:mongoose.Types.ObjectId,
        ref:'Products',
        required:[true, 'Please provide the product']
    },
    text:{
        type:String,
        required:[true, 'Please provide the review body'],
        maxlength:150,
    }
}, {timestamps:true})

module.exports= mongoose.model('Product-Reviews', ProdReviewSchema)