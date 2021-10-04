const MainScreen = require("../models/MainScreen");
const ErrorResponse = require("../utils/errorResponse");
const fs = require("fs/promises");
const crypto = require("crypto");

exports.mainscreen = async (req, res, next) => {
  try {
    let mainscreen = await MainScreen.findOne({ id: 777 });
    if (!mainscreen) {
      mainscreen = await new MainScreen({ id: 777 });
      await mainscreen.save((err) => {
        if (err)
          return next(
            new ErrorResponse("Could not create mainscreen assets", 500)
          );
      });
    }
    res.status(200).json({ data: mainscreen });
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const id = req.params.id;
    const files = req.files;

    const mainscreen = await MainScreen.findById(id);

    const uploadpath = "/uploads/pages/main/";

    if (files?.sattelite) {
      mainscreen.sattelite = await fileUpload(
        files?.sattelite,
        mainscreen.sattelite,
        "/uploads/pages/main/default/default-satellite-img.gif",
        next,
        "satellite_img",
        uploadpath
      );
    }

    if (files?.lamp) {
      mainscreen.lamp = await fileUpload(
        files.lamp,
        mainscreen.lamp,
        "/uploads/pages/main/default/default-lamp-img.svg",
        next,
        "lamp_img",
        uploadpath
      );
    }

    if (files?.cloud_big) {
      mainscreen.cloud_big = await fileUpload(
        files.cloud_big,
        mainscreen.cloud_big,
        "/uploads/pages/main/default/default-cloud_big-img.svg",
        next,
        "cloud-big_img",
        uploadpath
      );
    }

    if (files?.cloud_small) {
      mainscreen.cloud_small = await fileUpload(
        files.cloud_small,
        mainscreen.cloud_small,
        "/uploads/pages/main/default/default-cloud_small-img.svg",
        next,
        "cloud-small_img",
        uploadpath
      );
    }

    if (files?.flower) {
      mainscreen.flower = await fileUpload(
        files.flower,
        mainscreen.flower,
        "/uploads/pages/main/default/default-flower-img.gif",
        next,
        "flower_img",
        uploadpath
      );
    }

    if (files?.seamonster) {
      mainscreen.seamonster = await fileUpload(
        files.seamonster,
        mainscreen.seamonster,
        "/uploads/pages/main/default/seamonster.gif",
        next,
        "seamonster_img",
        uploadpath
      );
    }

    if (files?.houses) {
      mainscreen.houses = await fileUpload(
        files.houses,
        mainscreen.houses,
        "/uploads/pages/main/default/houses.gif",
        next,
        "houses_img",
        uploadpath
      );
    }

    if (files?.snicker) {
      mainscreen.snicker = await fileUpload(
        files.snicker,
        mainscreen.snicker,
        "/uploads/pages/main/default/snicker.gif",
        next,
        "snicker_img",
        uploadpath
      );
    }

    await mainscreen.save((err) => {
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
