const product_list = document.getElementById('cpu-cooler-product-list');

function displayCpuCooler() {
  let htmls = "";
  db.collection("cpuCoolerData")
    .orderBy("id", "desc")
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const coolerData = doc.data();
        const coolerId = doc.id;

        const formattedPrice = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(coolerData.price);

        htmls += `
<div class="product-row">
  <div class="col-image">
    <img src="${coolerData.imageUrl}" alt="${coolerData.title}">
  </div>
  <div class="col-name">
    <h4 class="product-title">${coolerData.title}</h4>
  </div>
  <div class="col-memory">
    <span class="data-value">${coolerData.fanRPM}</span>
  </div>
  <div class="col-clock">
    <span class="data-value">${coolerData.noiseLevel}</span>
  </div>
  <div class="col-arch">
    <span class="data-value">${coolerData.radiatorSize}</span>
  </div>
  <div class="col-tdp">
    <span class="data-value">${coolerData.TDP || "N/A"}</span>
  </div>
  <div class="col-rating">
    <div class="rating-stars">
      ${"★".repeat(Math.floor(coolerData.rating))}${"☆".repeat(5 - Math.floor(coolerData.rating))}
    </div>
    <span class="rating-text">${coolerData.rating}/5</span>
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
      product_list.innerHTML = `<div class="error-message"><p>Error fetching CPU Cooler data: ${error.message}</p></div>`;
      console.error("Error fetching CPU Cooler data:", error);
    });
}
