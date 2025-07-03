const multer=require('multer');

const storage=multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './storage'); // Specify the directory to save uploaded files
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname); // Use current timestamp and original name for uniqueness
    }
}) 

module.exports={
    multer,
    storage
}