import Product from '../Product/productModel.js'
import HttpError from '../../helpers/HttpError.js'

export const searchProducts = async (req, res, next) => {
	try {
		const { info, page = 1, limit = 10 } = req.query
		const { paramsKey } = req.params

		const allowedParamsKeys = {
			mebliBalta: 'paramsFrom_01_MebliBalta',
			mebliPodilsk: 'paramsFrom_02_MebliPodilsk',
			mebliPervomaisk: 'paramsFrom_03_MebliPervomaisk',
			mebliOdesa1: 'paramsFrom_04_MebliOdesa1',
			mebliVozнесensk: 'paramsFrom_05_MebliVozнесensk',
		}

		if (!allowedParamsKeys.includes(paramsKey)) {
			throw HttpError(404, 'Invalid paramsKey')
		}

		if (!info) {
			throw HttpError(404, "Bad request, 'info' is required")
		}

		const searchTerms = info.split(' ')
		const searchConditions = searchTerms.map(term => ({
			$regex: term,
			$options: 'i',
		}))

		const sampleDocument = await Product.findOne({
			[paramsKey]: { $exists: true },
		}).lean()

		if (!sampleDocument || !sampleDocument[paramsKey]) {
			throw HttpError(404, `No document with ${paramsKey} found`)
		}

		const actualKeys = Object.keys(sampleDocument[paramsKey])

		const searchConditionsForParams = actualKeys.flatMap(key =>
			searchConditions.map(condition => ({
				[`${paramsKey}.${key}`]: condition,
			}))
		)

		const filters = {
			[`${paramsKey}.Відображення на сайті`]: '1',
			[`${paramsKey}.ModelName`]: { $ne: '' },
			$or: searchConditionsForParams,
		}

		const skip = (page - 1) * limit

		const results = await Product.find(filters).skip(skip).limit(Number(limit))

		if (results.length === 0) {
			return res.status(404).json({ message: 'Product not found' })
		}

		const totalSearch = await Product.countDocuments(filters)
		const totalPages = Math.ceil(totalSearch / limit)

		res.status(200).json({
			totalSearch,
			totalPages,
			currentPage: Number(page),
			results,
		})
	} catch (error) {
		console.error('Error during search:', error)
		next(error)
	}
}
