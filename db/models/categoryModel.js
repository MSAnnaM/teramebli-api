import mongoose from "mongoose";

const { Schema } = mongoose;

const categorySchema = new Schema(
  {
    id: { type: Number, required: true },
    parentId: { type: Number, required: false },
    name: { type: String, required: true },
  },
  { versionKey: false }
);

const Category = mongoose.model("Category", categorySchema);

export default Category;
