import multer from 'multer';
import pkg from 'cloudinary';
const { v2: cloudinary } = pkg;
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import dotenv from 'dotenv';
dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        allowed_formats: ['jpg', 'png', 'jpeg', 'pdf'], 
    },
});

const upload = multer({ storage: storage });



export default async(req, res) =>{
    try {
            // Use multer middleware to handle file upload
    upload.single('file')(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            // Handle Multer-specific errors
            return res.status(500).json({ error: err.message });
        } else if (err) {
            // Handle other errors
            return res.status(500).json({ error: err.message });
        }

        // Check if a file was uploaded
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        // File has been uploaded to Cloudinary
        return res.json({
            message: 'File uploaded successfully',
            url: req.file.path,
            public_id: req.file.filename
        });
    });
    } catch (error) {
        return res.status(500).json({error : `Internal Server Error`})
    } 
}