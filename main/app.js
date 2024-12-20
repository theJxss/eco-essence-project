require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI

const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const session = require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session)
const csrf = require('csurf')
const flash = require('connect-flash')

const User = require('./models/user')

const shopRouter = require('./routes/shop')
const adminRouter = require('./routes/admin')
const authRouter = require('./routes/auth')

const app = express()
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions'
})

const csrfProtection = csrf()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))
app.set('view engine', 'ejs')
app.set('views', 'views')

app.use(
  session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store: store
  })
);
app.use(csrfProtection)
app.use(flash())

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn
  res.locals.csrfToken = req.csrfToken()
  next()
})

app.use(shopRouter)
app.use('/admin', adminRouter)
app.use(authRouter)

app.use((req, res, next) => {
  res.status(404).render('404', {
    title: 'EcoEssence | Página não encontrada',
    nav: true,
    end: true,
    style:'home.css'
  })
})

mongoose
  .connect(MONGODB_URI)
  .then(result => {
    console.log('Connected to MongoDB')
    app.listen(3000);
  }).catch(err => {
      console.log(err);
    });