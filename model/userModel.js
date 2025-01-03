const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    fullName: {
        type: String,
      },
      gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
      },
      imageUrl: {
        type: String,
      },
      skills: [
        {
          type: String,
          enum: ['JavaScript','React', 'Node.js', 'MongoDB'], 
        },
    ]
})

const User = mongoose.model('User', userSchema)

module.exports = User