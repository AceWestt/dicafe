const UserDoodle = require("../models/UserDoodle");
const ErrorResponse = require("../utils/errorResponse");
const fs = require("fs/promises");
const crypto = require("crypto");

exports.create = async (req, res, next) => {
  try {
    const files = req.files;
    const doodleImg = files.doodle;
    const uploadFolder = "/uploads/user/doodles/";

    let ext = doodleImg.name.split(".");
    ext = ext[ext.length - 1];

    const file_name = `${crypto
      .randomBytes(10)
      .toString("hex")}-doodle-${new Date().getTime().toString()}.${ext}`;
    await doodleImg.mv(`${__clientdir}${uploadFolder}${file_name}`, (err) => {
      if (err) {
        console.error(err);
        return next(new ErrorResponse(err, 500));
      }
    });
    const img_name = `${uploadFolder}${file_name}`;

    const doodle = await new UserDoodle({ img: img_name });

    await doodle.save((err) => {
      if (err) {
        return next(new ErrorResponse("something went wrong on save"));
      }
    });

    res.status(200).json({ status: "success" });
  } catch (error) {
    next(error);
  }
};
