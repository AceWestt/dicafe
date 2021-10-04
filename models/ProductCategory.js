const mongoose = require("mongoose");
const { multiLangString } = require("../utils/tools");

const ProductCategorySchema = new mongoose.Schema({
  title: multiLangString("Обяз. поле!", "название", "nom"),
  created_at: {
    type: Date,
    default: Date.now(),
  },
});

const ProductCategory = mongoose.model(
  "Productcategory",
  ProductCategorySchema
);

module.exports = ProductCategory;
