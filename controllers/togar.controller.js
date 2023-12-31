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
 *     HTTP/1.1 400 Bad Request
 *     {
 *         "error": "Issue reading files or internal server error"
 *     }
 *     HTTP/1.1 429 Too Many Requests
 *     {
 *         "error": "Users has passed 100 req limit"
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

    const userUploadsPath =  path.join(process.env.IMAGE_DIRECTORY, String(req.user.login_id));
    // Read files from the user's uploads directory
    fs.readdir(userUploadsPath, (err, files) => {
        if(!files){
            logger.debug('User has no images', req.user.username);
            return res.status(200).render('togar', { user: req.user, images: [] });
        }
        if (err) {
            logger.error('Error reading/uploading files:', err);
            return res.status(400).render('togar', { user: req.user, images: [] });
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
        res.status(200).render('togar', { user: req.user, images: base64Images });
    });
};

//Function for POST Method to handle an upload from a user. Using multer the images are saved to a local directory.
const processImage = async (req, res) => {
    if (!req.file) {
        return res.status(400).redirect('/togar');
    }
    // Define a list of allowed image extensions
    const allowedExtensions = ['.jpg', '.jpeg', '.png'];

    // Get the file extension
    const fileExtension = path.extname(req.file.originalname).toLowerCase();

    // Check if the file extension is in the allowed list
    if (!allowedExtensions.includes(fileExtension)) {
        // Log and handle the error for invalid file types
        logger.info("User uploaded an invalid file type: " + fileExtension);
        return res.status(415).redirect("/togar");
    }

    try {
        // Process and save the image
        const imagePath = path.join(process.env.IMAGE_DIRECTORY, String(req.user.login_id), req.file.originalname);
        const metadata = await sharp(imagePath).metadata();
        const userimage = {
            image_name: req.file.originalname,
            extension: fileExtension,
            location: path.join(process.env.IMAGE_DIRECTORY, String(req.user.login_id), "/"),
            image_size: req.file.size,
            width: metadata.width,
            height: metadata.height,
            login_id: req.user.login_id,
        };

        // Create database entry
        await userImages.create(userimage);

        return res.status(302).redirect("/togar");
    } catch (error) {
        logger.info("Error processing the image: " + error);
        return res.status(415).redirect("/togar");
    }
};

/**
 * @api {post} /togar/upload Request for uploading user image
 * @apiName UploadImage
 * @apiGroup Image Handling
 *
 * @apiParam file The file of the image you intend to upload to filesystem.
 * @apiParam username The username for the user the image belongs to.
 *
 * @apiSuccessExample {html}
 *      HTTP/1.1 302 OK
 *      {
 *          "user": username
 *          "images": base64images
 *      }
 *
 * @apiErrorExample {html}
 *      HTTP/1.1 429 Too Many Requests
 *     {
 *         "error": "Users has passed 100 req limit"
 *     }
 *     HTTP/1.1 400 Bad Request
 *     {
 *         "error": "Internal Service - Multer Error"
 *     }
 *     HTTP/1.1 415 Unsupported Media Type
 *     {
 *         "error": "User has uploaded a invalid media type"
 *     }
 *    HTTP/1.1 500 Internal Server Error
 *     {
 *         "error": "Users has passed 100 req limit"
 *     }
 */
const togarUploadImageHandler = (req, res) => {
    // Process the image after the Multer middleware has finished handling the file


    upload.single('imageFile')(req, res, async function (err) {
        if (err instanceof multer.MulterError) {
            // Handle Multer errors (e.g., file size limit exceeded)
            logger.error("Issue uploading file: " + err.message)
            return res.status(400).redirect("/togar");
        } else if (err) {
            // Handle other errors
            return res.status(415).redirect("/togar");
        }

        // Process the image after the file upload is complete
        await processImage(req, res);
    });
};



// Export functions for use in other parts of the application
module.exports = {
    togarView,
    togarUploadImageHandler
}