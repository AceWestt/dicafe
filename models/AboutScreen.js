const mongoose = require("mongoose");
const { multiLangString, img } = require("../utils/tools");

const AboutScreenSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
  },
  title: multiLangString("Введите заголовок экрана!", "О нас", "Biz haqimizda"),
  back_button: multiLangString(
    "Введите надпись на кнопке вернуться!",
    "Вернуться",
    "Orqaga"
  ),
  point_one: {
    img: img("/uploads/pages/about/default/point-fast-delivery.png"),
    title: multiLangString(
      "Введите заголовок пункта!",
      "Быстрая доставка",
      "Tezkor yetkazib berish"
    ),
    text: multiLangString(
      "Введите текст пункта!",
      `Самая быстрая доставка в городе.
    Если не успеем доставить кофе во время,
    кофе бесплатно Ваш по праву`,
      `Uz text Uz text Uz text Uz text Uz text Uz text Uz text Uz text Uz text`
    ),
  },
  point_two: {
    img: img("/uploads/pages/about/default/point-tasty-cofee.png"),
    title: multiLangString(
      "Введите заголовок пункта!",
      "Самый вкусный кофе",
      "Eng mazali kofe"
    ),
    text: multiLangString(
      "Введите текст пункта!",
      `Легенда гласит “Кофе DiCafe самый вкусный в
      среднй Азии!”. Предлагаем Вам проверить и
      убедиться в правдивости легенды! :)`,
      `Uz text Uz text Uz text Uz text Uz text Uz text Uz text Uz text Uz text`
    ),
  },
  point_three: {
    img: img("/uploads/pages/about/default/point-good-price.png"),
    title: multiLangString(
      "Введите заголовок пункта!",
      "Доступные цены",
      "Ommabop narxlar"
    ),
    text: multiLangString(
      "Введите текст пункта!",
      `В городе по просту нет мест, где вы найдете
      вкус и качество кофе, за такую же цену
      как в нашей кофейне!`,
      `Uz text Uz text Uz text Uz text Uz text Uz text Uz text Uz text Uz text`
    ),
  },
  big_owl: img("/uploads/pages/about/default/owl-adult.svg"),
  small_owl: img("/uploads/pages/about/default/owl-child.svg"),
});

const AboutScreen = mongoose.model("Aboutscreen", AboutScreenSchema);

module.exports = AboutScreen;
