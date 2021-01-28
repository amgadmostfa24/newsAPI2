const mongoose = require('mongoose')

const newsSchema = new mongoose.Schema({
  title:{
    type: String,
    required: true,
    unique: true,
    trim:true
},  
description: {
    type: String,
    required: true,
    trim: true
},
auther:{
    type: String,
    required: true,
    trim:true
},
imageNews:{
     type: Buffer
},
owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Reporters'
}
}, 
{
    timestamps: true
})

const News = mongoose.model('News', newsSchema)

module.exports = News