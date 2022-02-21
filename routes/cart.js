const express = require('express')
const router = express.Router()
const {
    getCart,
    addToCart,
    updateCart,
    removeFromCart,
    deleteCart,
} = require('../controllers/cart')

router.route('/:id').get(getCart).post(addToCart).patch(removeFromCart).delete(deleteCart).patch(updateCart)

module.exports= router;