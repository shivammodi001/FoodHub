const multer = require("multer");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./public"); // folder ka naam aapke style me
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname); // same filename rakh diya
    }
});

const upload = multer({ storage });

module.exports = {upload};
