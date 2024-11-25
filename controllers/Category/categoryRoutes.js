import express from 'express'
import {
	getAllCategories,
	getCategoryWithProducts,
	getProductByCategoryOrSubcategory,
	getProductsForSubcategory,
	getSubcategories,
} from './categoryControllers.js'
import { getPhoto } from '../Product/productControllers.js'

const categoryRouter = express.Router()

categoryRouter.get('/', getAllCategories)

categoryRouter.get('/:slug/sub', getSubcategories)

categoryRouter.get('/:slug/products', getCategoryWithProducts)

categoryRouter.get(
	'/:slug/:subcategorySlug/products',
	getProductsForSubcategory
)

categoryRouter.get(
	'/:slug/:subcategorySlug/product/:productId',
	getProductByCategoryOrSubcategory
)
categoryRouter.get('/photo/:productId', getPhoto)

export default categoryRouter
