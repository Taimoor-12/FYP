const mongoose = require("mongoose");
const Joi = require("@hapi/joi");
const productSchema = mongoose.Schema({
  firstname: String,
  lastname: String,
  phone: String,
  city:String,
  slug: {
    type: String,
    lowercase: true,
  },
});
const ProductModel = mongoose.model("teams", productSchema);
function validateProduct(data) {
    const schema = Joi.object({
      firstname: Joi.string().min(3).max(20).required(),
      lastname: Joi.string().min(3).max(20).required(),
      city: Joi.string().min(3).max(20).required(),
      phone: Joi.string().min(11).required(),
    });
    return schema.validate(data, { abortEarly: false });
  }
module.exports = ProductModel;
module.exports.validate = validateProduct;
/*const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  firstTeam: String,
  secondTeam: String,
  date: Date,
  
});
const ProductModel = mongoose.model("products", productSchema);
module.exports = ProductModel;*/