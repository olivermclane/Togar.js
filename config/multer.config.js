// Import necessary modules for file uploading functionality.
const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Configure multer to store uploaded files on disk with specific naming and destination logic.
const storage = multer.diskStorage({
    // Specify the destination directory where uploaded files will be stored.
    destination: function (req, file, cb) {
        const userId = req.user.id;
        const uploadDir = './uploads/' + userId + '/';

        // Check if the directory exists, create it if not.
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, {
                recursive: true
            });
        }
        cb(null, uploadDir); // Callback with the destination directory.
    },
    // Specify the filename for the uploaded file (keep the original filename).
    filename: function (req, file, cb) {
        cb(null, file.originalname); // Callback with the original filename.
    }
});

// Create a multer instance with the specified storage configuration.
const upload = multer({
    storage: storage
});

// Export the configured multer instance for use in other parts of the application.
module.exports = {
    upload
};
