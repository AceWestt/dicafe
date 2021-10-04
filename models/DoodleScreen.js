const mongoose = require("mongoose");
const { multiLangString, img } = require("../utils/tools");

const DoodleScreenSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
  },
  title: multiLangString(
    "Введите заголовок экрана!",
    "Ваши дудлы",
    "Sizning doodllaringiz"
  ),
  back_button: multiLangString(
    "Введите надпись на кнопке вернуться!",
    "Вернуться",
    "Orqaga"
  ),
  doodles_img: img("/uploads/pages/doodles/default/doodles-demo.png"),
  doodles_img_mobile: img("/uploads/pages/doodles/default/doodles-mobile.png"),
  upload_button_text: multiLangString(
    "Введите текст кнопки загрузки!",
    "Загрузить свой дудл",
    "O'z doodlingizni yuklang"
  ),
  upload_button_icn: img("/uploads/pages/doodles/default/upload-icon.svg"),
});

const DoodleScreen = mongoose.model("Doodlescreen", DoodleScreenSchema);

module.exports = DoodleScreen;
