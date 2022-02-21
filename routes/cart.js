const express = require('express')
const router = express.Router()
const {
    getCart,
    addToCart,
    updateCart,
    removeFromCart,
    deleteCart,
} = require('../controllers/cart')

router.route('/').get(getCart)
router.route('/:id').post(addToCart).patch(removeFromCart).delete(deleteCart).patch(updateCart)

module.exports= router;