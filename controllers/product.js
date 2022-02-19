const {StatusCodes} = require('http-status-codes')
const Product = require('../models/product')
const FavProducts = require('../models/favorite-products')
const ProductReview = require('../models/product-reviews')
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
    const {user:{userID:user}, params:{id:product}, body:{text}} = req

    // checking if a user has already written a review earlier
    const alreadyreviewed = await ProductReview.findOne({ user, product})
    if(alreadyreviewed){
        return res.status(StatusCodes.OK).json({ msg:'you have already written a review, you can always update it'})
    }
    // checking if the body exists
    if(text.length>1){
        const review = await ProductReview.create({user, product, text})
        return res.status(StatusCodes.CREATED).json({ review })
    }
    throw new BadRequestError('You cannot submit an empty review')

}
const updateReview = async(req,res)=>{
    const {body:{text}, user:{userID:user}, params:{id:product}} = req

    // checking if the user has written a review or not
    const newReview = await ProductReview.findOneAndUpdate({ user, product}, {text}, {new:true, runValidators:true})
    if(!newReview){
        throw new BadRequestError('You have not written a review yet...')
    }
    res.status(StatusCodes.OK).json({ newReview })
}
const deleteReview = async(req,res)=>{
    const { user:{userID:user}, params:{id:product}} = req
    const review = await ProductReview.findOneAndDelete({ user, product })

    if(!review){
        throw new NotFoundError(`no review with userID: ${user}`)
    }

    res.status(StatusCodes.NO_CONTENT).json({ msg: 'success' })
}

const reviews = async(req,res)=>{
    const productID = req.params.id

    const reviews = await ProductReview.findOne({ product:productID })

    if(!reviews){
        return res.status(StatusCodes.OK).json({ msg:'There are no reviews yet, be the first to write a review...!!'})
    }
    res.status(StatusCodes.OK).json({ reviews })
}


const addProductsToFav = async(req,res)=>{
    req.body.user = req.user.userID
    req.body.product = req.params.id

    // checking if the product is already added to favorites
    const alreadyAdded = await FavProducts.findOne({ user:req.user.userID, product:req.params.id})
    if(alreadyAdded){
        return res.status(StatusCodes.BAD_REQUEST).json({ msg:'This product has already been added to your favorites'})
    }
    // adding product to favorites
    const newFavProd = await FavProducts.create(req.body)

    res.status(StatusCodes.CREATED).json({ msg:'success', newFavProd })
}

const removeProductFromFav = async(req,res)=>{
    const productID = req.params.id
    const product = await FavProducts.findOneAndDelete({ product:productID })
    res.status(StatusCodes.NO_CONTENT).json({ msg:'success'})
}

const favoriteProducts = async(req,res)=>{
    const user = req.user.userID
    const favProducts = await FavProducts.find({user:user})
    if(favProducts && favProducts.length>1 ){
        return res.status(StatusCodes.OK).json({ favProducts, nbHits:favProducts.length })
    }
    res.status(StatusCodes.OK).json({ msg:'You currently dont have any favorite products' })
}


module.exports={
    getAllProducts,
    getProduct,
    newProducts,
    reviews,
    writeReview,
    updateReview,
    deleteReview,
    addProductsToFav,
    favoriteProducts,
    removeProductFromFav,
}