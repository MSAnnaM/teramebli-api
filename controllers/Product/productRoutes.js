import express from 'express'
import { getAllProducts, getPhoto, getProduct } from './productControllers.js'

const productRouter = express.Router()

// productRouter.get('/', getAllProducts)

// productRouter.get('/photo/:productId', getPhoto)

// productRouter.get('/:productId', getProduct)
export default productRouter
