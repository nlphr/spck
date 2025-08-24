
const product_list = document.getElementById('power-supply-product-list');

function displayPowerSupplies() {
  let htmls = "";
  db.collection("powerSupplyData")
    .orderBy("id", "desc")
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const psuData = doc.data();
        const psuId = doc.id;

        const formattedPrice = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(psuData.price);

        htmls += `
<div class="product-row">
  <div class="col-name">
    <h4 class="product-title">${psuData.title}</h4>
  </div>
  <div class="col-memory">
    <span class="data-value">${psuData.efficiency}</span>
  </div>
  <div class="col-clock">
    <span class="data-value">${psuData.type}</span>
  </div>
  <div class="col-arch">
    <span class="data-value">${psuData.modular}</span>
  </div>
  <div class="col-tdp">
    <span class="data-value">${psuData.wattage}</span>
  </div>
  <div class="col-rating">
    <div class="rating-stars">
      ${"★".repeat(Math.floor(psuData.rating))}${"☆".repeat(5 - Math.floor(psuData.rating))}
    </div>
    <span class="rating-text">${psuData.rating}/5</span>
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
      product_list.innerHTML = `<div class="error-message"><p>Error fetching Power Supply data: ${error.message}</p></div>`;
      console.error("Error fetching Power Supply data:", error);
    });
}
