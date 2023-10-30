// Import necessary modules and dependencies
const { upload} = require("../config/multer.config");
const multer = require('multer');
const fs = require('fs'); // Node.js file system module for file operations
const path = require('path');
const sharp = require("sharp");
const database = require("../models"); // Node.js path module for working with file paths
const userImages = database.userimage;
const logger = require("../config/logger");


/**
 * @api {get} /togar Loads togar page for user
 * @apiName ViewImage
 * @apiGroup Image Handling
 *
 * @apiParam sessionid A session ID created using our special key word.
 *
 * @apiError error Internal sever error occured or invalid file type.
 * @apiErrorExample {html}
 *     HTTP/1.1 401 Not Found
 *     {
 *         "error": "Issue reading files or internal server error"
 *     }
 *
 *
 * @apiSuccess user The user we are currently viewing images of.
 * @apiSuccess images The base64 version of the images in list format.
 * @apiSuccessExample {html}
 *      HTTP/1.1 200 OK
 *      {
 *          "user": username
 *          "images": base64images
 *      }
 */
const togarView = (req, res) => {
    const userUploadsPath =  path.join(process.env.IMAGE_DIRECTORY, String(req.user.id));

    // Read files from the user's uploads directory
    fs.readdir(userUploadsPath, (err, files) => {
        if (err) {
            console.error('Error reading files:', err);
            return res.status(401).json({ error: 'Internal Server Error' });
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

        res.status(200).redirect("/togar");
    } catch (error) {
        console.error(error);
        res.status(401).json({ error: 'Internal server error' });
    }
};

/**
 * @api {post} /togar/upload Request for uploading user image
 * @apiName UploadImage
 * @apiGroup Image Handling
 *
 * @apiParam file The file of the image you intend to upload to filesystem.
 * @apiParam username The username for the user the image belongs to.
 */
const togarUploadImageHandler = (req, res) => {
    upload.single('imageFile')(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            // Handle Multer errors (e.g., file size limit exceeded)
            return res.status(400).render("togar",{ message: 'Multer Error: ' + err.message });
        } else if (err) {
            // Handle other errors
            return res.status(500).render("togar",{ message: 'Internal Server Error' + err.message });
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