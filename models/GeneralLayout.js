const mongoose = require("mongoose");
const { multiLangString, img } = require("../utils/tools");

const GeneralLayoutSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
  },
  music_toggle_icn: img("/uploads/pages/general/default/soundIcn.svg"),
  music_toggle_text: {
    on: multiLangString(
      "Введите текст на кнопке вкл. музыки",
      "Звук вкл",
      "Tovush yon"
    ),
    off: multiLangString(
      "Введите текст на кнопке выкл. музыки",
      "Звук выкл",
      "Tovush o`ch"
    ),
  },
  phone: {
    type: String,
    default: "(71) 200 - 30 - 30",
    required: [true, "Введите телефон!"],
  },
  phone_icn: img("/uploads/pages/general/default/phone.svg"),
  lang_switch: multiLangString(
    "Введите текст на переключателях языка!",
    "Ру",
    "Uz"
  ),
  checkout_icn: img("/uploads/pages/general/default/checkoutIcon.svg"),
  checkout_text: multiLangString(
    "Введите надпись на кнопке корзина!",
    "Корзина",
    "Savat"
  ),
  copy: multiLangString(
    "Введите копирайт текст!",
    "Сайт разработан маркетинговым агенством Division",
    "Uzb copyright"
  ),
});

const GeneralLayout = mongoose.model("Generallayout", GeneralLayoutSchema);

module.exports = GeneralLayout;
