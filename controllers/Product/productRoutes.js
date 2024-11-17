import express from 'express'
import { getPhoto, getProduct } from './productControllers.js'

const productRouter = express.Router()

productRouter.get('/photo/:productId', getPhoto)

productRouter.get('/:productId', getProduct)
export default productRouter
