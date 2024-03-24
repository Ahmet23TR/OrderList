// netlify/functions/get-products.js

const mongoose = require("mongoose");
const Product = require("../../../models/product"); // Yolu modellerinizin bulunduğu konuma göre ayarlayın

const handler = async (event, context) => {
  // MongoDB bağlantısını kur
  await mongoose.connect(process.env.MONGO_URI);

  // Tüm ürünleri çek
  try {
    const products = await Product.find();
    return {
      statusCode: 200,
      body: JSON.stringify(products),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ msg: "Internal Server Error", error: error }),
    };
  }
};

module.exports = { handler };
