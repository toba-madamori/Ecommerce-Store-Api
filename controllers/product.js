const {StatusCodes} = require('http-status-codes')
const Product = require('../models/product')
const {BadRequestError, NotFoundError} = require('../errors')


const getAllProducts = async(req,res)=>{
    // optional query params
    const {name, company, category, sort, fields, numericFilters} = req.query
    const queryObject = {}

    if(name){
        queryObject.name = { $regex:name, $options:'i' }
    }
    if(company){
        queryObject.company = { $regex:company, $options:'i' }
    }
    if(category){
        queryObject.category = category // values will have to be exact, options:['Beer_Wine_Spirits','Bread&Bakery', 'Canned_Goods_Soups', 'Cookies_Snacks_Candy', 'Vegies']
    }

    // numeric filtering logic for [price and rating]
    if(numericFilters){
        const operatorMap={
            '>': '$gt',
            '>=': '$gte',
            '<': '$lt',
            '<=': '$lte',
            '=': '$eq'
        }
        const regEx = /\b(<|>|=|<=|>=)\b/g
        let filters = numericFilters.replace(regEx, (match)=>`-${operatorMap[match]}-`)

        const options = ['price', 'rating']
        filters =  filters.split(',').forEach(item => {
            const [field,operator,value] = item.split('-')
            if(options.includes(field)){
                queryObject[field] = {[operator]:Number(value)}
            }
        });
    }
    let result = Product.find(queryObject)

    // sorting functionality:options are [price, -price, rating, -rating, ]
    if(sort){
        sortingParams = sort.split(',').join(' ');
        result = result.sort(sortingParams)
    }

    // selection functionality: pass in the product fields you want returned or removed
    // to select: [name, category, company, price, rating, description, quantity]
    // to exclude any: [-name, -category, etc...]
    if(fields){
        const fieldsList = fields.split(',').join(' ')
        result = result.select(fieldsList)
    }

    // pagination and limiting of the data recieved
    // options are [page:page number, limit:no of products sent back]
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1)*limit;

    result = result.skip(skip).limit(limit);

    const products = await result;

    res.status(StatusCodes.OK).json({ products, nbHits:products.length })
}

const getProduct = async(req,res)=>{
    const {id:productID} = req.params

    const product = await Product.findOne({_id:productID})
    res.status(StatusCodes.OK).json({ product })
}

const newProducts = async(req,res)=>{
    //past
    let sevenDaysAgo = new Date(new Date().setDate(new Date().getDate() - 7));
    let today = new Date()
    //future
    //let fiveDaysInTheFuture = new Date(new Date().setDate(new Date().getDate() + 5));

    // getting the products added to the catalog in the last 7 days....
    const products = await Product.find({ createdAt: { $lte:today, $gte:sevenDaysAgo } })
    res.status(StatusCodes.OK).json({ products, nbHits: products.length })
}

const writeReview = async(req,res)=>{
    res.status(StatusCodes.OK).json({ msg: 'write a product review' })
}

const reviews = async(req,res)=>{
    res.status(StatusCodes.OK).json({ msg: 'read a product review' })
}

const addProductsToFav = async(req,res)=>{
    res.status(StatusCodes.OK).json({ msg: 'add product to favorites' })
}

// add a barebones search functionality making use of mongoDB's regex word search...

module.exports={
    getAllProducts,
    getProduct,
    newProducts,
    reviews,
    writeReview,
    addProductsToFav,
}