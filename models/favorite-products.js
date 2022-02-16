const mongoose = require('mongoose')


const FavProdSchema = new mongoose.Schema({
    user:{
        type:mongoose.Types.ObjectId,
        ref:'Users',
        required:[true, 'Please provide the user']
    },
    product:{
        type:mongoose.Types.ObjectId,
        ref:'Products',
        required:[true, 'Please provide the object']
    }
}, {timestamps:true})

module.exports= mongoose.model('Favorite-Products', FavProdSchema)