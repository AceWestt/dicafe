const AboutScreen = require("../models/AboutScreen");
const ErrorResponse = require("../utils/errorResponse");
const fs = require("fs/promises");
const crypto = require("crypto");

exports.aboutscreen = async (req, res, next) => {
  try {
    let screen = await AboutScreen.findOne({ id: 777 });
    if (!screen) {
      screen = await new AboutScreen({ id: 777 });
      await screen.save((err) => {
        if (err)
          return next(
            new ErrorResponse("Could not create aboutscreen assets", 500)
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

    const screen = await AboutScreen.findById(id);
    screen.title = JSON.parse(body.title);
    screen.back_button = JSON.parse(body.back_button);
    screen.point_one.title = JSON.parse(body.point_one_text).title;
    screen.point_one.text = JSON.parse(body.point_one_text).text;
    screen.point_two.title = JSON.parse(body.point_two_text).title;
    screen.point_two.text = JSON.parse(body.point_two_text).text;
    screen.point_three.title = JSON.parse(body.point_three_text).title;
    screen.point_three.text = JSON.parse(body.point_three_text).text;

    const uploadpath = "/uploads/pages/about/";

    if (files?.big_owl) {
      screen.big_owl = await fileUpload(
        files.big_owl,
        screen.big_owl,
        "/uploads/pages/about/default/owl-adult.png",
        next,
        "big-owl_img",
        uploadpath
      );
    }

    if (files?.small_owl) {
      screen.small_owl = await fileUpload(
        files.small_owl,
        screen.small_owl,
        "/uploads/pages/about/default/owl-child.png",
        next,
        "small-owl_img",
        uploadpath
      );
    }

    if (files?.point_one_img) {
      screen.point_one.img = await fileUpload(
        files.point_one_img,
        screen.point_one.img,
        "/uploads/pages/about/default/point-fast-delivery.png",
        next,
        "point-one_img",
        uploadpath
      );
    }

    if (files?.point_two_img) {
      screen.point_two.img = await fileUpload(
        files.point_two_img,
        screen.point_two.img,
        "/uploads/pages/about/default/point-tasty-cofee.png",
        next,
        "point-two_img",
        uploadpath
      );
    }

    if (files?.point_three_img) {
      screen.point_three.img = await fileUpload(
        files.point_three_img,
        screen.point_three.img,
        "/uploads/pages/about/default/point-good-price.png",
        next,
        "point-three_img",
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

  return `${movePath}${file_name}`;
};

const ifFileExists = async (path) => {
  try {
    await fs.access(path);
    return true;
  } catch (error) {
    return false;
  }
};
