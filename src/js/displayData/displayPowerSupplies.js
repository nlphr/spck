
const product_list = document.getElementById('power-supply-product-list');
let allPowerSupplies = []; // store fetched data

function renderPowerSupplies(psus) {
  let htmls = "";
  psus.forEach((psuData) => {
    const formattedPrice = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(psuData.price);

    htmls += `
      <div class="product-row">
        <div class="col-image">
          <img src="${psuData.imageUrl}" alt="${psuData.title}">
        </div>
        <div class="col-name"><h4 class="product-title">${psuData.title}</h4></div>
        <div class="col-efficiency"><span class="data-value">${psuData.efficiency}</span></div>
        <div class="col-type"><span class="data-value">${psuData.type}</span></div>
        <div class="col-modular"><span class="data-value">${psuData.modular}</span></div>
        <div class="col-wattage"><span class="data-value">${psuData.wattage}</span></div>
        <div class="col-rating">
          <div class="rating-stars">${"★".repeat(Math.max(0, Math.floor(psuData.rating || 0)))}${"☆".repeat(Math.max(0, 5 - Math.floor(psuData.rating || 0)))}</div>
          <span class="rating-text">${psuData.rating || 0}/5</span>
        </div>
        <div class="col-price">
          <span class="price-value">${formattedPrice}</span>
          <button class="add-to-cart-btn" onclick="window.location.href='productDetails.html?type=power&id=${psuData.id}'">Buy</button>
        </div>
      </div>
    `;
  });
  product_list.innerHTML = htmls || `<div class="no-products"><p>No Power Supplies match your filters.</p></div>`;
}

function displayPowerSupplies() {
  db.collection("powerSupplyData").get().then((querySnapshot) => {
    allPowerSupplies = [];
    querySnapshot.forEach((doc) => allPowerSupplies.push({ id: doc.id, ...doc.data() }));
    renderPowerSupplies(allPowerSupplies);
  }).catch((error) => {
    product_list.innerHTML = `<div class="error-message"><p>Error fetching Power Supply data: ${error.message}</p></div>`;
    console.error("Error fetching Power Supply data:", error);
  });
}

// ====== FILTER + SORT + SEARCH LOGIC ======
function applyFiltersAndSort() {
  let filtered = [...allPowerSupplies];

  // price filter
  const priceSlider = document.getElementById("priceSlider");
  if (priceSlider) {
    const maxPrice = Number(priceSlider.value);
    filtered = filtered.filter(psu => psu.price <= maxPrice);
  }

  // rating filter
  const ratingCheckboxes = document.querySelectorAll(".filter-section input[type='checkbox']");
  let minRating = 0;
  ratingCheckboxes.forEach((box, idx) => {
    if (box.checked && idx === 0) minRating = Math.max(minRating, 3);
    if (box.checked && idx === 1) minRating = Math.max(minRating, 4);
  });
  filtered = filtered.filter(psu => psu.rating >= minRating);

  // search filter
  const searchInput = document.querySelector(".search-input");
  if (searchInput && searchInput.value.trim() !== "") {
    const term = searchInput.value.toLowerCase();
    filtered = filtered.filter(psu => 
      psu.title.toLowerCase().includes(term) || 
      (psu.efficiency && psu.efficiency.toLowerCase().includes(term)) ||
      (psu.type && psu.type.toLowerCase().includes(term))
    );
  }

  // sorting
  const activeSort = document.querySelector(".sort-btn.active");
  if (activeSort) {
    switch (activeSort.dataset.sort) {
      case "price":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "efficiency":
        filtered.sort((a, b) => {
          const effA = parseFloat(a.efficiency) || 0;
          const effB = parseFloat(b.efficiency) || 0;
          return effB - effA; // Higher efficiency is better
        });
        break;
      case "wattage":
        filtered.sort((a, b) => {
          const wattA = parseInt(a.wattage) || 0;
          const wattB = parseInt(b.wattage) || 0;
          return wattB - wattA; // Higher wattage is better
        });
        break;
      case "performance":
        filtered.sort((a, b) => {
          const wattA = parseInt(a.wattage) || 0;
          const wattB = parseInt(b.wattage) || 0;
          return wattB - wattA; // Higher wattage = better performance
        });
        break;
      default:
        break; // recent = default order
    }
  }

  renderPowerSupplies(filtered);
}

// ====== EVENT LISTENERS ======
document.addEventListener("DOMContentLoaded", () => {
  // price slider
  const priceSlider = document.getElementById("priceSlider");
  if (priceSlider) priceSlider.addEventListener("input", applyFiltersAndSort);

  // rating checkboxes
  document.querySelectorAll(".filter-section input[type='checkbox']").forEach(cb => {
    cb.addEventListener("change", applyFiltersAndSort);
  });

  // sort buttons
  const sortButtons = document.querySelectorAll(".sort-btn");
  sortButtons.forEach(btn => {
    btn.addEventListener("click", function () {
      sortButtons.forEach(b => b.classList.remove("active"));
      this.classList.add("active");
      applyFiltersAndSort();
    });
  });

  // search bar
  const searchInput = document.querySelector(".search-input");
  if (searchInput) {
    searchInput.addEventListener("input", applyFiltersAndSort);
  }
});

// Initialize the display
displayPowerSupplies();
