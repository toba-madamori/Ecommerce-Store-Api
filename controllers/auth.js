const User = require('../models/users')
const {StatusCodes} = require('http-status-codes')
const {BadRequestError, UnauthenticatedError} = require('../errors')


const registerUser = async(req,res)=>{
    const user = await User.create({...req.body})
    const token = user.createToken()
    res.status(StatusCodes.CREATED).json({ username:user.name, token})
}

const loginUser = async(req,res)=>{
    const {email, password } = req.body
    if(!email || !password){
        throw new BadRequestError('Please provide an email and password')
    }
    // checking if the user exists
    const user = await User.findOne({ email })
    if(!user){
        throw new UnauthenticatedError('Invalid credentials')
    }
    // comparing passwords
    const isPasswordCorrect = await user.comparePassword(password)
    if(!isPasswordCorrect){
        throw new UnauthenticatedError('Invalid credentials')
    }
    const token = user.createToken()
    return res.status(StatusCodes.OK).json({name:user.name, token })

}

module.exports = { registerUser, loginUser}