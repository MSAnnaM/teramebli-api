import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    offerId: { type: String, required: true },
    name: { type: String, required: true },
    review: { type: String, required: true },
  },
  { timestamps: true } // Додає поля createdAt та updatedAt
);

const Review = mongoose.model('Review', reviewSchema);

export default Review;
