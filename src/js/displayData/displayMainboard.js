const product_list = document.getElementById('mainboard-product-list');
let allMainboards = []; // store fetched data

function renderMainboards(mainboards) {
  let htmls = "";
  mainboards.forEach((mainboardData) => {
    const formattedPrice = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(mainboardData.price);

    htmls += `
      <div class="product-row">
        <div class="col-image">
          <img src="${mainboardData.imageUrl}" alt="${mainboardData.title}">
        </div>
        <div class="col-name"><h4 class="product-title">${mainboardData.title}</h4></div>
        <div class="col-socket"><span class="data-value">${mainboardData.cpuSocket}</span></div>
        <div class="col-chipset"><span class="data-value">${mainboardData.chipset || "N/A"}</span></div>
        <div class="col-form-factor"><span class="data-value">${mainboardData.formFactor}</span></div>
        <div class="col-memory-slots"><span class="data-value">${mainboardData.memorySlots}</span></div>
        <div class="col-rating">
          <div class="rating-stars">${"★".repeat(Math.max(0, Math.floor(mainboardData.rating || 0)))}${"☆".repeat(Math.max(0, 5 - Math.floor(mainboardData.rating || 0)))}</div>
          <span class="rating-text">${mainboardData.rating || 0}/5</span>
        </div>
        <div class="col-price">
          <span class="price-value">${formattedPrice}</span>
          <button class="add-to-cart-btn" onclick="window.location.href='productDetails.html?type=mainboard&id=${mainboardData.id}'">Buy</button>
        </div>
      </div>
    `;
  });
  product_list.innerHTML = htmls || `<div class="no-products"><p>No Motherboards match your filters.</p></div>`;
}

function displayMainboard() {
  db.collection("mainboardData").get().then((querySnapshot) => {
    allMainboards = [];
    querySnapshot.forEach((doc) => allMainboards.push({ id: doc.id, ...doc.data() }));
    renderMainboards(allMainboards);
  }).catch((error) => {
    product_list.innerHTML = `<div class="error-message"><p>Error fetching Mainboard data: ${error.message}</p></div>`;
    console.error("Error fetching Mainboard data:", error);
  });
}

// ====== FILTER + SORT + SEARCH LOGIC ======
function applyFiltersAndSort() {
  let filtered = [...allMainboards];

  // price filter
  const priceSlider = document.getElementById("priceSlider");
  if (priceSlider) {
    const maxPrice = Number(priceSlider.value);
    filtered = filtered.filter(mainboard => mainboard.price <= maxPrice);
  }

  // rating filter
  const ratingCheckboxes = document.querySelectorAll(".filter-section input[type='checkbox']");
  let minRating = 0;
  ratingCheckboxes.forEach((box, idx) => {
    if (box.checked && idx === 0) minRating = Math.max(minRating, 3);
    if (box.checked && idx === 1) minRating = Math.max(minRating, 4);
  });
  filtered = filtered.filter(mainboard => mainboard.rating >= minRating);

  // search filter
  const searchInput = document.querySelector(".search-input");
  if (searchInput && searchInput.value.trim() !== "") {
    const term = searchInput.value.toLowerCase();
    filtered = filtered.filter(mainboard => 
      mainboard.title.toLowerCase().includes(term) || 
      (mainboard.cpuSocket && mainboard.cpuSocket.toLowerCase().includes(term)) ||
      (mainboard.chipset && mainboard.chipset.toLowerCase().includes(term))
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
      case "socket":
        filtered.sort((a, b) => a.cpuSocket.localeCompare(b.cpuSocket));
        break;
      case "chipset":
        filtered.sort((a, b) => (a.chipset || "").localeCompare(b.chipset || ""));
        break;
      case "performance":
        filtered.sort((a, b) => {
          const slotsA = parseInt(a.memorySlots) || 0;
          const slotsB = parseInt(b.memorySlots) || 0;
          return slotsB - slotsA;
        });
        break;
      default:
        break; // recent = default order
    }
  }

  renderMainboards(filtered);
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
displayMainboard();
