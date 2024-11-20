import Category from './categoryModel.js'
import Product from '../Product/productModel.js'
import HttpError from '../../helpers/HttpError.js'

export const getAllCategories = async (req, res, next) => {
	try {
		const getCategoryWithSubcategories = async (parentId = null) => {
			const categories = await Category.find({ parentId })
			return Promise.all(
				categories.map(async category => {
					const subcategories = await getCategoryWithSubcategories(category.id)
					return {
						...category._doc,
						subcategories,
					}
				})
			)
		}

		const categoriesWithSubcategories = await getCategoryWithSubcategories()
		res.status(200).json(categoriesWithSubcategories)
	} catch (error) {
		next(error)
	}
}

export const getCategoryWithProducts = async (req, res, next) => {
	try {
		const { categoryId } = req.params
		const {
			page = 1,
			limit = 12,
			location = 'mebliPervomaisk',
			...filters
		} = req.query

		const locationMap = {
			mebliBalta: 'paramsFrom_01_MebliBalta',
			mebliPodilsk: 'paramsFrom_02_MebliPodilsk',
			mebliPervomaisk: 'paramsFrom_03_MebliPervomaisk',
			mebliOdesa1: 'paramsFrom_04_MebliOdesa1',
			mebliVozнесensk: 'paramsFrom_05_MebliVozнесensk',
		}

		const filterField = locationMap[location]
		if (!filterField) {
			throw HttpError(400, `Invalid location: '${location}'`)
		}

		const dynamicKeys = await extractDynamicKeys()

		const queryFilter = { [`${filterField}`]: { $exists: true } }
		Object.entries(filters).forEach(([key, value]) => {
			if (dynamicKeys.includes(key)) {
				queryFilter[`${filterField}.${key}`] = value
			}
		})

		const category = await Category.findOne({ id: categoryId })
		if (!category) {
			throw HttpError(404, 'Category not found')
		}

		if (category.parentId) {
			const parent = await Category.findOne({ id: category.parentId })
			category._doc.parent = parent
		}

		if (category.parentId) {
			queryFilter.categoryId = categoryId
			const totalProducts = await Product.countDocuments(queryFilter)
			const skip = (page - 1) * limit
			const products = await Product.find(queryFilter)
				.skip(skip)
				.limit(Number(limit))

			return res.status(200).json({
				...category._doc,
				products,
				totalProducts,
				totalPages: Math.ceil(totalProducts / limit),
				currentPage: Number(page),
			})
		}

		const gatherSubcategoryProducts = async parentId => {
			const subcategories = await Category.find({ parentId })
			let allProducts = []

			for (const subcategory of subcategories) {
				const products = await Product.find({
					categoryId: subcategory.id,
					...queryFilter,
				})
				allProducts = allProducts.concat(products)

				const nestedProducts = await gatherSubcategoryProducts(subcategory.id)
				allProducts = allProducts.concat(nestedProducts)
			}

			return allProducts
		}

		const allSubcategoryProducts = await gatherSubcategoryProducts(categoryId)
		const totalProducts = allSubcategoryProducts.length

		const skip = (page - 1) * limit
		const paginatedProducts = allSubcategoryProducts.slice(
			skip,
			skip + Number(limit)
		)

		return res.status(200).json({
			...category._doc,
			products: paginatedProducts,
			totalProducts,
			totalPages: Math.ceil(totalProducts / limit),
			currentPage: Number(page),
		})
	} catch (error) {
		console.error('Error in getCategoryWithProducts:', error)
		next(error)
	}
}

const extractDynamicKeys = async () => {
	const sampleProduct = await Product.findOne().lean()
	if (!sampleProduct) {
		throw new Error('No products available to extract keys')
	}

	const dynamicKeys = []
	Object.keys(sampleProduct).forEach(key => {
		if (key.startsWith('paramsFrom_')) {
			const paramKeys = Object.keys(sampleProduct[key])
			dynamicKeys.push(...paramKeys)
		}
	})

	return Array.from(new Set(dynamicKeys))
}
