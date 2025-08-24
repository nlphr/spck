const product_list = document.getElementById('case-product-list');
function displayCase() {
  let htmls = "";
  db.collection("caseData")
    .orderBy("id", "desc")
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const caseData = doc.data();
        const caseId = doc.id;
        const formattedPrice = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(caseData.price);

        htmls += `
<div class="product-row">
  <div class="col-image">
    <img src="${caseData.imageUrl}" alt="${caseData.title}">
  </div>
  <div class="col-name">
    <h4 class="product-title">${caseData.title}</h4>
  </div>
  <div class="col-memory">
    <span class="data-value">${caseData.type}</span>
  </div>
  <div class="col-clock">
    <span class="data-value">${caseData.formFactor}</span>
  </div>
  <div class="col-arch">
    <span class="data-value">${caseData.sidePanel}</span>
  </div>
  <div class="col-tdp">
    <span class="data-value">${caseData.externalVolume}</span>
  </div>
  <div class="col-rating">
    <div class="rating-stars">
      ${"★".repeat(Math.floor(caseData.rating))}${"☆".repeat(5 - Math.floor(caseData.rating))}
    </div>
    <span class="rating-text">${caseData.rating}/5</span>
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
      product_list.innerHTML = `<div class="error-message"><p>Error fetching Case data: ${error.message}</p></div>`;
      console.error("Error fetching Case data:", error);
    });
}

