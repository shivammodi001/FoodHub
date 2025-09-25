const cloudinary = require('cloudinary').v2;
const fs = require('fs');

const uploadOnCloudinary = async (file) => {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    });

    try {
        const result = await cloudinary.uploader.upload(file);
        // delete from local folder after uploading the image
        fs.unlinkSync(file);
        return result.secure_url;
    } catch (err) {
        // delete local file even if upload fails
        try {
            fs.unlinkSync(file);
        } catch (e) {
            console.log("Error deleting file:", e);
        }
        console.log(err);
    }
};

module.exports = uploadOnCloudinary;
