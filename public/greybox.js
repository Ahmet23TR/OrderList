// Ürünlerin olduğu listeyi seçin
const productListItems = document.querySelectorAll(".product-item");

// Her bir ürün öğesine tıklandığında, miktar giriş kutusuna odaklan ve sayfayı ürün girişi alanına kaydır
productListItems.forEach((item) => {
  item.addEventListener("click", () => {
    // Önce tüm ürünlerin üzerindeki seçimi kaldırın
    productListItems.forEach((item) => {
      item.classList.remove("selected");
    });
    // Ardından seçilen ürünün kutucuğunu belirtmek için seçili sınıfı ekleyin
    item.classList.add("selected");
    const productName = item.textContent.trim();
    document.getElementById("selected-product-name").textContent = productName;

    // Miktar giriş kutusuna odaklan
    document.getElementById("quantity").focus();

    // Seçilen ürünün kutucuğunun rengini güncelle
    updateProductBoxColor(item);
  });
});

// Seçilen ürünün kutucuğunun rengini güncelleyen işlev
function updateProductBoxColor(selectedItem) {
  // Diğer ürün öğelerini al
  const otherProductItems = document.querySelectorAll(".product-item");

  // Miktar giriş kutusunu al
  const quantityInput = document.getElementById("quantity");

  // Miktar giriş kutusunun değerini kontrol et
  if (quantityInput.value.trim() === "") {
    return; // Eğer miktar girişi yapılmamışsa, işlemi sonlandır
  }

  // Seçilen ürünün daha önce seçilip seçilmediğini kontrol et
  if (!selectedItem.classList.contains("highlight")) {
    // Eğer daha önce seçilmemişse, sarı yap
    selectedItem.style.backgroundColor = "#dbc310";
  } else {
    // Eğer daha önce seçilmişse, yeşile dön
    selectedItem.style.backgroundColor = "lightgreen";

    // Diğer ürünlerin rengini yeşile dön
    otherProductItems.forEach((item) => {
      if (item !== selectedItem) {
        item.style.backgroundColor = "white";
      }
    });
  }
}

// Ürün ve adet tablosu
let orderTable = {};

// Sipariş ekleme işlevi
function addOrder() {
  const selectedProductName = document.getElementById(
    "selected-product-name"
  ).textContent;
  const quantityInput = document.getElementById("quantity");
  const quantity = parseFloat(quantityInput.value);

  // Seçili ürün kontrolü
  if (selectedProductName === "---") {
    return;
  }

  // Geçerli miktar kontrolü
  if (isNaN(quantity)) {
    alert("Lütfen geçerli bir miktar giriniz.");
    return;
  }

  // Sipariş tablosunu güncelle
  if (orderTable[selectedProductName] !== undefined) {
    orderTable[selectedProductName] += quantity;
  } else {
    orderTable[selectedProductName] = quantity;
  }

  // Toplam sipariş adedini güncelle
  updateOrderTotal();

  // Diğer güncellemeleri yap
  updateQuantityTable();

  // Seçimi sıfırla
  document.getElementById("selected-product-name").textContent = "---";
  quantityInput.value = "";
}

// Seçilen ürün adını tıkladığınızda miktar giriş kutusunu etkinleştirin
document
  .getElementById("selected-product-name")
  .addEventListener("click", function () {
    document.getElementById("quantity").disabled = false;
  });

// Miktar giriş kutusunun odak kaybı olayını dinleyin
document.getElementById("quantity").addEventListener("blur", function () {
  // Eğer herhangi bir ürün seçili değilse, miktar giriş kutusunu sıfırlayın
  if (document.getElementById("selected-product-name").textContent === "---") {
    this.value = "";
  }
});

// Sipariş butonunu ve miktar girişini dinleyin
const orderButton = document.querySelector(".order-button");
const quantityInput = document.getElementById("quantity");

// Sipariş butonuna tıklama veya miktar girişinde "Enter" tuşuna basılma durumlarını dinleyin
orderButton.addEventListener("click", addOrder);
quantityInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    addOrder();
  }
});

// Sipariş tablosunu güncelleme işlevi
function updateQuantityTable() {
  const quantityItems = document.querySelectorAll(".quantity");

  quantityItems.forEach((item, index) => {
    const productItem =
      item.parentNode.parentNode.querySelector(".product-item");
    if (productItem) {
      const productName = productItem.textContent;
      const updatedQuantity = orderTable[productName] || 0;
      item.textContent = updatedQuantity;

      // Ürün adedine göre renk değişimi sağla
      if (updatedQuantity > 0) {
        productItem.classList.add("highlight"); // Sipariş girildiğinde renk değişimi
      } else {
        productItem.classList.remove("highlight"); // Sipariş iptal edildiğinde renk değişimi geri al
      }
    }
  });
}

