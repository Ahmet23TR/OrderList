const express = require("express");
const app = express();
const port = 3001;

// Statik dosyaları sunmak için public klasörünü kullan
app.use(express.static("public"));

// Ürünleri listelemek için bir API yolu
app.get("/api/products", (req, res) => {
  // Ürün listesini döndür
  res.json([{ name: "Ürün 1" }, { name: "Ürün 2" }]);
});

app.listen(port, () => {
  console.log(`Sunucu http://localhost:${port} adresinde çalışıyor.`);
});

const mongoose = require("mongoose");

const uri = "mongodb+srv://Ahmet23TR:Ahmet2003@cluster0.oralavo.mongodb.net/";

mongoose
  .connect(uri)
  .then(() => console.log("MongoDB bağlantısı başarılı."))
  .catch((err) => console.error("MongoDB bağlantı hatası:", err));

const product = require("./models/product");

// Ürünleri Listele
app.get("/api/products", async (req, res) => {
  const products = await product.find();
  res.json(products);
});

const Order = require("./models/Order");

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
    price: req.body.price,
    description: req.body.description,
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
