import multer from "multer";
// import crypto from "crypto"
// import path from "path";




//Secure unique filename generator
// const generateFileName = (file: Express.Multer.File)=> {
//     const ext = path.extname(file.originalname)
//     const randomName = crypto.randomBytes(16).toString("hex")
//     return `${randomName}${ext}` //eg//4ff9a20beef9017bcaa0ef6e9f3a9ac7.png


// };
// const allowedMimeTypes = [
//   "image/jpeg",
//   "image/png",
//   "image/webp",
//   "image/jpg",
// ];

// const fileFilter = (
//   _req: Express.Request,
//   file: Express.Multer.File,
//   cb: multer.FileFilterCallback
// ) => {
//   if (allowedMimeTypes.includes(file.mimetype)) {
//     cb(null, true);
//   } else {
//     cb(new Error(" Invalid file type. Only images are allowed."));
//   }
// };




const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/temp')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix)
  }
})


export const upload = multer({
    storage,
    // fileFilter,
 
  })



















































