const path = require("path");
const util = require("util");
const fs = require("fs");
const { FILES_FOLDER, FILES_SUBFOLDER } = require("../common/constants");

const addPicture = async (file) => {
  const mimeType = file.mimetype.split("/")[1];
  const fileBuffer = file.data;
  const folderPath = path.resolve(__dirname, `../${FILES_FOLDER}`);
  const subFolderPath = path.resolve(folderPath, FILES_SUBFOLDER);

  const fileName = Date.now() + "-" + file.originalname;
  const filePath = path.resolve(subFolderPath, fileName);

  await util.promisify(fs.mkdir)(subFolderPath, { recursive: true });
  await util.promisify(fs.writeFile)(filePath, fileBuffer);

  return fileName;
};

const addPictures = async (files) => {
  const fileNames = [];
  for (const file of files) {
    const fileName = await addPicture(file);
    fileNames.push(fileName);
  }
  return fileNames;
};

module.exports = { addPicture, addPictures };
