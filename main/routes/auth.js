const express = require('express')
const controller = require('../controllers/auth')
const isAuth = require('../middlewares/is-auth')

const router = express.Router()

router.get('/login', controller.getLogin)
router.get('/profile', controller.getProfile)
router.get('/signup', controller.getSignup)
router.get('/reset', controller.getReset)
router.get('/new-password', controller.getNewPassword)
router.get('/reset/:token', controller.getNewPassword)

router.post('/signup', controller.postSignup)
router.post('/login', controller.postLogin)
router.post('/logout', controller.postLogout)
router.post('/reset', controller.postReset)
router.post('/new-password', controller.postNewPassword)

module.exports = router