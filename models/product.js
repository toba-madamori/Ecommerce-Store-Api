const mongoose = require('mongoose')

const ProductSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true, 'Please provide the product name'],
        maxlength:60,
    },
    company:{
        type:String,
        required:[true, 'Please provide the company name'],
        maxlength:60,
    },
    price:{
        type:Number,
        required:[true, 'Please provide the price'],
    },
    description:{
        type:String,
        required:[true, 'Please provide the product description'],
    },
    category:{
        type:String,
        required:[true, 'Please provide the product category'],
        values:{
            enum:['Beer_Wine_Spirits','Bread&Bakery', 'Canned_Goods_Soups', 'Cookies_Snacks_Candy', 'Vegies'],
            message:'{VALUE} is not supported',
        },
        required:[true, 'Please provide the category of the product'],
    },
    quantity:{
        type:Number,
        required:[true, 'Please provide the quantity of the product'],
    },
    in_stock:{
        type:Boolean,
        default:true,
    },
    rating:{
        type:Number,
        default:0,
    },
},{timestamps:true})

ProductSchema.methods.verifyQuantity =  function(product_quantity){
    let newQuantity = 0
    if(this.quantity >= product_quantity){
        if(product_quantity<0){
            newQuantity = this.quantity + Math.abs(product_quantity)
        }else{
            newQuantity = this.quantity - product_quantity
        }

        //updating the product
        if(newQuantity === 0){
            this.quantity = newQuantity
            this.in_stock = false
            this.save()
            return true
        }else if(newQuantity>0){
            this.quantity = newQuantity
            this.save()
            return true
        }
    }else{
        return false
    }
}


module.exports = mongoose.model('Products', ProductSchema);