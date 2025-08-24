const product_list = document.getElementById('gpu-product-list');
function displayGPU() {
  let htmls = "";
  db.collection("gpuData")
    .orderBy("id", "desc")
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const gpuData = doc.data();
        const gpuId = doc.id;
        const formattedPrice = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(gpuData.price);

        htmls += `
 <div class="product-row">
  <div class="col-image">
    <img src="${gpuData.imageUrl}" alt="${gpuData.title}">
  </div>
  <div class="col-name">
    <h4 class="product-title">${gpuData.title}</h4>
  </div>
  <div class="col-memory">
    <span class="data-value">${gpuData.memory}</span>
  </div>
  <div class="col-clock">
    <span class="data-value">${gpuData.coreClock}</span>
  </div>
  <div class="col-arch">
    <span class="data-value">${gpuData.microarchitecture || "N/A"}</span>
  </div>
  <div class="col-tdp">
    <span class="data-value">${gpuData.TDP}</span>
  </div>
  <div class="col-rating">
    <div class="rating-stars">
      ${"★".repeat(gpuData.rating)}${"☆".repeat(5 - gpuData.rating)}
    </div>
    <span class="rating-text">${gpuData.rating}/5</span>
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
      product_list.innerHTML = `<div class="error-message"><p>Error fetching GPU data: ${error.message}</p></div>`;
      console.error("Error fetching GPU data:", error);
    });
}

