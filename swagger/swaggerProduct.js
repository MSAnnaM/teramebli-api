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
 *     summary: Retrieve all products with pagination
 *     description: Fetch all products from the database with pagination support.
 *     parameters:
 *       - name: page
 *         in: query
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *           description: The page number to retrieve.
 *       - name: limit
 *         in: query
 *         required: false
 *         schema:
 *           type: integer
 *           default: 12
 *           description: Number of products to retrieve per page.
 *     responses:
 *       200:
 *         description: Products retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalProducts:
 *                   type: integer
 *                   description: Total number of products available.
 *                 totalPages:
 *                   type: integer
 *                   description: Total number of pages.
 *                 currentPage:
 *                   type: integer
 *                   description: Current page number.
 *                 products:
 *                   type: array
 *                   items:
 *                     type: object
 *                     description: A product object.
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
 *     summary: Retrieve product details
 *     description: Fetch detailed information about a specific product by its offerId.
 *     parameters:
 *       - name: productId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           description: The unique offerId of the product.
 *     responses:
 *       200:
 *         description: Product details retrieved successfully
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
 *       404:
 *         description: Product not found
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
 * /api/product/photo/{productId}:
 *   get:
 *     tags:
 *       - Product
 *     summary: Retrieve product photos
 *     description: Fetch photos associated with a specific product by its offerId.
 *     parameters:
 *       - name: productId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           description: The unique offerId of the product to retrieve photos for.
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
 *         description: Photos not found
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