// Toplam sipariş adedini güncelleme işlevi
function updateOrderTotal() {
  let totalOrders = 0;

  for (const quantity of Object.values(orderTable)) {
    totalOrders += quantity;
  }

  const totalOrdersElement = document.getElementById("total-orders");
  totalOrdersElement.textContent = totalOrders;
}

// Miktar giriş kutusunun "input" olayını dinle
quantityInput.addEventListener("input", function () {
  // Miktarı al
  const quantity = parseFloat(this.value);

  // Eğer miktar 0 değilse, ürün kutusunun rengini değiştir
  if (quantity != 0) {
    const productItem = document.querySelector(".product-item.selected");
    if (productItem) {
      productItem.style.backgroundColor = "#dbc310";
    }
  }
});

const orderDetails = document.querySelector(".order-details");
const header = document.querySelector(".header");

const stickyNav = function (entries) {
  const [entry] = entries;
  if (!entry.isIntersecting) orderDetails.classList.add("sticky");
  else orderDetails.classList.remove("sticky");
};

const observerOptions = {
  root: null, // varsayılan olarak viewport'u izler
  threshold: 0,
};

const headerObserver = new IntersectionObserver(stickyNav, observerOptions);
headerObserver.observe(orderDetails); // Hedef olarak orderDetails'i belirliyoruz

document.addEventListener("DOMContentLoaded", function () {
  // Ürünlerin bulunduğu container'a event delegation uygula
  document
    .querySelector(".product-container")
    .addEventListener("input", function (e) {
      // Eğer input event'i bir .quantity sınıfından geliyorsa
      if (e.target && e.target.matches(".quantity")) {
        const productItem = e.target.closest(".product-quantity-table");
        const quantity = parseFloat(e.target.value, 10);

        // Miktarı kontrol et ve kutunun rengini güncelle
        updateProductBoxColorBasedOnQuantity(productItem, quantity);
      }
    });
});

function updateProductBoxColorBasedOnQuantity(productItem, quantity) {
  if (quantity > 0) {
    productItem.style.backgroundColor = "#dbc310"; // Miktar varsa arka plan rengini değiştir
  } else {
    productItem.style.backgroundColor = ""; // Miktar yoksa arka plan rengini sıfırla
  }
}

function themeChange() {
  // Body için tema değişikliği
  document.body.classList.toggle("dark");

  // product-quantity-table sınıfına sahip tüm elemanlar için tema değişikliği
  var tables = document.getElementsByClassName("product-item");
  for (var i = 0; i < tables.length; i++) {
    tables[i].classList.toggle("dark");
  }
  var tables = document.getElementsByClassName("quantity-container");
  for (var i = 0; i < tables.length; i++) {
    tables[i].classList.toggle("dark");
  }

  // product-title sınıfına sahip tüm elemanlar için tema değişikliği
  var titles = document.getElementsByClassName("product-title");
  for (var i = 0; i < titles.length; i++) {
    titles[i].classList.toggle("dark");
  }

  // selected-product sınıfına sahip tüm elemanlar için tema değişikliği
  var selectedProducts = document.getElementsByClassName("selected-product");
  for (var i = 0; i < selectedProducts.length; i++) {
    selectedProducts[i].classList.toggle("dark");
  }
  var selectedProducts = document.getElementsByClassName("total");
  for (var i = 0; i < selectedProducts.length; i++) {
    selectedProducts[i].classList.toggle("dark");
  }
  var selectedProducts = document.getElementsByClassName("DerasHeader");
  for (var i = 0; i < selectedProducts.length; i++) {
    selectedProducts[i].classList.toggle("dark");
  }
}
function fetchProducts() {
  fetch("/api/products")
    .then((response) => response.json())
    .then((products) => {
      console.log(products);
      const productList = document.querySelector(".product-container ul");
      productList.innerHTML = ""; // Listeyi temizle
      products.forEach((product) => {
        productList.innerHTML += `
          <li class="product-quantity-table">
            <div class="product-item">${product.name}</div>
            <div class="quantity-container">
              <span class="quantity">0</span>
            </div>
          </li>`;
      });
    })
    .catch((error) => console.error("Hata:", error));
}

// Sayfa yüklendiğinde ürünleri yükle
document.addEventListener("DOMContentLoaded", fetchProducts);

document.getElementById("productForm").addEventListener("submit", function (e) {
  e.preventDefault(); // Formun varsayılan gönderim işlemini engeller

  const productName = document.getElementById("productName").value;

  // Ürün verilerini sunucuya gönder
  fetch("/api/products", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: productName,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Ürün eklendi:", data);
      // Burada formu temizleyebilir ve/veya kullanıcıya geri bildirim sağlayabilirsiniz.
    })
    .catch((error) => {
      console.error("Ürün eklenirken bir hata oluştu:", error);
    });
});
