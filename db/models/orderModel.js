import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    Articul: { type: String, required: true },
    RetailPrice: { type: Number, required: true },
    RetailPriceWithDiscount: { type: Number },
    ModelName: { type: String, required: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;
