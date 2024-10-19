import ftp from "basic-ftp";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();
const { FTP_HOST, FTP_PORT, FTP_USERNAME, FTP_PASSWORD } = process.env;

export const getFiles = async (remotePath, offerId, res, next) => {
  const client = new ftp.Client();
  client.ftp.verbose = true; 
  try {
    await client.access({
      host: FTP_HOST,
      port: FTP_PORT || 21,
      user: FTP_USERNAME,
      password: FTP_PASSWORD,
           secure: true, 
      secureOptions: {
        rejectUnauthorized: false,
      },
    });

    console.log("Connected to FTP server.");

    const files = await client.list(remotePath);
    console.log(files);
    

    const fileList = files.map((file) => file.name);

    const productPhoto = fileList.filter((file) => {
      const regex = new RegExp(`(^|[^0-9])${offerId}([^0-9]|$)`);
      return regex.test(file);
    });
    console.log(productPhoto);
    

    const tempDir = path.resolve("tmp");
    const fileBuffers = [];

    for (const photo of productPhoto) {
      const sanitizedFileName = photo.replace(/[\\/:*?"<>|]/g, "_");

      const ftpFilePath = path.posix.join(remotePath, photo);

      const tempFilePath = path.join(tempDir, sanitizedFileName);

      await client.downloadTo(tempFilePath, ftpFilePath);

      const fileBuffer = fs.readFileSync(tempFilePath);

      fileBuffers.push({
        name: photo,
        buffer: fileBuffer.toString("base64"),
      });

      fs.unlinkSync(tempFilePath);
    }

    return { files: fileBuffers };
  } catch (er) {
    console.error("Error retrieving files via FTP:", er);
  } finally {
    client.close();
  }
};
