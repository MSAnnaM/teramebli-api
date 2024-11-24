import mongoose from "mongoose";

const { Schema } = mongoose;

const productSchema = new Schema({
  offerId: { type: String, required: true },
  type: { type: String, default: "vendor.model" },
  available: { type: Boolean, required: true },
  currencyId: { type: String, required: true },
  categoryId: { type: String, required: true },
  params: {
    type: Schema.Types.Mixed,
    required: true,
  },
}, {
  versionKey: false,
  timestamps: { createdAt: "createdAt" },
});

const Product = mongoose.model("Product", productSchema);

export default Product;