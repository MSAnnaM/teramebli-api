import Category from "../db/models/categoryModel.js";
import Product from "../db/models/productModel.js";
import HttpError from "../helpers/HttpError.js";

export const getAllCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({});
    res.status(200).json(categories);
  } catch (er) {
    next(er);
  }
};

export const getSubcategories = async (req, res, next) => {
  try {
    const { categoryId } = req.params;
    const subcategories = await Category.find({ parentId: categoryId });

    if (!subcategories) {
      throw HttpError(404, "Category not found");
    }

    res.status(200).json(subcategories);
  } catch (er) {
    next(er);
  }
};

export const getCategoryWithProduct = async (req, res, next) => {
  try {
    const { categoryId } = req.params;
    const page = +req.query.page || 1;
    const limit = +req.query.limit || 10;

    const category = await Category.findOne({ id: categoryId });
    if (!category) {
      throw HttpError(404, "Category not found");
    }

    const skip = (page - 1) * limit;
    const products = await Product.find({ categoryId: category.id })
      .limit(limit)
      .skip(skip);

    const totalProducts = await Product.countDocuments({
      categoryId: category.id,
    });

    res.status(200).json({
      category,
      products,
      totalProducts,
      totalPages: Math.ceil(totalProducts / limit),
      currentPage: +page,
    });
  } catch (er) {
    next(er);
  }
};
