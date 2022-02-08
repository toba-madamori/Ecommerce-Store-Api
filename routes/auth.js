const express = require('express')
const router = express.Router()
const {registerUser, loginUser, logoutUser} = require('../controllers/auth')


router.post('/register',registerUser).post('/login',loginUser).post('/logout',logoutUser)

module.exports = router;