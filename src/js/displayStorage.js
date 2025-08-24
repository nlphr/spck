const product_list = document.getElementById('storage-product-list');

function displayStorage() {
  let htmls = "";
  db.collection("storageData")
    .orderBy("id", "desc")
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const storageData = doc.data();
        const storageId = doc.id;
        const formattedPrice = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(storageData.price);

htmls += `
 <div class="product-row">
  <div class="col-image">
    <img src="${storageData.imageUrl}" alt="${storageData.title}">
  </div>
  <div class="col-name">
    <h4 class="product-title">${storageData.title}</h4>
  </div>
  <div class="col-memory">
    <span class="data-value">${storageData.capacity}</span>
  </div>
  <div class="col-clock">
    <span class="data-value">${storageData.type}</span>
  </div>
  <div class="col-arch">
    <span class="data-value">${storageData.formFactor}</span>
  </div>
  <div class="col-tdp">
    <span class="data-value">${storageData.interface}</span>
  </div>
  <div class="col-rating">
    <div class="rating-stars">
      ${"★".repeat(storageData.rating)}${"☆".repeat(5 - storageData.rating)}
    </div>
    <span class="rating-text">${storageData.rating}/5</span>
  </div>
  <div class="col-price">
    <span class="price-value">${formattedPrice}</span>
    <button class="add-to-cart-btn">Buy</button>
  </div>
</div>

`;
      });
      product_list.innerHTML = htmls;
    })
    .catch((error) => {
      product_list.innerHTML = `<div class="error-message"><p>Error fetching Storage data: ${error.message}</p></div>`;
      console.error("Error fetching Storage data:", error);
    });
}

displayStorage();