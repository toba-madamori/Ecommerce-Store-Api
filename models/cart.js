const mongoose = require('mongoose')

const CartSchema = new mongoose.Schema({
    user:{
        type:mongoose.Types.ObjectId,
        ref:'Users',
        required:[true, 'Please provide the users ID...']
    },
    product:[
        {
            productID:{
                type:mongoose.Types.ObjectId,
                ref:'Products',
                required:[true, 'Please provide the product ID...'],
            },
            product_name:{
                type:String,
                required:[true, 'Please provide the product name...'],
            },
            product_quantity:{
                type:Number,
                default:1,
                min:[1, 'The product quantity cannot be less than 1...'],
            },
            product_price:{
                type:Number,
                required:[true, 'Please provide the product price'],
            },
        }
    ],
    cart_total:{
        type:Number,
        default:0,
    },
    total_no_of_products:{
        type:Number,
        default:0,
    },
    is_active:{
        type:Boolean,
        default:true,
    },
    modified_on:{
        type:Date,
        default:Date.now
    }
},{timestamps:true})


module.exports= mongoose.model('Cart', CartSchema)

