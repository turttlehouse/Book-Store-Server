const multer = require('multer');

const ONE_MB = 1024 * 1024;

const storage = multer.diskStorage({
    destination : function(req,file,cb){
        // console.log(file);
        // const allowedFileTypes = ['image/jpeg','image/png','image/jpg']
        // if(!allowedFileTypes.includes(file.mimetype)){
        //     cb(new Error('File type not allowed'))
        //     return;
        // }
        // const FileSize = req.file.size;
        // const allowedFileSize = 1 * ONE_MB;
        // if(FileSize> allowedFileSize){
        //     cb(new Error('File size must be less than 25mb'))
        //     return;
        // }
        cb(null,'./storage') //cb->(error,success)
    },
    filename : function(req,file,cb){
        cb(null,Date.now() + file.originalname)
    }
});

module.exports = {
    storage,
    multer
}