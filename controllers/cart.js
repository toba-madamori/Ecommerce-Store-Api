const {StatusCodes} = require('http-status-codes')


const addToCart = async(req,res)=>{
    res.status(StatusCodes.OK).json({ msg: 'add a product to the cart' })
}

const removeFromCart = async(req,res)=>{
    res.status(StatusCodes.OK).json({ msg: 'remove a product from the cart' })
}

const deleteCart = async(req,res)=>{
    res.status(StatusCodes.OK).json({ msg: 'delete cart' })
}

module.exports={
    addToCart,
    removeFromCart,
    deleteCart,
}