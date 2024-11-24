import fs from "fs/promises";
import xml2js from "xml2js";
import Product from "../db/models/productModel.js";
import Category from "../db/models/categoryModel.js";
import HttpError from "../helpers/HttpError.js";

export const createDB = async (req, res, next) => {
  try {
    const filePath = req.file.path;

    const parser = new xml2js.Parser();
    const data = await fs.readFile(filePath);
    if (!data) {
      throw HttpError(400, "Failed to read file");
    }

    const result = await parser.parseStringPromise(data);
    if (!result) {
      throw HttpError(400, "Failed to parse XML");
    }

    const categories = result.yml_catalog.shop[0].categories[0].category;
    const offers = result.yml_catalog.shop[0].offers[0].offer;

    categories.forEach(async (category) => {
      await Category.create({
        id: category.$.id,
        parentId: category.$.parentId,
        name: category._,
      });

      offers.forEach(async (offer) => {
        await Product.create({
          offerId: offer.$.id,
          type: offer.$.type || "vendor.model",
          available: offer.available[0] === "true",
          currencyId: offer.currencyId[0],
          categoryId: offer.categoryId[0],
          params: offer.param.reduce((acc, param) => {
            acc[param.$.name] = param._;
            return acc;
          }, {}),
        });
      });
    });
      
      res.status(200).json("File successfully uploaded and processed");
  } catch (er) {
    next(er);
  }
};

export const updateDB = async (req, res, next) => {
  try {
    const filePath = req.file.path;

    const parser = new xml2js.Parser();
    const data = await fs.readFile(filePath);
    if (!data) {
      throw HttpError(400, "Failed to read file");
    }

    const result = await parser.parseStringPromise(data);
    if (!result) {
      throw HttpError(400, "Failed to parse XML");
    }

    const categories = result.yml_catalog.shop[0].categories[0].category;
    const offers = result.yml_catalog.shop[0].offers[0].offer;

    categories.forEach(async (category) => {
      await Category.findOneAndUpdate(
        { id: category.$.id },
        {
          parentId: category.$.parentId || null,
          name: category._,
        },
        { upsert: true, new: true }
      );
    });

    offers.forEach(async (offer) => {
      const params = offer.param.reduce((acc, param) => {
        acc[param.$.name] = param._;
        return acc;
      }, {});

      await Product.findOneAndUpdate(
        { offerId: offer.$.id },
        {
          type: offer.$.type || "vendor.model",
          available: offer.available[0] === "true",
          currencyId: offer.currencyId[0],
          categoryId: offer.categoryId[0],
          params,
        },
        { upsert: true, new: true }
      );
    });

    res.status(200).json("Data successfully updated");
  } catch (er) {
    next(er);
  }
};