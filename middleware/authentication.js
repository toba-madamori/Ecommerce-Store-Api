const {UnauthenticatedError} = require('../errors')
const jwt = require('jsonwebtoken')

const authentication = async(req,res,next)=>{
    const authToken = req.headers.authorization

    if(!authToken || !authToken.startsWith('Bearer')){
        throw new UnauthenticatedError('Authentication invalid')
    }
    const token = authToken.split(' ')[1]

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET)
        req.user = {userID:payload.userID, name:payload.username}
        next()
    } catch (error) {
        throw new UnauthenticatedError('Authentication invalid')
    }

}

module.exports = authentication;