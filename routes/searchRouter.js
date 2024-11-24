import express from "express";
import { searchProducts } from "../controllers/searchControllers.js";


const searchRouter = express.Router();
/**
 * @swagger
 * /api/search/{paramsKey}:
 *   get:
 *     tags:
 *       - Search
 *     summary: Search for products based on query parameters
 *     description: This endpoint allows searching for products by various parameters like Articul, RetailPrice, ModelName, and more. Results are paginated.
 *     parameters:
 *       - in: path
 *         name: paramsKey
 *         required: true
 *         schema:
 *           type: string
 *         description: The key for the product parameters (e.g., paramsFrom_01_MebliBalta).
 *       - in: query
 *         name: info
 *         required: true
 *         schema:
 *           type: string
 *         description: Search term for finding products (can be a product name, articul, price, etc.)
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *         description: The page number for pagination.
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of results per page.
 *     responses:
 *       200:
 *         description: A list of matching products.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalSearch:
 *                   type: integer
 *                   description: Total number of search results.
 *                 totalPages:
 *                   type: integer
 *                   description: Total number of pages.
 *                 currentPage:
 *                   type: integer
 *                   description: Current page number.
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *       400:
 *         description: Bad request (missing or invalid query parameters).
 *       404:
 *         description: No products found matching the search criteria.
 *       500:
 *         description: Internal server error.
 */
searchRouter.get("/:paramsKey", searchProducts);
export default searchRouter;