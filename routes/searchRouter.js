import express from "express";
import { searchProducts } from "../controllers/searchControllers.js";


const searchRouter = express.Router();
/**
 * @swagger
 * tags:
 *   - name: Search
 *     description: Operations related to products
 *
 * /api/search:
 *   get:
 *     tags: 
 *       - Search
 *     summary: Search products by parameters
 *     description: Use this endpoint to search for products by various parameters in the `params` object.
 *     parameters:
 *       - in: query
 *         name: info
 *         required: true
 *         description: Search terms separated by +.
 *         schema:
 *           type: string
 *           example: "ліжко+18000"
 *     responses:
 *       200:
 *         description: A list of products matching the search criteria.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   offerId:
 *                     type: string
 *                   type:
 *                     type: string
 *                   available:
 *                     type: boolean
 *                   currencyId:
 *                     type: string
 *                   categoryId:
 *                     type: string
 *                   params:
 *                     type: object
 *                     properties:
 *                       Articul:
 *                         type: string
 *                       RetailPrice:
 *                         type: string
 *                       RetailPriceWithDiscount:
 *                         type: string
 *                       ModelName:
 *                         type: string
 *                       GoodNameUA:
 *                         type: string
 *                       Приналежність до категорії:
 *                         type: string
 *                       Габарит.розміри:
 *                         type: object
 *                         properties:
 *                           Висота:
 *                             type: string
 *                           Довжина:
 *                             type: string
 *                           Ширина:
 *                             type: string
 *       404:
 *         description: Product not found
 */


searchRouter.get("/", searchProducts);
export default searchRouter;