/**
 * @swagger
 * tags:
 *   name: Product
 *   description: API for managing products
 */
/**
 * @swagger
 * /api/product/photo/{productId}:
 *   get:
 *     summary: Retrieve product photos
 *     tags: [Product]
 *     parameters:
 *       - name: productId
 *         in: path
 *         required: true
 *         description: ID of the product to retrieve photos for
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Photos retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 files:
 *                   type: object
 *                   properties:
 *                     files:
 *                       type: array
 *                       items:
 *                         type: string
 *       404:
 *         description: No photos found for the given product ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
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
