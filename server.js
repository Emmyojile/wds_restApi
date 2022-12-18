require('dotenv').config()

const express = require('express')
const app = express()
const port = 3000
const mongoose = require('mongoose')
const connectDB = require('./db/connect')


app.use(express.json())

const productsRouter = require('./routes/products')
app.use('/products', productsRouter)

const start = async () => {
    try {
        await connectDB(process.env.mongo_uri)
        app.listen(port, () => console.log(`Server is listening on port ${port}`))
    } catch (error) {
        console.log(error)
    }
}

start()