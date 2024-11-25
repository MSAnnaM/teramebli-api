import app from './app.js'
import cron from 'node-cron'
import conectMongo from './db/connectMongo.js'
// import { updateDB } from './services/ftpService.js'
const { PORT } = process.env

const startServer = async () => {
	try {
		await conectMongo()
		app.listen(PORT, () => {
			console.log(`Server is running. Use our API on port: ${PORT}`)
		})

		// cron.schedule('*/1 * * * *', async () => { // "0 * * * *" виконує щогодини на початку години
		//   try {
		//     console.log("Cron job started: Fetching files from FTP...");
		//     await updateDB();
		//     console.log("FTP files processed successfully.");
		//   } catch (error) {
		//     console.error("Error during FTP processing:", error);
		//   }
		// });
	} catch (er) {
		console.log(er)
	}
}
startServer()
