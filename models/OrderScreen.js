const mongoose = require("mongoose");
const { multiLangString, img } = require("../utils/tools");

const OrderScreenSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
  },
  title: multiLangString(
    "Введите заголовок экрана!",
    "Выбирайте Ваш кофе :)",
    "Kofeingizni tanlang :)"
  ),
  back_button: multiLangString(
    "Введите надпись на кнопке вернуться!",
    "Вернуться",
    "Orqaga"
  ),
  crown: img("/uploads/pages/order/default/corona.svg"),
  skater: img("/uploads/pages/order/default/skater.gif"),
});

const OrderScreen = mongoose.model("Orderscreen", OrderScreenSchema);

module.exports = OrderScreen;
