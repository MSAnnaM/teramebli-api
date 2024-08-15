import mongoose from "mongoose";
const { MONGO_URL } = process.env;
const conectMongo = async () => {
    try {
        await mongoose.connect(MONGO_URL);
        console.log("Database connection successful");
        
    } catch (er) {
        console.log(er);
        process.exit(1);
    }
}
export default conectMongo;