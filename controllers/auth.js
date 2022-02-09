const User = require('../models/users')
const {StatusCodes} = require('http-status-codes')


const registerUser = async(req,res)=>{
    const user = await User.create({...req.body})
    const token = user.createToken()
    res.status(StatusCodes.CREATED).json({ username:user.name, token})
}

const loginUser = async(req,res)=>{
    res.status(StatusCodes.OK).json({msg:'user logged in'})
}

module.exports = { registerUser, loginUser}