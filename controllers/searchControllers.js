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

      
  
  const results = await Product.find({
    $and: searchConditions 
  });
    

    if (results.length === 0) {
      throw HttpError(404, "Product not found");
    }
    res.status(200).json(results);
  }
  catch (er) {
    next(er);
  }
}