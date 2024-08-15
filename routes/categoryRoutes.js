import express from "express";
import {
  getAllCategories,
  getCategoryWithProduct,
} from "../controllers/categoryControllers.js";

const categoryRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Category
 *   description: API for managing categories
 */
/**
 * @swagger
 * /api/category:
 *   get:
 *     tags:
 *       - Category
 *     summary: Get all categories
 *     description: Retrieve a list of all categories from the database.
 *     responses:
 *       200:
 *         description: List of categories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: The unique identifier for the category.
 *                   name:
 *                     type: string
 *                     description: The name of the category.
 *                   description:
 *                     type: string
 *                     description: A brief description of the category.
 *       500:
 *         description: Server error
 */
categoryRouter.get("/", getAllCategories);
/**
 * @swagger
 * /api/category/{categoryId}:
 *   get:
 *     tags:
 *       - Category
 *     summary: Get category with products
 *     description: Retrieve a specific category by ID along with a paginated list of products associated with that category.
 *     parameters:
 *       - name: categoryId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           description: The ID of the category to retrieve.
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
 *         description: Category with products
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 category:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: The unique identifier for the category.
 *                     name:
 *                       type: string
 *                       description: The name of the category.
 *                     description:
 *                       type: string
 *                       description: A brief description of the category.
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
 *                 totalProducts:
 *                   type: integer
 *                   description: The total number of products in the category.
 *                 totalPages:
 *                   type: integer
 *                   description: The total number of pages for pagination.
 *                 currentPage:
 *                   type: integer
 *                   description: The current page number.
 *       404:
 *         description: Category not found
 *       500:
 *         description: Server error
 */
categoryRouter.get("/:categoryId", getCategoryWithProduct);

export default categoryRouter;
