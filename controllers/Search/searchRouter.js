import express from 'express'
import { searchProducts } from './searchControllers.js'

const searchRouter = express.Router()

searchRouter.get('/:paramsKey', searchProducts)
export default searchRouter
