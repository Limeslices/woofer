const express = require('express')

const passport = require('passport')
const Bark = require('../models/bark')
const { checkAuthenticated, checkNotAuthenticated } = require('../middleware/authentication')
const router = new express.Router()
const User = require('../models/user')
const Like = require('../models/likes')
const initializePassport = require('../passport-config')
const { response } = require('express')

initializePassport(
    passport, 
    async (email) => {
       const user = await User.findOne({email: email})
       return user
    },
    async (id) => {
        const user = User.findById(id)
        return user
    }
)


router.get('/barks', checkAuthenticated, async (req, res) => {
    const user = await req.user
    try {
        const barks = await Bark.find({})
        var list = []
        for(let i = 0; i < barks.length; i++) {
            const like = await Like.findOne({owner: user._id, bark: barks[i]._id})
            if(like) {
                barks[i].userHasLiked = true
            }
            list.push(barks[i])
        }
        res.send(list)
    } catch (e) {
        res.send(e)
    }
})

router.post('/barks', checkAuthenticated, async (req, res) => {
    const user = await req.user
    try {
        const bark = await new Bark({
            ...req.body,
            owner: user._id,
            name: user.name,
            numOfLikes: 0
        })
        await bark.save()
        res.redirect('/')
    } catch (e) {
        res.send([e])
    }
})

router.post('/barks/like', checkAuthenticated, async (req, res) => {
    const user = await req.user
    try {
        const likeFinder = await Like.findOne({owner: user._id, bark: req.body.barkID})
        if(likeFinder === null) {
            const like = await new Like({
                owner: user._id,
                bark: req.body.barkID
            })
            await like.save()
            const bark = await Bark.findOne({_id: req.body.barkID})
            bark.numOfLikes = bark.numOfLikes + 1
            await bark.save()
            return res.send({msg: 'added'})
        }
        if(likeFinder) {
            Like.deleteOne({owner: user._id, bark: req.body.barkID}, function (err) {
                if(err) console.log(err);
              })
              const bark = await Bark.findOne({_id: req.body.barkID})
              bark.numOfLikes = bark.numOfLikes - 1
              await bark.save()
            return res.send({msg: 'deleted'})
        }
        const like = await new Like({
            owner: user._id,
            bark: req.body.barkID
        })
        await like.save()
        const bark = await Bark.findOne({_id: req.body.barkID})
        bark.numOfLikes = bark.numOfLikes + 1
        await bark.save()
        return res.send({msg: 'added'})
    } catch (e) {
        console.log(e)
        res.send(e)
    }
})



module.exports = router