const express = require('express')
const router = express.Router()
const {
    getCart,
    addToCart,
    removeFromCart,
    deleteCart,
} = require('../controllers/cart')

router.route('/:id').get(getCart).post(addToCart).patch(removeFromCart).delete(deleteCart)

module.exports= router;