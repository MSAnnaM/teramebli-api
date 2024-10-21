import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },

    extraFields: { type: mongoose.Schema.Types.Mixed, required: false },

    cartItems: [
      {
        Articul: { type: String, required: true },
        RetailPrice: { type: Number, required: true },
        RetailPriceWithDiscount: { type: Number },
        ModelName: { type: String, required: true },
        quantity: { type: Number, required: true },

        additionalFields: {
          type: mongoose.Schema.Types.Mixed,
          required: false,
        },
      },
    ],
  },
  { timestamps: true, strict: false }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;
