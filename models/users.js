const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')


const UserSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true, 'Please provide a name'],
        maxlength:20,
        minlength:3,
    },
    email:{
        type:String,
        required:[true, 'Please provide an email address'],
        match: [/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'Please provide a valid email address'],
        unique:true,
    },
    password:{
        type:String,
        required:[true, 'Please provide a password'],
        minlength:6,
    }
})

UserSchema.pre('save', async function(){
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})


UserSchema.methods.createToken = function(){
    return jwt.sign({userID:this._id, username:this.name}, process.env.JWT_SECRET, {expiresIn:process.env.JWT_LIFETIME})
}

module.exports = mongoose.model('Users', UserSchema)