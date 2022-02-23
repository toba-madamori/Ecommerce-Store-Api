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
router.route('/:id').post(addToCart).delete(deleteCart).patch(updateCart)
router.route('/remove-from-cart/:id').patch(removeFromCart)

module.exports= router;