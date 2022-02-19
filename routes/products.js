const express = require('express')
const router = express.Router()
const {
    getProduct,
    newProducts,
    reviews,
    writeReview,
    updateReview,
    deleteReview,
    addProductsToFav,
    favoriteProducts,
    removeProductFromFav,
} = require('../controllers/product')

//router.get('/get-all-products', getAllProducts)
router.get('/new-products', newProducts)
router.get('/get-product/:id', getProduct)

router.get('/read-prod-reviews/:id', reviews)
router.post('/write-prod-review/:id', writeReview)
router.patch('/update-prod-review/:id', updateReview)
router.delete('/delete-prod-review/:id', deleteReview)

router.get('/get-favorite-products', favoriteProducts)
router.post('/add-prod-favorites/:id', addProductsToFav)
router.delete('/remove-product-favorites/:id', removeProductFromFav)


module.exports= router;