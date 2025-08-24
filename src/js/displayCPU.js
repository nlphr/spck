const product_list = document.getElementById('cpu-product-list');

function displayCPU() {
  let htmls = "";
  db.collection("cpuData")
    .orderBy("id", "desc")
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const cpuData = doc.data();
        const cpuId = doc.id;
        const formattedPrice = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(cpuData.price);

htmls += `
  <div class="product-row">
    <div class="col-image">
      <img src="${cpuData.imageUrl}" alt="${cpuData.title}">
    </div>
    <div class="col-name">
      <h4 class="product-title">${cpuData.title}</h4>
    </div>
    <div class="col-core"><span class="data-value">${cpuData.coreCount}</span></div>
    <div class="col-clock"><span class="data-value">${cpuData.performanceCoreClock}</span></div>
    <div class="col-arch"><span class="data-value">${cpuData.microarchitecture || "N/A"}</span></div>

    <div class="col-tdp"><span class="data-value">${cpuData.TDP}</span></div>
    <div class="col-rating">
      <div class="rating-stars">${"★".repeat(cpuData.rating)}${"☆".repeat(5 - cpuData.rating)}</div>
      <span class="rating-text">${cpuData.rating}/5</span>
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
      product_list.innerHTML = `<div class="error-message"><p>Error fetching CPU data: ${error.message}</p></div>`;
      console.error("Error fetching CPU data:", error);
    });
}
