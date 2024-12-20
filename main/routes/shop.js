const express = require('express')
const controller = require('../controllers/shop')
const isAuth = require('../middlewares/is-auth');

const router = express.Router()

router.get('/', controller.getHome)
router.get('/shop', controller.getShop)
router.get('/shop/:productId', isAuth, controller.getProduct)
router.get('/about', controller.getAbout)
router.get('/contact', controller.getContact)
// router.get('/profile', isAuth, controller.getProfile)
// router.get('/login', isAuth, controller.getLogin)
router.get('/cart', isAuth, controller.getCart)
router.get('/orders', isAuth, controller.getOrders)

router.post('/cart', isAuth, controller.postCart)
router.post('/cart-delete', isAuth, controller.postCartDelete)
router.post('/create-order', isAuth, controller.postOrder);

module.exports = router