// Import necessary modules and dependencies
const { upload} = require("../config/multer.config");
const multer = require('multer');
const fs = require('fs'); // Node.js file system module for file operations
const path = require('path');
const sharp = require("sharp");
const database = require("../models"); // Node.js path module for working with file paths

const togarUploadImage = upload.single('imageFile');
const userImages = database.userimage;


//Function for GET method to display images for a user, converts images to base64 and passes them to the frontend UI.
const togarView = (req, res) => {
    const userUploadsPath =  path.join(process.env.IMAGE_DIRECTORY, String(req.user.id));

    // Read files from the user's uploads directory
    fs.readdir(userUploadsPath, (err, files) => {
        if (err) {
            console.error('Error reading files:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        // Array to store base64-encoded images
        const base64Images = [];

        // Read each image file as a buffer, convert to base64, and push to base64Images array
        files.forEach(file => {
            const imagePath = path.join(userUploadsPath, file);
            const imageBuffer = fs.readFileSync(imagePath);
            const base64Image = imageBuffer.toString('base64');
            const imageType = path.extname(file).slice(1);
            const base64ImageUrl = `data:image/${imageType};base64,${base64Image}`;
            base64Images.push(base64ImageUrl);
        });

        // Render your view with base64-encoded images
        res.render('togar', { user: req.user, images: base64Images });
    });
};

//Function for POST Method to handle an upload from a user. Using multer the images are saved to a local directory.
const processImage = async (req, res) => {
    try {
        const imagePath = path.join(process.env.IMAGE_DIRECTORY, String(req.user.id), req.file.originalname);
        const metadata = await sharp(imagePath).metadata();

        const userimage = {
            image_name: req.file.originalname,
            extension: path.extname(req.file.originalname),
            location: path.join(process.env.IMAGE_DIRECTORY, String(req.user.id), "/"),
            image_size: req.file.size,
            width: metadata.width,
            height: metadata.height,
            login_id: req.user.id,
        };

        // Create database entry
        await userImages.create(userimage);

        // Clean up: Delete the temporary uploaded image
        try {
            await fsPromises.unlink(imagePath); // Use fsPromises.unlink for asynchronous file deletion
        } catch (error) {
            console.error('Error deleting file:', error);
        }

        res.redirect("/togar");
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


const togarUploadImageHandler = (req, res) => {
    upload.single('imageFile')(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            // Handle Multer errors (e.g., file size limit exceeded)
            return res.status(400).json({ message: 'Multer Error: ' + err.message });
        } else if (err) {
            // Handle other errors
            return res.status(500).json({ message: 'Internal Server Error' + err.message });
        }

        // Process the image
        processImage(req, res);
    });
};


// Export functions for use in other parts of the application
module.exports = {
    togarView,
    togarUploadImageHandler
}