import mongoose from 'mongoose'

const { Schema } = mongoose

const productSchema = new Schema(
	{
		offerId: { type: String, required: true },
		type: { type: String, default: 'vendor.model' },
		available: { type: Boolean, required: true },
		currencyId: { type: String, required: true },
		categoryId: { type: String, required: true },
		params: {
			type: Schema.Types.Mixed,
		},
	},
	{
		versionKey: false,
		timestamps: { createdAt: 'createdAt' },
	}
)
const params = [
	'mebliBalta',
	'mebliPodilsk',
	'mebliPervomaisk',
	'mebliOdesa1',
	'mebliVoznesensk',
]
params.forEach(key => {
	productSchema.add({
		[key]: { type: Schema.Types.Mixed },
	})
})

const Product = mongoose.model('Product', productSchema)

export default Product
