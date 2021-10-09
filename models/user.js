const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const Bark = require('./bark')

//removed id field, make sure this works
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        trim: true,
    }
})

userSchema.virtual('barks', {
    ref: 'Bark',
    localField: '_id',
    foreignField: 'owner'
})
userSchema.virtual('likes', {
    ref: 'Like',
    localField: '_id',
    foreignField: 'owner'
})

userSchema.pre('save', async function (next) {
    const user = this

    if(user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 10)
    }

    next()
})


const User = mongoose.model('User', userSchema)

module.exports = User