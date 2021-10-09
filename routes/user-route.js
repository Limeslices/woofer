const express = require('express')
const passport = require('passport')
const User = require('../models/user')
const { checkAuthenticated, checkNotAuthenticated } = require('../middleware/authentication')
const router = new express.Router()

const initializePassport = require('../passport-config')

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

router.get('/', checkAuthenticated, async (req, res) => {
    const user = await req.user
    res.render('index.ejs', {name: user.name})
})

router.get('/login', checkNotAuthenticated, (req, res) => {
    res.render('login.ejs')
})

router.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}))

router.get('/register', checkNotAuthenticated, (req, res) => {
    res.render('register.ejs')
})

router.post('/register', checkNotAuthenticated, async (req, res) => {
    
    try {
        const user = await new User(req.body) 
        await user.save()
        // const hashedPassword = await bcrypt.hash(req.body.password, 10)     
        res.redirect('/login')
       
       
    } catch (error) {
        console.log(error)
        res.redirect('/register')
    }
})

router.delete('/logout', (req, res) => {
    req.logOut()
    res.redirect('/login')
})

module.exports = router