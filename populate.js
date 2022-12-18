require('dotenv').config()

const products = require('./products.json')
const connectDB = require('./db/connect')
const Product = require('./models/product')

const start = async () => {
    try {
        await connectDB(process.env.mongo_uri)
        await Product.create(products)
        console.log('Success')
        process.exit(0)
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}

start()