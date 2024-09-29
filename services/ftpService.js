import ftp from "basic-ftp";
import path from 'path';
import fs from 'fs';
import dotenv from "dotenv";
dotenv.config();
const { FTP_HOST, FTP_PORT, FTP_USERNAME, FTP_PASSWORD } = process.env;


export const getFiles = async (remotePath, offerId, res) => {
    const client = new ftp.Client();
    // client.ftp.verbose = true; 
    try {


        
        await client.access({
            host: FTP_HOST,
            port: FTP_PORT || 21, 
            user: FTP_USERNAME,
            password: FTP_PASSWORD,
            secure: false 
        });

        console.log('Connected to FTP server.');

    

        const fileList = await client.list(remotePath);
       

        const productPhoto = fileList.filter(file => file.name.includes(offerId));
        console.log(`Found ${productPhoto.length} files matching ${offerId}`);


    
const tempDir = path.resolve("tmp");
        const fileBuffers = [];

        for (const photo of productPhoto) {
            const sanitizedFileName = photo.name.replace(/[\\/:*?"<>|]/g, '');
            console.log(sanitizedFileName);
            
      const tempFilePath = path.join(tempDir, sanitizedFileName);

      
      await client.downloadTo(tempFilePath, path.join(remotePath, sanitizedFileName));

      
      const fileBuffer = fs.readFileSync(tempFilePath);

      
      fileBuffers.push({
        name: photo.name,
        buffer: fileBuffer.toString('base64')  
      });
        
        console.log(fileBuffer);
        

      
        fs.unlinkSync(tempFilePath);
        // return fileBuffers
    }

        
        console.log(fileBuffers);
    

        
        await client.close();
        return { files: fileBuffers };
        
    } catch (er) {
        console.error('Error retrieving files via FTP:', er);
        throw er;
    }
};