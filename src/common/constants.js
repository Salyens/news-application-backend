/**
 * @fileoverview Constants used across the application.
 * Defines the list of allowed file types for uploads and the folder where uploaded files are stored.
 */

/**
 * List of MIME types that are allowed for file uploads.
 * @const {string[]}
 */
const FILE_WHITE_LIST = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "application/pdf",
    "application/msword",
  ];
  
  /**
   * Path to the folder where uploaded files will be stored.
   * @const {string}
   */
  const FILES_FOLDER = "public/uploads";
  
  module.exports = { FILE_WHITE_LIST, FILES_FOLDER };
  