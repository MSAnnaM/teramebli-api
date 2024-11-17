/**
 * @swagger
 * tags:
 *   - name: Category
 *     description: API for managing categories and products
 */

/**
 * @swagger
 * /api/category:
 *   get:
 *     tags:
 *       - Category
 *     summary: Get all categories
 *     description: Retrieves a list of all categories, including their subcategories.
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
 *                     type: integer
 *                     description: The unique identifier of the category.
 *                   name:
 *                     type: string
 *                     description: The name of the category.
 *                   parentId:
 *                     type: integer
 *                     nullable: true
 *                     description: The ID of the parent category, if applicable.
 *                   subcategories:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           description: The unique identifier of the subcategory.
 *                         name:
 *                           type: string
 *                           description: The name of the subcategory.
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/category/{categoryId}:
 *   get:
 *     tags:
 *       - Category
 *     summary: Get a category or subcategory with products
 *     description: Retrieves category or subcategory details. If it is a main category, all products from its subcategories are included. If it is a subcategory, only its products are shown.
 *     parameters:
 *       - name: categoryId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: The unique identifier of the category or subcategory.
 *       - name: page
 *         in: query
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *         description: The page number for pagination.
 *       - name: limit
 *         in: query
 *         required: false
 *         schema:
 *           type: integer
 *           default: 12
 *         description: The number of products per page for pagination.
 *       - name: sortBy
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *           default: createdAt
 *         description: The field to sort products by.
 *       - name: order
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: asc
 *         description: The sort order (ascending or descending).
 *     responses:
 *       200:
 *         description: Category or subcategory with products
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: The unique identifier of the category.
 *                 name:
 *                   type: string
 *                   description: The name of the category.
 *                 parentId:
 *                   type: integer
 *                   nullable: true
 *                   description: The ID of the parent category, if applicable.
 *                 products:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         description: The unique identifier of the product.
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
 *                   description: The total number of products.
 *                 totalPages:
 *                   type: integer
 *                   description: The total number of pages.
 *                 currentPage:
 *                   type: integer
 *                   description: The current page number.
 *       404:
 *         description: Category not found
 *       500:
 *         description: Server error
 */
