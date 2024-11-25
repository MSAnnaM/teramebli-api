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
 *     description: Fetches all categories, including their nested subcategories.
 *     responses:
 *       200:
 *         description: List of categories with their subcategories
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
 * /api/category/{categoryId}/sub:
 *   get:
 *     tags:
 *       - Category
 *     summary: Retrieve subcategories for a category
 *     description: Fetches all subcategories for a given category.
 *     parameters:
 *       - name: categoryId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the parent category.
 *     responses:
 *       200:
 *         description: List of subcategories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 *       400:
 *         description: Missing or invalid category ID
 *       404:
 *         description: Subcategories not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/category/{categoryId}/products:
 *   get:
 *     tags:
 *       - Category
 *     summary: Retrieve products for a category and its subcategories
 *     description: Fetches all products for a main category, including products from its subcategories.
 *     parameters:
 *       - name: categoryId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the category.
 *       - name: page
 *         in: query
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination.
 *       - name: limit
 *         in: query
 *         required: false
 *         schema:
 *           type: integer
 *           default: 12
 *         description: Number of products per page.
 *       - name: location
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *           enum: [mebliBalta, mebliPodilsk, mebliPervomaisk, mebliOdesa1, mebliVozнесensk]
 *           default: mebliPervomaisk
 *         description: Location (storage) for filtering products.
 *       - name: sortField
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *         description: Field by which to sort products.
 *       - name: sortOrder
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Order of sorting (ascending or descending).
 *     responses:
 *       200:
 *         description: Products for the category and its subcategories
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CategoryWithProducts'
 *       400:
 *         description: Invalid parameters
 *       404:
 *         description: Category not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/category/{categoryId}/{subcategoryId}/products:
 *   get:
 *     tags:
 *       - Category
 *     summary: Retrieve products for a specific subcategory
 *     description: Fetches products only for a specific subcategory.
 *     parameters:
 *       - name: categoryId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the parent category.
 *       - name: subcategoryId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the subcategory.
 *       - name: page
 *         in: query
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination.
 *       - name: limit
 *         in: query
 *         required: false
 *         schema:
 *           type: integer
 *           default: 12
 *         description: Number of products per page.
 *       - name: location
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *           enum: [mebliBalta, mebliPodilsk, mebliPervomaisk, mebliOdesa1, mebliVozнесensk]
 *           default: mebliPervomaisk
 *         description: Location (storage) for filtering products.
 *       - name: sortField
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *         description: Field by which to sort products.
 *       - name: sortOrder
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Order of sorting (ascending or descending).
 *     responses:
 *       200:
 *         description: Products for the subcategory
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CategoryWithProducts'
 *       400:
 *         description: Invalid parameters
 *       404:
 *         description: Subcategory not found
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
 *           description: Unique identifier for the category.
 *         name:
 *           type: string
 *           description: Name of the category.
 *         parentId:
 *           type: integer
 *           nullable: true
 *           description: ID of the parent category, if any.
 *         subcategories:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Category'
 *     Product:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Unique identifier for the product.
 *         name:
 *           type: string
 *           description: Name of the product.
 *         RetailPrice:
 *           type: number
 *           description: Price of the product.
 *         description:
 *           type: string
 *           description: Short description of the product.
 *     CategoryWithProducts:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: Unique identifier for the category.
 *         name:
 *           type: string
 *           description: Name of the category.
 *         parent:
 *           type: object
 *           nullable: true
 *           properties:
 *             id:
 *               type: integer
 *               description: ID of the parent category.
 *             name:
 *               type: string
 *               description: Name of the parent category.
 *         products:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Product'
 *         totalProducts:
 *           type: integer
 *           description: Total number of products.
 *         totalPages:
 *           type: integer
 *           description: Total number of pages.
 *         currentPage:
 *           type: integer
 *           description: Current page number.
 */
