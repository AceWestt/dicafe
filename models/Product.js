const mongoose = require("mongoose");
const { multiLangString, img } = require("../utils/tools");

const ProductSchema = new mongoose.Schema({
  img: img(undefined),
  title: multiLangString("Обяз. поле!", "Название", "Nom"),
  subtitle: multiLangString("Обяз. поле!", "Название", "Nom"),
  amount: {
    type: Number,
    required: true,
    default: 0,
  },
  price: {
    type: Number,
    required: true,
    default: 0,
  },
  category_id: {
    type: String,
  },
  created_at: {
    type: Date,
    default: Date.now(),
  },
});

const Product = mongoose.model("Product", ProductSchema);

module.exports = Product;
