const mongoose = require('mongoose')
const {Schema, model} = mongoose

const applicationSchema = ({
    applicant : {
        type : Schema.Types.ObjectId,
        ref : 'Applicant'
    },
    resume : {
        type : Schema.Types.ObjectId,
        ref : 'Resume'
    },
    recruiter : {
        type : Schema.Types.ObjectId,
        ref : 'Recruiter'
    },
    job : {
        type : Schema.Types.ObjectId,
        ref : 'Job'
    },
    status : {
        type : String,
        enum : ['Pending', 'ShortListed', 'Not ShortListed'],
        default : 'Pending'
    }
})

const Application = model ('Application', applicationSchema)

module.exports = Application
