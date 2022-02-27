const {StatusCodes} = require('http-status-codes')
const Product = require('../models/product')
const Cart = require('../models/cart')
const User = require('../models/users')
const {BadRequestError, NotFoundError, UnauthenticatedError} = require('../errors')


const getCart = async(req,res)=>{
    const { user:{ userID:user }} = req
    const cart = await Cart.findOne({ user })
    if(cart){
        return res.status(StatusCodes.OK).json({ cart })
    }
    res.status(StatusCodes.OK).json({ msg:'You dont have a cart yet...', cart:{} })
}


const addToCart = async(req,res)=>{
    const { user:{ userID:user }, params:{ id:product } } = req
    const { product_name, product_quantity, product_price } = req.body

    // checking if there is a cart and the product is already in the cart
    let cart = await Cart.findOne({ user })
    if(cart && cart.product.find(item => item.product_name === product_name)){
        return res.status(StatusCodes.OK).json({ msg:'This product is already in your cart' })
    }

    // verifying the quantity of that particular product remaining
    const prod = await Product.findById({ _id:product }) 
    const newQuantity = prod.verifyQuantity(product_quantity)
    
    if(!newQuantity){
        throw new BadRequestError(`Sorry there are only ${prod.quantity} pieces of this ${product_name} left...`)
    }

    // adding a new product to an already existing cart
    if(cart){
        const newProduct = {productID:product, product_name, product_quantity, product_price}

        cart = await Cart.findOneAndUpdate({ user}, {$push:{ product:newProduct }}, {new:true, runValidators:true})
        await cart.save()
        return res.status(StatusCodes.OK).json({ cart })
    }

    // creating the cart
    const newCart = await Cart.create({ user, product:[{productID:product, product_name, product_quantity, product_price}]})
    if(newCart){
        return res.status(StatusCodes.CREATED).json({ newCart })
    }
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg:'Not able to create cart, please try again later..' })
}


// the frontend should make sure the user cannot reduce the amount of a particular product in the cart if its remaining only 1....!!!
const updateCart = async(req,res)=>{
    const { user:{ userID:user }, params:{ id:product } } = req
    const { product_name, product_quantity } = req.body  // note that product_quantity values here should either be -negative or +positive

    // checking if there is a cart and the product is already in the cart
    let cart = await Cart.findOne({ user })
    if(!cart || !cart.product.find(item => item.product_name === product_name)){
        return res.status(StatusCodes.OK).json({ msg:'This product does not exist in the cart' })
    }

    // verifying the quantity of that particular product remaining
    const prod = await Product.findById({ _id:product }) 
    const newQuantity = prod.verifyQuantity(product_quantity)

    if(!newQuantity){
        throw new BadRequestError(`Sorry there are only ${prod.quantity} pieces of this ${product_name} left...`)
    }

    // updating the cart
    cart = await Cart.findOneAndUpdate({ user, 'product.productID':product},{ $inc:{'product.$.product_quantity':product_quantity}}, {new:true, runValidators:true})
    await cart.save()
    
    return res.status(StatusCodes.OK).json({ cart })    
}



const removeFromCart = async(req,res)=>{
    const { product_quantity, product_name } = req.body
    const { params:{ id:product }, user:{ userID: user }} = req

    // checking if there is a cart and the product is already in the cart
    let cart = await Cart.findOne({ user })
    if(!cart || !cart.product.find(item => item.product_name === product_name)){
        return res.status(StatusCodes.OK).json({ msg:'This product does not exist in the cart' })
    }

    // adding the product_quantity to the original product
    const prod = await Product.findById({ _id:product }) 

    const newQuantity = prod.verifyQuantity(-Math.abs(product_quantity))
    if(!newQuantity){
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg:'server error, please try again later...'})
    }

    // updating the cart
    cart = await Cart.findOneAndUpdate({ user }, { $pull:{ product:{productID:product} }}, { new:true, runValidators:true })
    await cart.save()

    res.status(StatusCodes.OK).json({ cart })
}

const deleteCart = async(req,res)=>{
    const { params:{ id:cartID } } = req

    // checking if there is a cart
    let cart = await Cart.findById({ _id:cartID })

    if(!cart){
        return res.status(StatusCodes.BAD_REQUEST).json({ msg:'Cannot delete a cart that doesnt exist...'})
    }

    // updating the original products with the product_quantities of different products in the cart
    for await(i of cart.product){
        const prod = await Product.findById({ _id: i.productID })
        const newQuantity = prod.verifyQuantity(-Math.abs(i.product_quantity))

        if(!newQuantity){
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg:'server error, please try again later...'})
        }
    }
    cart.delete()

    res.status(StatusCodes.NO_CONTENT)
}

module.exports={
    getCart,
    addToCart,
    updateCart,
    removeFromCart,
    deleteCart,
}