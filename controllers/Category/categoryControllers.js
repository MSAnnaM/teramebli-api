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
			sortBy = '',
			order = 'asc',
			location = 'mebliPervomaisk',
		} = req.query

		const locationMap = {
			mebliBalta: 'paramsFrom_01_MebliBalta',
			mebliPodilsk: 'paramsFrom_02_MebliPodilsk',
			mebliPervomaisk: 'paramsFrom_03_MebliPervomaisk',
			mebliOdesa1: 'paramsFrom_04_MebliOdesa1',
			mebliVoznesensk: 'paramsFrom_05_MebliVoznesensk',
		}

		const sortField = locationMap[location]
		if (!sortField) {
			throw HttpError(400, `Invalid location: '${location}'`)
		}

		const dynamicKeys = await extractDynamicKeys()
		const validSortKeys = ['createdAt', ...dynamicKeys]

		if (!validSortKeys.includes(sortBy)) {
			throw HttpError(400, `Invalid sort key: '${sortBy}'`)
		}

		if (!['asc', 'desc'].includes(order)) {
			throw HttpError(400, `Invalid sort order: '${order}'`)
		}

		const sortOption = { [`${sortField}.${sortBy}`]: order === 'asc' ? 1 : -1 }

		const category = await Category.findOne({ id: categoryId })
		if (!category) {
			throw HttpError(404, 'Category not found')
		}

		if (category.parentId) {
			const totalProducts = await Product.countDocuments({
				categoryId,
				[sortField]: { $exists: true },
			})
			const skip = (page - 1) * limit
			const products = await Product.find({
				categoryId,
				[sortField]: { $exists: true },
			})
				.sort(sortOption)
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
					[sortField]: { $exists: true },
				})
				allProducts = allProducts.concat(products)

				const nestedProducts = await gatherSubcategoryProducts(subcategory.id)
				allProducts = allProducts.concat(nestedProducts)
			}

			return allProducts
		}

		const allSubcategoryProducts = await gatherSubcategoryProducts(categoryId)

		const totalProducts = allSubcategoryProducts.length
		const sortedProducts = allSubcategoryProducts.sort((a, b) => {
			const fieldA = a[sortField]?.[sortBy] || 0
			const fieldB = b[sortField]?.[sortBy] || 0
			if (order === 'asc') {
				return fieldA > fieldB ? 1 : -1
			}
			return fieldA < fieldB ? 1 : -1
		})

		const skip = (page - 1) * limit
		const paginatedProducts = sortedProducts.slice(skip, skip + Number(limit))

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
