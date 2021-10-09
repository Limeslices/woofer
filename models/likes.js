const mongoose = require('mongoose')

//removed id field, make sure this works
const likeSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    bark: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Bark'
    }
})


const Like = mongoose.model('Like', likeSchema)

module.exports = Like