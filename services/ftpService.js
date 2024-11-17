import ftp from 'basic-ftp'
import path from 'path'
import fs from 'fs/promises'
import xml2js from 'xml2js'
import Product from '../controllers/Product/productModel.js'
import Category from '../controllers/Category/categoryModel.js'
import dotenv from 'dotenv'
dotenv.config()
const { FTP_HOST, FTP_PORT, FTP_USERNAME, FTP_PASSWORD } = process.env

const FTP_CONFIG = {
	host: FTP_HOST,
	port: FTP_PORT || 21,
	user: FTP_USERNAME,
	password: FTP_PASSWORD,
	secure: false,
}

const client = new ftp.Client()

export const getFiles = async (remotePath, offerId, res, next) => {
	try {
		await client.access(FTP_CONFIG)

		console.log('Connected to FTP server.')

		const files = await client.list(remotePath)

		const fileList = files.map(file => file.name)

		const productPhoto = fileList.filter(file => {
			const regex = new RegExp(`(^|[^0-9])${offerId}([^0-9]|$)`)
			return regex.test(file)
		})

		const tempDir = path.resolve('tmp')
		const fileBuffers = []

		for (const photo of productPhoto) {
			const sanitizedFileName = photo.replace(/[\\/:*?"<>|]/g, '_')

			const ftpFilePath = path.posix.join(remotePath, photo)

			const tempFilePath = path.join(tempDir, sanitizedFileName)

			await client.downloadTo(tempFilePath, ftpFilePath)

			const fileBuffer = fs.readFileSync(tempFilePath)

			fileBuffers.push({
				name: photo,
				buffer: fileBuffer.toString('base64'),
			})

			fs.unlinkSync(tempFilePath)
		}

		return { files: fileBuffers }
	} catch (er) {
		console.error('Error retrieving files via FTP:', er)
	} finally {
		client.close()
	}
}

export const updateDB = async () => {
	try {
		await client.access(FTP_CONFIG)
		console.log('Connected to FTP server.')
		const remotePath = '/tera-mebli.com/torgsoft/tovar'

		const allFileList = await client.list(remotePath)
		const fileList = allFileList.filter(file => file.name.endsWith('.trs'))

		const tempDir = path.resolve('tmp')

		for (const file of fileList) {
			const ftpFilePath = path.posix.join(remotePath, file.name)
			const tempFilePath = path.join(tempDir, file.name)
			await client.downloadTo(tempFilePath, ftpFilePath)
			let data = await fs.readFile(tempFilePath, 'utf-8')

			data = data.replace(/^[\s\x00-\x1F]+/, '')

			const parser = new xml2js.Parser()
			const result = await parser.parseStringPromise(data)

			const categories = result.yml_catalog.shop[0].categories[0].category
			const offers = result.yml_catalog.shop[0].offers[0].offer

			categories.forEach(async category => {
				await Category.findOneAndUpdate(
					{ id: category.$.id },
					{
						parentId: category.$.parentId || null,
						name: category._,
					}
				)
			})

			const paramsKey = `paramsFrom_${file.name
				.replace('.trs', '')
				.replace('.', '_')}`

			offers.forEach(async offer => {
				const params = offer.param.reduce((acc, param) => {
					acc[param.$.name] = param._
					return acc
				}, {})

				await Product.findOneAndUpdate(
					{ offerId: offer.$.id },
					{
						type: offer.$.type || 'vendor.model',
						available: offer.available[0] === 'true',
						currencyId: offer.currencyId[0],
						categoryId: offer.categoryId[0],
						[paramsKey]: params,
					},
					{ upsert: true, new: true }
				)
			})
		}

		console.log('Data successfully updated from FTP files.')
	} catch (error) {
		console.error('Error updating data:', error)
	} finally {
		client.close()
	}
}
