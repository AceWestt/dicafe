const mongoose = require("mongoose");

const MainScreenSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
    select: false,
  },
  sattelite: {
    type: String,
    required: [true, "Загрузите изображение спутника"],
    default: "/uploads/pages/main/default/default-satellite-img.gif",
  },
  lamp: {
    type: String,
    required: [true, "Загрузите изображение лампы"],
    default: "/uploads/pages/main/default/default-lamp-img.svg",
  },
  cloud_big: {
    type: String,
    required: [true, "Загрузите изображение облака 1"],
    default: "/uploads/pages/main/default/default-cloud_big-img.svg",
  },
  cloud_small: {
    type: String,
    required: [true, "Загрузите изображение облака 2"],
    default: "/uploads/pages/main/default/default-cloud_small-img.svg",
  },
  flower: {
    type: String,
    required: [true, "Загрузите изображение цветка"],
    default: "/uploads/pages/main/default/default-flower-img.gif",
  },
  seamonster: {
    type: String,
    required: [true, "Загрузите изображение осминога и рыбака"],
    default: "/uploads/pages/main/default/seamonster.gif",
  },
  houses: {
    type: String,
    required: [true, "Загрузите изображение домиков"],
    default: "/uploads/pages/main/default/houses.gif",
  },
  snicker: {
    type: String,
    required: [true, "Загрузите изображение кросовка"],
    default: "/uploads/pages/main/default/snicker.gif",
  },
});

const MainScreen = mongoose.model("MainScreen", MainScreenSchema);

module.exports = MainScreen;
