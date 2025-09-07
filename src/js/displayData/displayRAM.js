
const product_list = document.getElementById('ram-product-list');
let allRAM = []; // store fetched data

function renderRAM(ramItems) {
  let htmls = "";
  ramItems.forEach((ramData) => {
    const formattedPrice = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(ramData.price);

    htmls += `
      <div class="product-row">
        <div class="col-image">
          <img src="${ramData.imageUrl}" alt="${ramData.title}">
        </div>
        <div class="col-name"><h4 class="product-title">${ramData.title}</h4></div>
        <div class="col-speed"><span class="data-value">${ramData.speed}</span></div>
        <div class="col-modules"><span class="data-value">${ramData.modules}</span></div>
        <div class="col-cas-latency"><span class="data-value">${ramData.casLatency}</span></div>
        <div class="col-first-word"><span class="data-value">${ramData.firstWordLatency}</span></div>
        <div class="col-rating">
          <div class="rating-stars">${"★".repeat(Math.max(0, Math.floor(ramData.rating || 0)))}${"☆".repeat(Math.max(0, 5 - Math.floor(ramData.rating || 0)))}</div>
          <span class="rating-text">${ramData.rating || 0}/5</span>
        </div>
        <div class="col-price">
          <span class="price-value">${formattedPrice}</span>
          <button class="add-to-cart-btn" onclick="window.location.href='productDetails.html?type=ram&id=${ramData.id}'">Buy</button>
        </div>
      </div>
    `;
  });
  product_list.innerHTML = htmls || `<div class="no-products"><p>No RAM modules match your filters.</p></div>`;
}

function displayRAM() {
  db.collection("ramData").get().then((querySnapshot) => {
    allRAM = [];
    querySnapshot.forEach((doc) => allRAM.push({ id: doc.id, ...doc.data() }));
    renderRAM(allRAM);
  }).catch((error) => {
    product_list.innerHTML = `<div class="error-message"><p>Error fetching RAM data: ${error.message}</p></div>`;
    console.error("Error fetching RAM data:", error);
  });
}

// ====== FILTER + SORT + SEARCH LOGIC ======
function applyFiltersAndSort() {
  let filtered = [...allRAM];

  // price filter
  const priceSlider = document.getElementById("priceSlider");
  if (priceSlider) {
    const maxPrice = Number(priceSlider.value);
    filtered = filtered.filter(ram => ram.price <= maxPrice);
  }

  // rating filter
  const ratingCheckboxes = document.querySelectorAll(".filter-section input[type='checkbox']");
  let minRating = 0;
  ratingCheckboxes.forEach((box, idx) => {
    if (box.checked && idx === 0) minRating = Math.max(minRating, 3);
    if (box.checked && idx === 1) minRating = Math.max(minRating, 4);
  });
  filtered = filtered.filter(ram => ram.rating >= minRating);

  // search filter
  const searchInput = document.querySelector(".search-input");
  if (searchInput && searchInput.value.trim() !== "") {
    const term = searchInput.value.toLowerCase();
    filtered = filtered.filter(ram => 
      ram.title.toLowerCase().includes(term) || 
      (ram.speed && ram.speed.toLowerCase().includes(term))
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
      case "speed":
        filtered.sort((a, b) => {
          const speedA = parseInt(a.speed) || 0;
          const speedB = parseInt(b.speed) || 0;
          return speedB - speedA; // Higher speed is better
        });
        break;
      case "modules":
        filtered.sort((a, b) => {
          const modulesA = parseInt(a.modules) || 0;
          const modulesB = parseInt(b.modules) || 0;
          return modulesB - modulesA; // More modules = more capacity
        });
        break;
      case "performance":
        filtered.sort((a, b) => {
          const speedA = parseInt(a.speed) || 0;
          const speedB = parseInt(b.speed) || 0;
          return speedB - speedA; // Higher speed = better performance
        });
        break;
      default:
        break; // recent = default order
    }
  }

  renderRAM(filtered);
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
displayRAM();