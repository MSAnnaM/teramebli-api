import express from 'express'
import {
	getAllCategories,
	getCategoryWithProducts,
} from './categoryControllers.js'

const categoryRouter = express.Router()

categoryRouter.get('/', getAllCategories)

categoryRouter.get('/:categoryId', getCategoryWithProducts)

export default categoryRouter
