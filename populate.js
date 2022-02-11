require('dotenv').config()
const connectDB = require('./db/connect')
const Products = require('./models/product')
const productJson = require('./products.json')

const populate= async(req,res)=>{
  try {
    await connectDB(process.env.MONGO_URI)
    await Products.deleteMany()
    await Products.create(productJson)
    console.log('connected to the database successfully');
    process.exit(0)
  } catch (error) {
    console.error(error);
    process.exit(1)
  }
}

populate()