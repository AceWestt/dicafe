const mongoose = require("mongoose");
const { multiLangString, img } = require("../utils/tools");

const ContactScreenSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  title: multiLangString("Введите заголовок экрана!", "Контакты", "Aloqa"),
  back_button: multiLangString(
    "Введите надпись на кнопке вернуться!",
    "Вернуться",
    "Orqaga"
  ),
  address: multiLangString(
    "Введите адресс!",
    "г. Ташкент, Яккасарайский р-н., ул. Тадбиркор 78",
    "Uzb manzil"
  ),
  phone: {
    type: String,
    default: "(71) 200 - 30 - 30",
    required: [true, "Введите телефон!"],
  },
  address_icn: img("/uploads/pages/contact/default/icn-map.svg"),
  address_icn_mobile: img("/uploads/pages/contact/default/icn-map-mobile.svg"),
  phone_icn: img("/uploads/pages/contact/default/phone-mobile.svg"),
});

const ContactScreen = mongoose.model("Contactscreen", ContactScreenSchema);

module.exports = ContactScreen;
