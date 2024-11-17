/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: API for managing orders
 */

/**
 * @swagger
 * /api/order:
 *   post:
 *     summary: Create a new order
 *     tags: [Orders]
 *     description: Create a new order with the specified details.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Articul:
 *                 type: string
 *                 description: Unique product identifier
 *               RetailPrice:
 *                 type: number
 *                 description: Product retail price
 *               RetailPriceWithDiscount:
 *                 type: number
 *                 description: Discounted retail price
 *               ModelName:
 *                 type: string
 *                 description: Product model name
 *               name:
 *                 type: string
 *                 description: Customer's name
 *               phone:
 *                 type: string
 *                 description: Customer's phone number
 *               email:
 *                 type: string
 *                 description: Customer's email address
 *     responses:
 *       201:
 *         description: Order successfully created
 *       400:
 *         description: Bad request
 */
