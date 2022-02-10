const express = require('express')
const router = express.Router()
const {
    addToCart,
    removeFromCart,
    deleteCart,
} = require('../controllers/cart')

router.route('/:id').post(addToCart).patch(removeFromCart).delete(deleteCart)

module.exports= router;