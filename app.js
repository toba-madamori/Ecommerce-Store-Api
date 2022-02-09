require('dotenv').config()
require('express-async-errors')

// app setup
const express = require('express')
const app = express()
const connectDB = require('./db/connect')
const authRouter = require('./routes/auth')

//inbuilt middleware
app.use(express.json())

// custom built middleware
const notFoundMiddleware = require('./middleware/notfound')
const errorHandlerMiddleware = require('./middleware/error-handler')

// routes
app.use('/api/v1/auth', authRouter)

// testing route
app.get('/', (req,res)=>{
    res.send('Welcome to my first application using Node')
})

app.use(errorHandlerMiddleware)
app.use(notFoundMiddleware)

// port
const port = process.env.PORT || 3000

// server
const start = async()=>{
    try {
        await connectDB(process.env.MONGO_URI)
        app.listen(port, ()=>{console.log(`server is listening on ${port}...`)})
    } catch (error) {
        console.log(error);
    }
}

start()