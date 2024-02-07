const mongoose = require('mongoose')
const {Schema, model} = mongoose

const categorySchema = new Schema({
    categoryName : String,
    creator : {
        type : Schema.Types.ObjectId,
        ref : 'Recruiter'
    }
})

const Category = model('Category', categorySchema)

module.exports = Category