// netlify/functions/get-products.js
const mongoose = require("mongoose");
const Product = require("./models/product");

// MongoDB URI'nizi ortam değişkenlerine taşıyın.
const uri = "mongodb+srv://Ahmet23TR:Ahmet2003@cluster0.oralavo.mongodb.net/";

exports.handler = async (event, context) => {
  // MongoDB'ye bağlan
  mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    const products = await Product.find();
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(products),
    };
  } catch (error) {
    // Bağlantıyı kapat
    mongoose.connection.close();
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Server Error" }),
    };
  }
};
