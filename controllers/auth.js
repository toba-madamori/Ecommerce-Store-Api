const User = require('../models/users')
const {StatusCodes} = require('http-status-codes')


const registerUser = async(req,res)=>{
    res.status(StatusCodes.CREATED).json({msg:'user registered successfully'})
}

const loginUser = async(req,res)=>{
    res.status(StatusCodes.OK).json({msg:'user logged in'})
}

const logoutUser = async(req,res)=>{
    res.status(StatusCodes.OK).json({msg:'user logged out'})
}

module.exports = { registerUser, loginUser, logoutUser}