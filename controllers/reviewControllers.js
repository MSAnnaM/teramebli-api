import Review from '../db/models/reviewModel.js';
import HttpError from '../helpers/HttpError.js';

export const createReview = async (req, res, next) => {
  try {
    const { offerId, name, review } = req.body;

    if (!offerId || !name || !review) {
      throw HttpError(400, "Product ID, name, and review are required");
      }
      
      const existingReview = await Review.findOne({ review: review });

      if (existingReview) {
          throw HttpError(400, "Your review already exists");
      }
      

    const newReview = await Review.create({
      offerId,
      name,
      review
    });
      

    res.status(201).json({review: newReview });
  } catch (error) {
    next(error);
  }
};

export const getReviews = async (req, res, next) => {
  try {
    const { productId } = req.params;

    if (!productId) {
      throw HttpError(400, "Product ID is required");
    }

    const reviews = await Review.find({offerId: productId });

    if (reviews.length === 0) {
      throw HttpError(404, "No reviews found for this product");
    }

    res.status(200).json({ reviews });
  } catch (error) {
    next(error);
  }
};
