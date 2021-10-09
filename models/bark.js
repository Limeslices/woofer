const mongoose = require('mongoose')

//removed id field, make sure this works
const barkSchema = new mongoose.Schema({
    bark: {
        type: String,
        required: true,
        trim: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    name: {
        type: String,
        ref: 'User'
    },
    numOfLikes: {
        type: Number,
        default: 0,
        required: true
    },
    userHasLiked: {
        type: Boolean,
        required: true,
        default: false
    }
},
{
    timestamps: true
})

barkSchema.virtual('likes', {
    ref: 'Like',
    localField: '_id',
    foreignField: 'bark'
})
const Bark = mongoose.model('Bark', barkSchema)

module.exports = Bark