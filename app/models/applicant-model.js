const mongoose = require('mongoose')
const {Schema, model} = mongoose

const applicantSchema = new Schema({
    creator : {
        type : Schema.Types.ObjectId,
        ref : 'User'
    },
    contactNumber : String,
    aboutMe : String,
    experience : {
        type : String,
        enum : ['fresher', 'experience']
    },
    location : String,
    resumesCreated : [{
        type : Schema.Types.ObjectId,
        ref : 'Resume'
    }],
    appliedJobs : [{
        type : Schema.Types.ObjectId,
        ref : 'Job'
    }]
})

const Applicant = model('Applicant', applicantSchema)

module.exports = Applicant