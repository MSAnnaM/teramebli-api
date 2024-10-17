import Order from "../db/models/orderModel.js";
import HttpError from "../helpers/HttpError.js";

export const createOrder = async (req, res, next) => {
  try {
    const order = req.body;

    if (!order) {
      throw HttpError(404, "Bad request");
    }

    const newOrder = await Order.create(order);
    res.status(201).json(newOrder);
  } catch (er) {
    next(er);
    console.log(er);
  }
};
