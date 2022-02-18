const express = require('express')
const router = express.Router()
const {
    getProduct,
    newProducts,
    reviews,
    writeReview,
    addProductsToFav,
    favoriteProducts,
    removeProductFromFav,
} = require('../controllers/product')

//router.get('/get-all-products', getAllProducts)
router.get('/new-products', newProducts)

router.get('/read-prod-reviews/:id', reviews)
router.get('/get-product/:id', getProduct)
router.post('/write-prod-review/:id', writeReview)
router.post('/add-prod-favorites/:id', addProductsToFav)
router.delete('/remove-product-favorites/:id', removeProductFromFav)

router.get('/get-favorite-products', favoriteProducts)

module.exports= router;