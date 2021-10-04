const OrderScreen = require("../models/OrderScreen");
const ErrorResponse = require("../utils/errorResponse");
const fs = require("fs/promises");
const crypto = require("crypto");

exports.orderscreen = async (req, res, next) => {
  try {
    let screen = await OrderScreen.findOne({ id: 777 });
    if (!screen) {
      screen = await new OrderScreen({ id: 777 });
      await screen.save((err) => {
        if (err)
          return next(
            new ErrorResponse("Could not create doodlescreen assets", 500)
          );
      });
    }
    res.status(200).json({ data: screen });
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const id = req.params.id;
    const body = req.body;
    const files = req.files;

    const screen = await OrderScreen.findById(id);
    screen.title = JSON.parse(body.title);
    screen.back_button = JSON.parse(body.back_button);

    const uploadpath = "/uploads/pages/order/";

    if (files?.crown) {
      screen.crown = await fileUpload(
        files.crown,
        screen.crown,
        "/uploads/pages/order/default/corona.svg",
        next,
        "crown_img",
        uploadpath
      );
    }

    if (files?.skater) {
      screen.skater = await fileUpload(
        files.skater,
        screen.skater,
        "/uploads/pages/order/default/skater.gif",
        next,
        "skater_img",
        uploadpath
      );
    }

    await screen.save((err) => {
      if (err) {
        return next(new ErrorResponse("something went wrong on save"));
      }
    });

    res.status(200).json({ status: "success" });
  } catch (error) {
    next(error);
  }
};

const fileUpload = async (
  file,
  currentFile,
  defaultFile,
  next,
  mainName,
  movePath
) => {
  const new_img = file;
  const old_img = currentFile;
  if (old_img !== defaultFile) {
    try {
      if (await ifFileExists(`${__clientdir}${old_img}`)) {
        fs.unlink(`${__clientdir}${old_img}`);
      }
    } catch (error) {
      return next(new ErrorResponse("internal error", 500));
    }
  }
  let ext = new_img.name.split(".");
  ext = ext[ext.length - 1];
  const file_name = `${crypto
    .randomBytes(10)
    .toString("hex")}-${mainName}-${new Date().getTime().toString()}.${ext}`;
  new_img.mv(`${__clientdir}${movePath}${file_name}`, (err) => {
    if (err) {
      console.error(err);
      return next(new ErrorResponse(err, 500));
    }
  });

  return `${__uploadRoot}${movePath}${file_name}`;
};

const ifFileExists = async (path) => {
  try {
    await fs.access(path);
    return true;
  } catch (error) {
    return false;
  }
};
