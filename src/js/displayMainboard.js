const product_list = document.getElementById('mainboard-product-list');

function displayMainboard() {
  let htmls = "";
  db.collection("mainboardData")
    .orderBy("id", "desc")
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const mainboardData = doc.data();
        const mainboardId = doc.id;

        const formattedPrice = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(mainboardData.price);

        htmls += `
<div class="product-row">
  <div class="col-image">
    <img src="${mainboardData.imageUrl}" alt="${mainboardData.title}">
  </div>
  <div class="col-name">
    <h4 class="product-title">${mainboardData.title}</h4>
  </div>
  <div class="col-memory">
    <span class="data-value">${mainboardData.cpuSocket}</span>
  </div>
  <div class="col-clock">
    <span class="data-value">${mainboardData.chipset || "N/A"}</span>
  </div>
  <div class="col-arch">
    <span class="data-value">${mainboardData.formFactor}</span>
  </div>
  <div class="col-tdp">
    <span class="data-value">${mainboardData.memorySlots}</span>
  </div>
  <div class="col-rating">
    <div class="rating-stars">
      ${"★".repeat(Math.floor(mainboardData.rating))}${"☆".repeat(5 - Math.floor(mainboardData.rating))}
    </div>
    <span class="rating-text">${mainboardData.rating}/5</span>
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
      product_list.innerHTML = `<div class="error-message"><p>Error fetching Mainboard data: ${error.message}</p></div>`;
      console.error("Error fetching Mainboard data:", error);
    });
}
