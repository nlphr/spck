
const product_list = document.getElementById('ram-product-list');
function displayRAM() {
  let htmls = "";
  db.collection("ramData")
    .orderBy("id", "desc")
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {

        const ramData = doc.data();
        const ramId = doc.id;
        const formattedPrice = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(ramData.price);
        console.log(ramData);

        htmls += `
<div class="product-row">
  <div class="col-image">
    <img src="${ramData.imageUrl}" alt="${ramData.title}">
  </div>
  <div class="col-name">
    <h4 class="product-title">${ramData.title}</h4>
  </div>
  <div class="col-memory">
    <span class="data-value">${ramData.speed}</span>
  </div>
  <div class="col-clock">
    <span class="data-value">${ramData.modules}</span>
  </div>
  <div class="col-arch">
    <span class="data-value">${ramData.casLatency}</span>
  </div>
  <div class="col-tdp">
    <span class="data-value">${ramData.firstWordLatency}</span>
  </div>
  <div class="col-rating">
    <div class="rating-stars">
      ${"★".repeat(ramData.rating)}${"☆".repeat(5 - ramData.rating)}
    </div>
    <span class="rating-text">${ramData.rating}/5</span>
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
      product_list.innerHTML = `<div class="error-message"><p>Error fetching RAM data: ${error.message}</p></div>`;
      console.error("Error fetching RAM data:", error);
    });
}