const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

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
                min:1,
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

//CartSchema.plugin(uniqueValidator);

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

// CartSchema.post('findOneAndUpdate', async function(){
//     console.log('got here 1');
//     const docToUpdate = await this.model.findOne(this.getQuery())
//     console.log(this.getQuery());
//     this._update.total_no_of_products = docToUpdate.product.length

//     let transactionTotal = 0
//     for(let i = 0; i < docToUpdate.product.length; i++) {
//         transactionTotal += docToUpdate.product[i].product_price * docToUpdate.product[i].product_quantity
//     }
//     this._update.cart_total = transactionTotal
// })



module.exports= mongoose.model('Cart', CartSchema)

