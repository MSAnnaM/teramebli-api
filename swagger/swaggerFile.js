/**
 * @swagger
 * tags:
 *   name: Database
 *   description: API for managing products
 */
/**
 * @swagger
 * /api/file/create:
 *   post:
 *     summary: Upload a new file to create categories and products
 *     description: Accepts an XML file, reads it, and creates new categories and products in the database.
 *     tags:
 *       - Database
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - name: file
 *         in: formData
 *         description: XML file containing data to create categories and products
 *         required: true
 *         type: file
 *     responses:
 *       200:
 *         description: File successfully uploaded and processed
 *       400:
 *         description: Error reading or parsing the file
 *       500:
 *         description: Internal server error
 */
/**
 * @swagger
 * /api/file/update:
 *   patch:
 *     summary: Upload a new file to update categories and products
 *     description: Accepts an XML file, reads it, and updates existing categories and products in the database. Adds new categories and products if they do not exist.
 *     tags:
 *       - Database
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - name: file
 *         in: formData
 *         description: XML file containing data to update categories and products
 *         required: true
 *         type: file
 *     responses:
 *       200:
 *         description: Data successfully updated
 *       400:
 *         description: Error reading or parsing the file
 *       500:
 *         description: Internal server error
 */
