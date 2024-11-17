import Product from './productModel.js'
import HttpError from '../../helpers/HttpError.js'
import { getFiles } from '../../services/ftpService.js'

export const getProduct = async (req, res, next) => {
	try {
		const { productId } = req.params
		const product = await Product.findOne({ offerId: productId })
		if (!product) {
			throw HttpError(404, 'Product not found')
		}
		res.status(200).json(product)
	} catch (er) {
		next(er)
	}
}

export const getPhoto = async (req, res, next) => {
	try {
		const { productId } = req.params

		const remotePath = '/tera-mebli.com/torgsoft/foto'
		const files = await getFiles(remotePath, productId)

		if (!files || !files.files) {
			throw HttpError(404, 'Photo not found')
		}

		res.json({ files })
	} catch (er) {
		next(er)
	}
}
