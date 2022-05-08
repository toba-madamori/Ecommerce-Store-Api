const router = require('express').Router()
const { checkout } = require('../controllers/payment')

router.post('/create-checkout-session', checkout)

module.exports = router;