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

export const getSubcategories = async (req, res, next) => {
	try {
		const { slug } = req.params

		if (!slug) {
			throw HttpError(400, 'Category slug is required')
		}

		const category = await Category.findOne({ slug })
		if (!category) {
			throw HttpError(404, 'Category not found')
		}

		const subcategories = await Category.find({ parentId: category.id })

		if (subcategories.length === 0) {
			throw HttpError(404, 'Subcategories not found')
		}

		res.status(200).json(subcategories)
	} catch (error) {
		next(error)
	}
}
export const getCategoryWithProducts = async (req, res, next) => {
	try {
		const { slug } = req.params
		const {
			page = 1,
			limit = 12,
			location = 'mebliPervomaisk',
			sortField,
			sortOrder,
			minPrice,
			maxPrice,
			...filters
		} = req.query

		const locationMap = {
			mebliBalta: 'paramsFrom_01_MebliBalta',
			mebliPodilsk: 'paramsFrom_02_MebliPodilsk',
			mebliPervomaisk: 'paramsFrom_03_MebliPervomaisk',
			mebliOdesa1: 'paramsFrom_04_MebliOdesa1',
			mebliVozнесensk: 'paramsFrom_05_MebliVozнесensk',
		}

		let filterField = locationMap[location]
		if (!filterField) {
			if (location.startsWith('paramsFrom_')) {
				filterField = location
			} else {
				throw HttpError(400, `Invalid location: '${location}'`)
			}
		}

		const dynamicKeys = await extractDynamicKeys()

		const queryFilter = {
			[`${filterField}.Відображення на сайті`]: '1',
		}

		if (minPrice || maxPrice) {
			queryFilter[`${filterField}.RetailPrice`] = {}
			if (minPrice)
				queryFilter[`${filterField}.RetailPrice`]['$gte'] = Number(minPrice)
			if (maxPrice)
				queryFilter[`${filterField}.RetailPrice`]['$lte'] = Number(maxPrice)
		}

		Object.entries(filters).forEach(([key, value]) => {
			if (dynamicKeys.includes(key)) {
				queryFilter[`${filterField}.${key}`] = value
			}
		})

		const category = await Category.findOne({ slug })
		if (!category) {
			throw HttpError(404, 'Категория не найдена')
		}

		const gatherCategoryIds = async parentId => {
			const subcategories = await Category.find({ parentId })
			const subcategoryIds = subcategories.map(subcategory => subcategory.id)

			for (const subcategory of subcategories) {
				const nestedIds = await gatherCategoryIds(subcategory.id)
				subcategoryIds.push(...nestedIds)
			}

			return subcategoryIds
		}

		const categoryIds = [category.id, ...(await gatherCategoryIds(category.id))]
		queryFilter.categoryId = { $in: categoryIds }

		let sortOptions = {}
		if (sortField && sortOrder) {
			sortOptions = {
				[`${filterField}.${sortField}`]: sortOrder === 'asc' ? 1 : -1,
			}
		}

		const totalProducts = await Product.countDocuments(queryFilter)

		const skip = (page - 1) * limit

		const products = await Product.find(queryFilter)
			.sort(sortOptions)
			.skip(skip)
			.limit(Number(limit))

		const subcategories = await Category.find({ parentId: category.id })
		const subcategoriesWithProducts = await Promise.all(
			subcategories.map(async subcategory => {
				const subcategoryProducts = await Product.find({
					categoryId: subcategory.id,
					[`${filterField}.Відображення на сайті`]: '1',
				}).sort(sortOptions)

				return subcategoryProducts.length
					? {
							subcategory: {
								id: subcategory.id,
								name: subcategory.name,
								slug: subcategory.slug,
							},
							products: subcategoryProducts,
					  }
					: null
			})
		).then(results => results.filter(subcategory => subcategory))

		return res.status(200).json({
			category: {
				id: category.id,
				name: category.name,
				slug: category.slug,
			},
			products,
			subcategories: subcategoriesWithProducts,
			totalProducts,
			totalPages: Math.ceil(totalProducts / limit),
			currentPage: Number(page),
		})
	} catch (error) {
		console.error('Ошибка в getCategoryWithProducts:', error)
		next(error)
	}
}

