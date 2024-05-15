const multer = require("multer");
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, 'public/uploads');
    },
    filename: function (req, file, callback) {
        callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    limits: {
        fileSize: 100 * 1024 * 1024, // 100 MB upload limit
        // files: 1                    // 1 file
    },
    fileFilter: (req, file, cb) => {
        console.log(file.originalname)
        // if the file extension is in our accepted list
        if (mimeTypes.allowed_image_mimes.some(ext => file.originalname.endsWith("." + ext))) {
            return cb(null, true);
        }
        if (mimeTypes.allowed_audio_mimes.some(ext => file.originalname.endsWith("." + ext))) {
            return cb(null, true);
        }
        if (mimeTypes.allowed_video_mimes.some(ext => file.originalname.endsWith("." + ext))) {
            return cb(null, true);
        }
        // otherwise, return error
        return cb(new Error('file not allowed'));
    },
    storage: storage
});

const mimeTypes = {
    'allowed_image_mimes': ['jpeg', 'png', 'jpg', 'svg'],
    // 'allowed_image_mimes': ['jpeg', 'png', 'bmp', 'jpg', 'html', "pdf", 'docx', 'doc', 'svg'],
    'allowed_audio_mimes': ['mp3', 'ogg', 'wav'],
    'allowed_video_mimes': ['3gp', 'mp4', 'mpeg', 'avi', 'mov', 'wmv', 'mkv', 'flv', 'vob', 'rm', 'rmbv', 'm4p', 'flv', 'f4v', 'f4p', 'f4a', 'f4b', 'ogg', 'qt'],
    // 'allowed_video_image_mimes': 'jpeg,png,bmp,jpg,gif,svg,3gp,mp4,mpeg,avi,mov,wmv,mkv,flv,vob,rm,rmbv,m4p,flv,f4v,f4p,f4a,f4b,ogg,qt',
};
class FileUpload {

    constructor() {
        this.files = this.files.bind(this);
    }
    files(filesArray) {
        try {
            let files = filesArray.map(file => {
                return {
                    name: file,
                    // maxCount: 1
                }
            });

            const uploadable = upload.fields(files)
            return (req, res, next) => {
                uploadable(req, res, function (err) {
                    console.log(err)
                    req.uploadError = err
                    next()
                })
            };
        } catch (e) {
            console.log(e)
            return e
        }
    }


    arrayUpload(name) {
        return upload.array(name);
    }



}


module.exports = new FileUpload();