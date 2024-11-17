/**
 * @swagger
 * /api/reviews:
 *   post:
 *     summary: Create a new review for a product
 *     tags: [Review]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - offerId
 *               - name
 *               - review
 *             properties:
 *               offerId:
 *                 type: string
 *                 description: The ID of the product being reviewed
 *                 example: "12148"
 *               name:
 *                 type: string
 *                 description: Name of the reviewer
 *                 example: "John Doe"
 *               review:
 *                 type: string
 *                 description: The content of the review
 *                 example: "Great product, really enjoyed it!"
 *     responses:
 *       201:
 *         description: The review was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 review:
 *                   $ref: '#/components/schemas/Review'
 *       400:
 *         description: Product ID, name, or review are missing or the review already exists
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/reviews/{productId}:
 *   get:
 *     summary: Get all reviews for a specific product
 *     tags: [Review]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: The offerID of the product
 *         example: "12148"
 *     responses:
 *       200:
 *         description: A list of reviews for the product
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 reviews:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Review'
 *       400:
 *         description: Product ID is missing
 *       404:
 *         description: No reviews found for this product
 *       500:
 *         description: Internal server error
 */
