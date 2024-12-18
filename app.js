import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import swaggerUi from 'swagger-ui-express'
import swaggerSpec from './helpers/swagger.js'
import dotenv from 'dotenv'
dotenv.config()

import fileRouter from './controllers/File/fileRoutes.js'
import productRouter from './controllers/Product/productRoutes.js'
import categoryRouter from './controllers/Category/categoryRoutes.js'
import orderRouter from './controllers/Order/orderRoutes.js'
import searchRouter from './controllers/Search/searchRouter.js'
import reviewRouter from './controllers/Review/reviewRoutes.js'

const app = express()
app.use(morgan('tiny'))
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

app.use('/api/file', fileRouter)
app.use('/api/category', categoryRouter)
app.use('/api/product', productRouter)
app.use('/api', orderRouter)
app.use('/api/search', searchRouter)
app.use('/api/reviews', reviewRouter)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

app.use((_, res) => {
	res.status(404).json({ message: 'Route not found' })
})

app.use((err, req, res, next) => {
	const { status = 500, message = 'Server error' } = err
	res.status(status).json({ message })
})

export default app
