import { db } from "./firebase-config.js";
function displayCPU(list) {
  let htmls = "";
  db.collection("cpuData")
    .orderBy("id")
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
          <div class="col-name">
            <div class="product-info">
              <div class="product-image">
                <img src="${cpuData.imageUrl}" alt="${cpuData.title}" class="cpu-image">
              </div>
              <div class="product-details">
                <h4 class="product-title">${cpuData.title}</h4>
                <p class="product-id">ID: ${cpuId}</p>
                <p class="product-description">${cpuData.description}</p>
              </div>
            </div>
          </div>
          <div class="col-core" data-label="Core Count">
            <span class="data-value">${cpuData.coreCount}</span>
          </div>
          <div class="col-clock" data-label="Performance Core Clock">
            <span class="data-value">${cpuData.performanceCoreClock}</span>
          </div>
          <div class="col-arch" data-label="Microarchitecture">
            <span class="data-value">${cpuData.microarchitecture}</span>
          </div>
          <div class="col-tdp" data-label="TDP">
            <span class="data-value">${cpuData.TPD}</span>
          </div>
          <div class="col-rating" data-label="Rating">
            <div class="rating-stars">
              ${generateStarRating(cpuData.rating)}
            </div>
            <span class="rating-text">${cpuData.rating}/5</span>
          </div>
          <div class="col-price" data-label="Price">
            <span class="price-value">${formattedPrice}</span>
            <button class="add-to-cart-btn">Add to Cart</button>
          </div>
        </div>
      `;
    });
      list.innerHTML = htmls;
    })
    .catch((error) => {
      console.error("Error fetching CPU data: ", error);
    });
}

export { displayCPU };