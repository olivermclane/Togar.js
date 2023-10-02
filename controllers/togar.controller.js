require('../config/multer.config')
const {upload} = require("../config/multer.config");
const multer = require('multer');
const fs = require('fs');
const path = require('path');


const togarView = (req, res) => {
    const userUploadsPath = path.join(__dirname, `../uploads/${req.user.id}`);

    // Read files from the user's uploads directory
    fs.readdir(userUploadsPath, (err, files) => {
        if (err) {
            console.error('Error reading files:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        // Create an array of image URLs
        const imageUrls = files.map(file => `/uploads/${req.user.id}/${file}`);

        // Render your view (assuming you're using a templating engine like EJS)
        res.render('togar', { user: req.user, images: imageUrls });
    });
};

const togarUploadImage = (req, res) => {
    console.log(req.file);
    upload.single('imageFile')(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            // Handle Multer errors (e.g., file size limit exceeded)
            return res.status(400).json({ message: 'Multer Error: ' + err.message });
        } else if (err) {
            // Handle other errors
            return res.status(500).json({ message: 'Internal Server Error' + err.message});
        }

        // File uploaded successfully, req.file contains the file details
        console.log("test"+ req.file);
        res.redirect("/togar");
    });
};

module.exports = {
    togarView,
    togarUploadImage
}