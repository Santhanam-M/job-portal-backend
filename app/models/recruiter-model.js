const mongoose = require('mongoose')
const {Schema, model} = mongoose

const recruiterSchema = {
    creator : {
        type : Schema.Types.ObjectId,
        ref : 'User'
    },
    companyName : String,
    contactNumber : String,
    companyBio : String,
    createdJobs : [{
        type : Schema.Types.ObjectId,
        ref : 'Job'
    }]
}

const Recruiter = model ('Recruiter', recruiterSchema)

module.exports = Recruiter