const {StatusCodes} = require('http-status-codes')


const getAllProducts = async(req,res)=>{
    res.status(StatusCodes.OK).json({ msg:'get all producs' })
}

const getProduct = async(req,res)=>{
    res.status(StatusCodes.OK).json({ msg:'get a particular product' })
}

const newProducts = async(req,res)=>{
    res.status(StatusCodes.OK).json({ msg: 'get all the products added this week' })
}

const writeReview = async(req,res)=>{
    res.status(StatusCodes.OK).json({ msg: 'write a product review' })
}

const reviews = async(req,res)=>{
    res.status(StatusCodes.OK).json({ msg: 'read a product review' })
}

const addProductsToFav = async(req,res)=>{
    res.status(StatusCodes.OK).json({ msg: 'add product to favorites' })
}


module.exports={
    getAllProducts,
    getProduct,
    newProducts,
    reviews,
    writeReview,
    addProductsToFav,
}