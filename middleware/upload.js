//Imports node.js file system
const fs = require('fs');
//Imports path
const path = require('path');
//Imports middleware for handling multipart data-form in node.js
const multer = require('multer');

//Photos are saved inside public/ so Express can serve them
const UPLOAD_DIR = path.join(__dirname, '..', 'public', 'houses');
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

//The only types we accept, and the file ending we give each one
const EXTENSION = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/webp': '.webp'
};

//Max file size, 2MB
const MAX_SIZE = 2 * 1024 * 1024; 

//Defines the multer diskstorage configuration 
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, UPLOAD_DIR),
    filename: (req, file, cb) => {
        const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, unique + EXTENSION[file.mimetype]);
    }
});

//Ensures file is an accepted file type
function fileFilter(req, file, cb){
    if(EXTENSION[file.mimetype]){
        return cb(null, true);
    }
    cb(new Error('The photo must be a JPG, PNG or WebP image.'));
}

//Defines the upload
const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: MAX_SIZE }
});

//Runs the upload, but never fails the request.
    // If something is wrong the message is saved on req.uploadError for the controller to show
function uploadImage(req, res, next){
    upload.single('imageName')(req, res, (err) => {
        if(err && err.code === 'LIMIT_FILE_SIZE'){
            req.uploadError = 'The photo must be 2MB or smaller.';
        } else if (err){
            req.uploadError = err.message;
        }
        next();
    });
}

//True only for a name created by this middleware (13 digits, a dash, more digits, then .jpg .png or .webp)
function isUploadedName(filename){
    return typeof filename === 'string' && /^\d{13}-\d+\.(jpg|png|webp)$/.test(filename);
}

module.exports = {uploadImage, UPLOAD_DIR, isUploadedName };