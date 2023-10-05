// import express
const express = require('express');
const app =  express()
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');

// panggil env hanya di file index.js
require('dotenv').config()

// import koneksi
const pool = require('./helper/connect')
const authorizationChecker = require('./helper/verifyToken')
const swaggerDocs = require('./helper/swagger')

// test koneksi
pool.connect((err,res) => {
    if(err){
        console.log('Failed to connecting!', err)
    }
    else{
        console.log('Connected to Database')
    }
})

// body parser middleware
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// log middleware
app.use(morgan('tiny'));

// swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// panggil route
const user = require('./routes/user')
const movies = require('./routes/movies')

app.use('/login', user);
app.use('/movies', authorizationChecker, movies);

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`)
})