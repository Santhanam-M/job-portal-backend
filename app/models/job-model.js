const mongoose = require('mongoose')
const {Schema, model} = mongoose

const jobSchema = ({
    title : String,
    description : String,
    skills : [String],
    salary : String,
    jobType : {
        type : String,
        enum : ['full time', 'part time', 'work from home']
    },
    location : String,
    experience : String,
    dateOfPosting : Date,
    deadline : Date,
    category : {
        type : Schema.Types.ObjectId,
        ref : 'Category'
    },
    creator : {
        type : Schema.Types.ObjectId,
        ref : 'Recruiter'
    },
    appliedUsers : [{
        type : Schema.Types.ObjectId,
        ref : 'Applicant'
    }]
})

const Job = model('Job', jobSchema)

module.exports = Job