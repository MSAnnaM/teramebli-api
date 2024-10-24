import Product from "../db/models/productModel.js";
import HttpError from "../helpers/HttpError.js";


export const searchProducts = async (req, res, next) => { 
  try {
    const { info } = req.query;

    if (!info) {
      throw HttpError(404, "Bad request");
    }

      const searchTerms = info.split(' ');
      
      
    const searchConditions = searchTerms.map(term => ({
      $or: [
        { 'params.Articul': { $regex: term, $options: 'i' } },
        { 'params.RetailPrice': { $regex: term, $options: 'i' } },
        { 'params.RetailPriceWithDiscount': { $regex: term, $options: 'i' } },
        { 'params.ModelName': { $regex: term, $options: 'i' } },
        { 'params.GoodNameUA': { $regex: term, $options: 'i' } },
        { 'params.Приналежність до категорії': { $regex: term, $options: 'i' } },
        { 'params.Габарит.розміри.Висота(см)(сайт)': { $regex: term, $options: 'i' } },
        { 'params.Габарит.розміри.Довжина(см)(сайт)': { $regex: term, $options: 'i' } },
        { 'params.Габарит.розміри.Ширина(см)(сайт)': { $regex: term, $options: 'i' } },
      ]
    }));
    const { page = 1, limit = 10 } = req.query;

    const skip = (page - 1) * limit;

      
  
  const results = await Product.find({
    $and: searchConditions 
  }).skip(skip).limit(Number(limit));
    

    if (results.length === 0) {
      throw HttpError(404, "Product not found");
    }
    const totalSearch = await Product.countDocuments({ $and: searchConditions });
    const totalPages = Math.ceil(totalSearch / limit);

    res.status(200).json({
      totalSearch,
      totalPages,
      currentPage: page,
      results,
    });
  }
  catch (er) {
    next(er);
  }
}