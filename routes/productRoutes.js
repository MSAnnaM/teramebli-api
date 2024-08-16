import express from "express";
import { getAllProducts, getProduct } from "../controllers/productControllers.js";

const productRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Product
 *   description: API for managing products
 */
/**
 * @swagger
 * /api/product:
 *   get:
 *     tags:
 *       - Product
 *     summary: Get all products
 *     description: Retrieve a paginated list of all products from the database.
 *     parameters:
 *       - name: page
 *         in: query
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *           description: The page number for pagination.
 *       - name: limit
 *         in: query
 *         required: false
 *         schema:
 *           type: integer
 *           default: 10
 *           description: The number of products per page for pagination.
 *     responses:
 *       200:
 *         description: A paginated list of products
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalProducts:
 *                   type: integer
 *                   description: The total number of products in the database.
 *                 totalPages:
 *                   type: integer
 *                   description: The total number of pages for pagination.
 *                 currentPage:
 *                   type: integer
 *                   description: The current page number.
 *                 products:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         description: The unique identifier for the product.
 *                       name:
 *                         type: string
 *                         description: The name of the product.
 *                       price:
 *                         type: number
 *                         description: The price of the product.
 *                       description:
 *                         type: string
 *                         description: A brief description of the product.
 *       500:
 *         description: Server error
 */
productRouter.get("/", getAllProducts);
/**
 * @swagger
 * /api/product/{productId}:
 *   get:
 *     tags:
 *       - Product
 *     summary: Get product information by its offerId
 *     description: Retrieve information about a single product by its offerId from the database.
 *     parameters:
 *       - name: productId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           description: The unique identifier for the product.
 *     responses:
 *       200:
 *         description: Successfully retrieved product information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The unique identifier for the product.
 *                 name:
 *                   type: string
 *                   description: The name of the product.
 *                 price:
 *                   type: number
 *                   description: The price of the product.
 *                 description:
 *                   type: string
 *                   description: A brief description of the product.
 *       500:
 *         description: Server error
 */
productRouter.get("/:productId", getProduct)

export default productRouter;
