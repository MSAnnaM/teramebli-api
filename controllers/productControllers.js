import Product from "../db/models/productModel.js";
import HttpError from "../helpers/HttpError.js";
import { getFiles } from "../services/ftpService.js";

export const getAllProducts = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const skip = (page - 1) * limit;

    const products = await Product.find().skip(skip).limit(Number(limit));

    const totalProducts = await Product.countDocuments();
    const totalPages = Math.ceil(totalProducts / limit);

    res.status(200).json({
      totalProducts,
      totalPages,
      currentPage: page,
      products,
    });
  } catch (error) {
    next(error);
  }
};

export const getProduct = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const product = await Product.findOne({ offerId: productId });
    if (!product) {
      throw HttpError(404, "Product not found");
    }
    res.status(200).json(product);
  } catch (er) {
    next(er);
  }
};

export const getPhoto = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const remotePath = "/tera-mebli.com/torgsoft/foto";
    const files = await getFiles(remotePath, productId);


    if (!files || files.files.length === 0 || !files.files) {
      throw HttpError(404, "Photo not found");
    }

    res.json({ files });
  } catch (er) {
    next(er);
  }
};