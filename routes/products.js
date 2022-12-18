const express = require('express')
const router = express.Router()
const Product = require('../models/product')
const { StatusCodes } = require('http-status-codes')
const product = require('../models/product')

//Getting all
router.get('/', async (req, res) => {
    try {
        const products = await Product.find({})
        if (!products) {
            return res.status(StatusCodes.NOT_FOUND).json({msg : `Oops no products found in our database!`})
        }

        return res.status(StatusCodes.OK).json({totalproducts : products.length, products})
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error : error.message})
    }
})
//Getting one
router.get('/:id', getProduct, (req, res) => {
    res.json(res.product)
}) 
//Creating one
router.post('/', async (req, res) => {
    try {
        const {product_name, price} = req.body

        if (!(product_name || price)) {
            return res.status(StatusCodes.BAD_REQUEST).json({msg : `Please provide all the required Parameters`})
        }

        const newProduct = await Product.create({...req.body})
        return res.status(StatusCodes.CREATED).json({newProduct})
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error : error.message})
    }
    
})
//Updating one
router.patch('/:id', getProduct, async (req, res) => {
    if (req.body.product_name != null) {
        res.product.product_name = req.body.product_name
    }
    if (req.body.price != null) {
        res.product.price = req.body.price
    }
    try {
        const updatedProduct = await res.product.save()
        
        if(!updatedProduct) {
            return res.status(StatusCodes.NOT_FOUND).json({msg : 'Product does not exist'})
        }

        res.json(updatedProduct)
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).json({msg : error.msg})
    }
})
//Deleting one
router.delete('/:id', getProduct, async (req, res) => {
    try {
        await res.product.remove()
        res.json({msg : 'Deleted Product Successfully'})
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg : error.msg})
    }
})

async function getProduct(req, res, next) {
    let product 
    try {
        product = await Product.findById(req.params.id)
        if (product == null) {
            return res.status(StatusCodes.NOT_FOUND).json({msg : 'Can not find product'})
        }
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg : error.msg})
    }

    res.product = product
    next()
}

module.exports = router