import app from "./app.js";
import conectMongo from "./db/connectMongo.js";
const { PORT } = process.env;

const startServer = async () => {
  try {
    await conectMongo();
    app.listen(PORT, () => {
      console.log(`Server is running. Use our API on port: ${PORT}`);
    });
  } catch (er) {
    console.log(er);
  }
};
startServer();