export const getProductsForSubcategory = async (req, res, next) => {
	try {
		const { slug, subcategorySlug } = req.params
		const {
			page = 1,
			limit = 12,
			location = 'mebliPervomaisk',
			sortField,
			sortOrder,
			minPrice,
			maxPrice,
			...filters
		} = req.query

		const locationMap = {
			mebliBalta: 'paramsFrom_01_MebliBalta',
			mebliPodilsk: 'paramsFrom_02_MebliPodilsk',
			mebliPervomaisk: 'paramsFrom_03_MebliPervomaisk',
			mebliOdesa1: 'paramsFrom_04_MebliOdesa1',
			mebliVozнесensk: 'paramsFrom_05_MebliVozнесensk',
		}

		let filterField = locationMap[location]
		if (!filterField) {
			if (location.startsWith('paramsFrom_')) {
				filterField = location
			} else {
				throw HttpError(400, `Invalid location: '${location}'`)
			}
		}

		const parentCategory = await Category.findOne({ slug })
		if (!parentCategory) {
			throw HttpError(404, 'Родительская категория не найдена')
		}

		const subcategory = await Category.findOne({
			slug: subcategorySlug,
			parentId: parentCategory.id,
		})
		if (!subcategory) {
			throw HttpError(
				404,
				'Подкатегория не найдена или не принадлежит указанной категории'
			)
		}

		const queryFilter = {
			[`${filterField}.Відображення на сайті`]: '1',
			categoryId: subcategory.id,
		}

		if (minPrice || maxPrice) {
			queryFilter[`${filterField}.RetailPrice`] = {}
			if (minPrice) {
				queryFilter[`${filterField}.RetailPrice`]['$gte'] = Number(minPrice)
			}
			if (maxPrice) {
				queryFilter[`${filterField}.RetailPrice`]['$lte'] = Number(maxPrice)
			}
		}

		const dynamicKeys = await extractDynamicKeys()
		Object.entries(filters).forEach(([key, value]) => {
			if (dynamicKeys.includes(key)) {
				queryFilter[`${filterField}.${key}`] = value
			}
		})

		let sortOptions = {}
		if (sortField && sortOrder) {
			sortOptions = {
				[`${filterField}.${sortField}`]: sortOrder === 'asc' ? 1 : -1,
			}
		}

		const totalProducts = await Product.countDocuments(queryFilter)

		const skip = (page - 1) * limit
		const products = await Product.find(queryFilter)
			.sort(sortOptions)
			.skip(skip)
			.limit(Number(limit))

		return res.status(200).json({
			parentCategory: {
				id: parentCategory.id,
				name: parentCategory.name,
				slug: parentCategory.slug,
			},
			subcategory: {
				id: subcategory.id,
				name: subcategory.name,
				slug: subcategory.slug,
			},
			products,
			totalProducts,
			totalPages: Math.ceil(totalProducts / limit),
			currentPage: Number(page),
		})
	} catch (error) {
		console.error('Ошибка в getProductsForSubcategory:', error)
		next(error)
	}
}

export const getProductByCategoryOrSubcategory = async (req, res, next) => {
	try {
		const { slug, subcategorySlug, productId } = req.params

		const category = await Category.findOne({ slug })
		if (!category) {
			throw HttpError(404, 'Категорія не знайдена')
		}

		const subcategory = await Category.findOne({
			slug: subcategorySlug,
			parentId: category.id,
		})
		if (!subcategory) {
			throw HttpError(
				404,
				'Підкатегорія не знайдена або не належить до вказаної категорії'
			)
		}

		const product = await Product.findOne({
			offerId: productId,
		})

		if (!product) {
			throw HttpError(404, 'Продукт не знайдено')
		}

		res.status(200).json({
			product,
			category: {
				id: category.id,
				name: category.name,
				slug: category.slug,
			},
			subcategory: {
				id: subcategory.id,
				name: subcategory.name,
				slug: subcategory.slug,
			},
		})
	} catch (error) {
		console.error('Ошибка в getProductByCategoryOrSubcategory:', error)
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
