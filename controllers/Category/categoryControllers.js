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
			sortBy = 'createdAt',
			order = 'asc',
		} = req.query

		const sampleDocument = await Product.findOne().lean()
		if (!sampleDocument) {
			throw HttpError(404, 'No products found to determine sort keys')
		}

		const dynamicSortKeys = Object.keys(sampleDocument)
		if (sampleDocument.params) {
			const paramKeys = Object.keys(sampleDocument.params).map(key => `${key}`)
			dynamicSortKeys.push(...paramKeys)
		}

		if (!dynamicSortKeys.includes(sortBy)) {
			throw HttpError(400, `Invalid sort key: '${sortBy}'`)
		}

		if (!['asc', 'desc'].includes(order)) {
			throw HttpError(400, `Invalid sort order: '${order}'`)
		}

		const sortOption = { [sortBy]: order === 'asc' ? 1 : -1 }

		const category = await Category.findOne({ id: categoryId })
		if (!category) {
			throw HttpError(404, 'Category not found')
		}

		if (category.parentId) {
			const totalProducts = await Product.countDocuments({ categoryId })
			const skip = (page - 1) * limit
			const products = await Product.find({ categoryId })
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
		} else {
			const gatherSubcategoryProducts = async parentId => {
				const subcategories = await Category.find({ parentId })
				let allProducts = []

				for (const subcategory of subcategories) {
					const products = await Product.find({ categoryId: subcategory.id })
					allProducts = allProducts.concat(products)

					const nestedProducts = await gatherSubcategoryProducts(subcategory.id)
					allProducts = allProducts.concat(nestedProducts)
				}

				return allProducts
			}

			const allSubcategoryProducts = await gatherSubcategoryProducts(categoryId)

			const totalProducts = allSubcategoryProducts.length

			const sortedProducts = allSubcategoryProducts.sort((a, b) => {
				const fieldA = a[sortBy]
				const fieldB = b[sortBy]
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
		}
	} catch (error) {
		console.error('Error in getCategoryWithProducts:', error)
		next(error)
	}
}
