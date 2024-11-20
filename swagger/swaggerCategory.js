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
 *     summary: Retrieve all categories
 *     description: Returns a list of all categories, including their subcategories.
 *     responses:
 *       200:
 *         description: List of categories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/category/{categoryId}:
 *   get:
 *     tags:
 *       - Category
 *     summary: Retrieve a category or subcategory with products
 *     description: Returns the details of a category or subcategory. If it is a main category, all products from its subcategories are included. If it is a subcategory, only its products are returned.
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
 *         description: The number of products per page.
 *       - name: location
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *           enum: [mebliBalta, mebliPodilsk, mebliPervomaisk, mebliOdesa1, mebliVozнесensk]
 *           default: mebliPervomaisk
 *         description: The location (storage) for filtering products.
 *       - name: filterKey
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *         description: The field to filter products by.
 *       - name: filterValue
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *         description: The value to filter products by.
 *     responses:
 *       200:
 *         description: Details of the category or subcategory with products
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CategoryWithProducts'
 *       404:
 *         description: Category not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The unique identifier of the category.
 *         name:
 *           type: string
 *           description: The name of the category.
 *         parentId:
 *           type: integer
 *           nullable: true
 *           description: The ID of the parent category, if applicable.
 *         subcategories:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Category'
 *     Product:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The unique identifier of the product.
 *         name:
 *           type: string
 *           description: The name of the product.
 *         RetailPrice:
 *           type: number
 *           description: The price of the product.
 *         description:
 *           type: string
 *           description: A brief description of the product.
 *     CategoryWithProducts:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The unique identifier of the category.
 *         name:
 *           type: string
 *           description: The name of the category.
 *         parent:
 *           type: object
 *           nullable: true
 *           properties:
 *             id:
 *               type: integer
 *               description: The unique identifier of the parent category.
 *             name:
 *               type: string
 *               description: The name of the parent category.
 *         parentId:
 *           type: integer
 *           nullable: true
 *           description: The ID of the parent category, if applicable.
 *         products:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Product'
 *         totalProducts:
 *           type: integer
 *           description: The total number of products.
 *         totalPages:
 *           type: integer
 *           description: The total number of pages.
 *         currentPage:
 *           type: integer
 *           description: The current page number.
 */
