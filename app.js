require('dotenv').config()
require('express-async-errors')

// app setup
const express = require('express')
const app = express()
const connectDB = require('./db/connect')
const authRouter = require('./routes/auth')
const prodRouter = require('./routes/products')
const cartRouter = require('./routes/cart')
const {getAllProducts} = require('./controllers/product')

// extra security packages
const helmet = require('helmet')
const cors = require('cors')
const xss = require('xss-clean')
const rateLimiter = require('express-rate-limit')

// Swagger documentation
const swaggerUI = require('swagger-ui-express')
const YAML = require('yamljs')
const swaggerDocumentation = YAML.load('./swagger.yaml')


// custom built middleware
const notFoundMiddleware = require('./middleware/notfound')
const errorHandlerMiddleware = require('./middleware/error-handler')
const authenticateUser = require('./middleware/authentication')

// extra packages
app.set('trust proxy', 1)
app.use(rateLimiter(
  {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  }  
))
app.use(express.json());
app.use(helmet())
app.use(cors())
app.use(xss())

// documentation route after deployment
app.get('/',(req,res)=>{
    res.send('<h4>E-commerce Api: please note that the documentation provided with swagger-ui should be tested with postman or any other api client apart from swagger-ui itself!!, as only the auth routes will work on swagger-ui..</h4><a href="/api-docs">Documentation</a>')
  })
  app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocumentation))

// routes
app.use('/api/v1/auth', authRouter)
app.get('/api/v1/products/get-all-products', getAllProducts) // allows for prospective customers to view all products without registering
app.use('/api/v1/products',authenticateUser, prodRouter)
app.use('/api/v1/cart',authenticateUser, cartRouter)


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
