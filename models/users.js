const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true, 'Please provide a name'],
        maxlength:20,
        minlength:5,
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

module.exports = mongoose.model('Users', UserSchema)