const stripe = require('stripe')(process.env.STRIPE_KEY)
const { StatusCodes } = require('http-status-codes')
const Cart = require('../models/cart')
const { BadRequestError } = require('../errors')


const checkout = async(req,res)=>{
    const { id:cartID } = req.body

    const cart = await Cart.findById(cartID)
    if(!cart) throw new BadRequestError('sorry this cart does not exist')

    const session = await stripe.checkout.sessions.create({
        payment_method_types:["card"],
        mode:"payment",
        line_items:cart.product.map(item=>{
            return{
                price_data:{
                    currency: "usd",
                    product_data: {
                    name: item.product_name,
                },
                unit_amount:Math.round(item.product_price * 100)
            },
            quantity:item.product_quantity
            }
        }),
        success_url: `${process.env.CLIENT_SUCCESS_URL}/${cartID}`,
        cancel_url: `${process.env.CLIENT_CANCEL_URL}`,
    })
    res.status(StatusCodes.OK).json({ url:session.url })
}

const stripeSuccess = async(req,res)=>{
    const { cartID } = req.params
    await Cart.findByIdAndDelete(cartID)
    
    res.status(StatusCodes.OK).json({ msg:"success" })
}

const stripeCancel = async(req,res)=>{
    res.status(StatusCodes.OK).json({ msg:"cancel" })
}

module.exports = {
    checkout,
    stripeSuccess,
    stripeCancel
}