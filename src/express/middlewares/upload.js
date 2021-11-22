'use strict';

const multer = require(`multer`);
const path = require(`path`);

const {FILE_EXTENSIONS, UPLOAD_DIR} = require(`../../constants`);

const fileStorage = multer.diskStorage({
  destination: path.resolve(__dirname, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + `-` + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);

    cb(null, `${uniqueName}${extension}`);
  }
});

const fileFilter = (req, file, cb) => {
  const extension = path.extname(file.originalname);

  cb(null, FILE_EXTENSIONS.includes(extension));
};

const upload = multer({storage: fileStorage, fileFilter});

module.exports = upload;
