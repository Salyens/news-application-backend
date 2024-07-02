const multer = require("multer");
const { FILE_WHITE_LIST } = require("../../common/constants");

/**
 * Multer storage configuration.
 * @type {Object}
 */
const storage = multer.diskStorage({
  /**
   * Sets the destination folder for uploaded files.
   * @param {Object} req - The request object.
   * @param {Object} file - The file object.
   * @param {Function} cb - The callback function.
   */
  destination: (req, file, cb) => {
    cb(null, "public/uploads");
  },
  
  /**
   * Sets the filename for uploaded files.
   * @param {Object} req - The request object.
   * @param {Object} file - The file object.
   * @param {Function} cb - The callback function.
   */
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

/**
 * Multer upload configuration.
 * @type {Object}
 */
const upload = multer({
  storage,
  
  /**
   * File filter to validate file types.
   * @param {Object} req - The request object.
   * @param {Object} file - The file object.
   * @param {Function} cb - The callback function.
   */
  fileFilter: (req, file, cb) => {
    if (FILE_WHITE_LIST.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'), false);
    }
  },
  
  /**
   * Limits the size of uploaded files.
   * @type {Object}
   */
  limits: { fileSize: 1024 * 1024 * 5 } // 5MB
});

module.exports = upload;
