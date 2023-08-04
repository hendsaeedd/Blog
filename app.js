const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const methodOverride = require('method-override')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const mongoStore = require('connect-mongo')
const connectDB = require('./server/config/db')

require('dotenv').config()
const {isActiveRoute} = require('./server/helpers/routeHelpers')

const app = express()
const PORT = process.env.PORT || 3000

//connect to database
connectDB()

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cookieParser())

//method override
app.use(methodOverride('_method'))


//session
app.use(session({
  // secret: process.env.SESSION_SECRET,
  secret: 'secret',
  resave: false,
  saveUninitialized: false,
  store: mongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    collectionName: 'sessions'
    }),
  // cookie: {
  //   maxAge: new Date(Date.now() + 60 * 60 * 1000)}
  }))

app.use(express.static('public'))

//template engine
app.use(expressLayouts)
app.set('layout', 'layouts/main')
app.set('view engine', 'ejs')

app.locals.isActiveRoute = isActiveRoute

//main page
app.use('/', require('./server/routes/main'))
//admin page
app.use('/', require('./server/routes/admin'))

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})