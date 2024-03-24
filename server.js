const express = require("express");
const app = express();
app.use(express.json());

const port = 3001;

const cors = require("cors");
app.use(cors());

// Statik dosyaları sunmak için public klasörünü kullan
app.use(express.static("public"));

app.listen(port, () => {
  console.log(`Sunucu http://localhost:${port} adresinde çalışıyor.`);
});

const mongoose = require("mongoose");

const uri = "mongodb+srv://Ahmet23TR:Ahmet2003@cluster0.oralavo.mongodb.net/";

mongoose
  .connect(uri)
  .then(() => console.log("MongoDB bağlantısı başarılı."))
  .catch((err) => console.error("MongoDB bağlantı hatası:", err));

let cachedDb = null;

async function connectToDatabase(uri) {
  if (cachedDb && mongoose.connection.readyState === 1) {
    return Promise.resolve(cachedDb);
  }

  return mongoose
    .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((db) => {
      cachedDb = db;
      return cachedDb;
    });
}

exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  await connectToDatabase(process.env.MONGO_URI);

  const Product = require("./models/product"); // Product modelinizi import edin

  // Ürünleri listelemek için bir API yolu
  app.get("/api/products", async (req, res) => {
    try {
      const products = await Product.find(); // Tüm ürünleri veritabanından çek
      res.json(products); // Ürün listesini JSON formatında döndür
    } catch (error) {
      res
        .status(500)
        .json({ message: "Ürünler yüklenirken bir hata oluştu", error: error });
    }
  });

  const Order = require("./models/order");

  // Yeni Sipariş Ekle
  app.post("/api/orders", async (req, res) => {
    const order = new Order(req.body); // req.body, sipariş detaylarını içermelidir.
    await order.save();
    res.status(201).send(order);
  });

  // Ürün ekleme API yolu
  app.post("/api/products", (req, res) => {
    const newProduct = new Product({
      name: req.body.name,
    });

    newProduct
      .save()
      .then((product) => res.status(201).json(product))
      .catch((err) =>
        res
          .status(400)
          .json({ message: "Ürün eklenirken bir hata oluştu", error: err })
      );
  });
};
