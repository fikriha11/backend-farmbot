const path = require("path");
const __parenrdir = path.join(__dirname, "../../../");

const util = require("util");
const multer = require("multer");

const moment = require("moment-timezone");
const jakartaTime = moment.tz(new Date(), "Asia/Jakarta");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __parenrdir + "public/img");
  },
  filename: (req, file, cb) => {
    const dd = jakartaTime.format("DD");
    const mm = jakartaTime.format("MM");
    const yyyy = jakartaTime.format("YYYY");
    today = dd + "-" + mm + "-" + yyyy;
    cb(null, today + ".jpg");
    // cb(null, file.originalname);
  },
});

const uploadFile = multer({ storage: storage }).single("file");
const uploadFileMiddleware = util.promisify(uploadFile);

module.exports = uploadFileMiddleware;
