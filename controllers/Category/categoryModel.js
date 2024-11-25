import mongoose from 'mongoose'

const { Schema } = mongoose

const categorySchema = new Schema(
	{
		id: { type: Number, required: true },
		parentId: { type: Number, required: false },
		name: { type: String, required: true },
		slug: { type: String, required: true, unique: true },
		products: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
	},
	{ versionKey: false }
)

const Category = mongoose.model('Category', categorySchema)

export default Category
