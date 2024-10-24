import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
    city: { type: String},
    street: { type: String},
    house: { type: String },
    apartment: { type: String },
  comment: { type: String },
  cartItems:[
    { offerId: { type: String},
      ModelName: { type: String },
      Articul: { type: String, required: true },
      RetailPrice: { type: mongoose.Schema.Types.Mixed },
      RetailPriceWithDiscount: { type: mongoose.Schema.Types.Mixed },
      currencyId: { type: String},
      quantity: { type: Number, required: true }
    }
  ],
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);

export default Order;
