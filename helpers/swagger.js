import swaggerJSDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Express API Documentation',
      version: '1.0.0',
    },
    servers: [
      {
        url: 'https://teramebli-api.onrender.com',
      },
    ],
  },
  apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;