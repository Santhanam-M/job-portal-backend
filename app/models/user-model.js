const mongoose = require('mongoose')
const {Schema, model} = mongoose

const userSchema = new Schema({
    userName : String,
    email : String,
    password : String,
    confirmPassword : String,
    role : {
        type : String,
        enum : ['applicant', 'recruiter']
    }
})

const User = model('User', userSchema)

module.exports = User