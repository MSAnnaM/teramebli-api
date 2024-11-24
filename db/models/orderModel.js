import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  form: {
  firstName: { type: String },
  lastName: { type: String},
  phone: { type: String, required: true },
  email: { type: String },
  city: { type: String },
  street: { type: String },
  house: { type: String },
  apartment: { type: String },
    comment: { type: String },
    delivery: { type: String },
   payment: { type: String}
},
  cartItems:[
    { offerId: { type: String},
      ModelName: { type: String },
      Articul: { type: String},
      RetailPrice: { type: mongoose.Schema.Types.Mixed },
      RetailPriceWithDiscount: { type: mongoose.Schema.Types.Mixed },
      currencyId: { type: String},
      quantity: { type: Number }
    }
  ],
  total:{type: mongoose.Schema.Types.Mixed},
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);

export default Order;
