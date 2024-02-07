const mongoose = require('mongoose')
const {Schema, model} = mongoose

const resumeSchema = new Schema({
    creator : {
        type : Schema.Types.ObjectId,
        ref : 'Applicant'
    },
    title : String,
    resume : String
}, {timestamps : true})

const Resume = model('Resume', resumeSchema)

module.exports = Resume