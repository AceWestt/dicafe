const GeneralLayout = require("../models/GeneralLayout");
const ErrorResponse = require("../utils/errorResponse");
const fs = require("fs/promises");
const crypto = require("crypto");

exports.general = async (req, res, next) => {
  try {
    let screen = await GeneralLayout.findOne({ id: 777 });
    if (!screen) {
      screen = await new GeneralLayout({ id: 777 });
      await screen.save((err) => {
        if (err)
          return next(
            new ErrorResponse("Could not create general assets", 500)
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

    const screen = await GeneralLayout.findById(id);

    screen.music_toggle_text = JSON.parse(body.music_toggle_text);
    screen.lang_switch = JSON.parse(body.lang_switch);
    screen.checkout_text = JSON.parse(body.checkout_text);
    screen.copy = JSON.parse(body.copy);
    screen.phone = body.phone;

    const uploadpath = "/uploads/pages/general/";

    if (files?.checkout_icn) {
      screen.checkout_icn = await fileUpload(
        files.checkout_icn,
        screen.checkout_icn,
        "/uploads/pages/general/default/checkoutIcon.svg",
        next,
        "checkout-icn_img",
        uploadpath
      );
    }

    if (files?.music_toggle_icn) {
      screen.music_toggle_icn = await fileUpload(
        files.music_toggle_icn,
        screen.music_toggle_icn,
        "/uploads/pages/general/default/soundIcn.svg",
        next,
        "music-toggle-icn_img",
        uploadpath
      );
    }
    if (files?.phone_icn) {
      screen.phone_icn = await fileUpload(
        files.phone_icn,
        screen.phone_icn,
        "/uploads/pages/general/default/phone.svg",
        next,
        "phone-icn_img",
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
