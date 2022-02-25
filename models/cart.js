const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const assert = require('assert/strict')


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
                min: [1, 'Product_quantity cannot be less than 1']
            },
            product_price:{
                type:Number,
                required:[true, 'Please provide the product price'],
            },
            _id:false,
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

//CartSchema.plugin(uniqueValidator);

// function productQuantityValidator(v){
//     const message = 'greater than 1'
//     if(this instanceof mongoose.Query){
//         const update = this.getUpdate()
//         assert(v !== 0, message)
//     }else{
//         assert(v !== 0, message)
//     }
// }

CartSchema.pre('save', async function(){
    this.total_no_of_products = this.product.length
})
CartSchema.pre('save', async function(){
    this.cart_total = this.product.reduce((total, cartItem)=>{
        const { product_quantity, product_price } = cartItem
        total += product_quantity * product_price
        return total
    },0) 
})

// CartSchema.pre('validate', async function(){
//     const message = 'greater than 2'
//     assert(this.product_quantity!== 0, message)
// })



module.exports= mongoose.model('Cart', CartSchema)

