const product_list = document.getElementById('gpu-product-list');
let allGPUs = []; // store fetched data

function renderGPUs(gpus) {
  let htmls = "";
  gpus.forEach((gpuData) => {
    const formattedPrice = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(gpuData.price);

    htmls += `
      <div class="product-row">
        <div class="col-image">
          <img src="${gpuData.imageUrl}" alt="${gpuData.title}">
        </div>
        <div class="col-name"><h4 class="product-title">${gpuData.title}</h4></div>
        <div class="col-chipset"><span class="data-value">${gpuData.chipset}</span></div>
        <div class="col-memory"><span class="data-value">${gpuData.memory}</span></div>
        <div class="col-clock"><span class="data-value">${gpuData.coreClock}</span></div>
        <div class="col-length"><span class="data-value">${gpuData.length}</span></div>
        <div class="col-rating">
          <div class="rating-stars">${"★".repeat(Math.max(0, Math.floor(gpuData.rating || 0)))}${"☆".repeat(Math.max(0, 5 - Math.floor(gpuData.rating || 0)))}</div>
          <span class="rating-text">${gpuData.rating || 0}/5</span>
        </div>
        <div class="col-price">
          <span class="price-value">${formattedPrice}</span>
          <button class="add-to-cart-btn">Buy</button>
        </div>
      </div>
    `;
  });
  product_list.innerHTML = htmls || `<div class="no-products"><p>No GPUs match your filters.</p></div>`;
}

function displayGPU() {
  db.collection("gpuData").get().then((querySnapshot) => {
    allGPUs = [];
    querySnapshot.forEach((doc) => allGPUs.push(doc.data()));
    renderGPUs(allGPUs);
  }).catch((error) => {
    product_list.innerHTML = `<div class="error-message"><p>Error fetching GPU data: ${error.message}</p></div>`;
    console.error("Error fetching GPU data:", error);
  });
}

// ====== FILTER + SORT + SEARCH LOGIC ======
function applyFiltersAndSort() {
  let filtered = [...allGPUs];

  // price filter
  const priceSlider = document.getElementById("priceSlider");
  if (priceSlider) {
    const maxPrice = Number(priceSlider.value);
    filtered = filtered.filter(gpu => gpu.price <= maxPrice);
  }

  // rating filter
  const ratingCheckboxes = document.querySelectorAll(".filter-section input[type='checkbox']");
  let minRating = 0;
  ratingCheckboxes.forEach((box, idx) => {
    if (box.checked && idx === 0) minRating = Math.max(minRating, 3);
    if (box.checked && idx === 1) minRating = Math.max(minRating, 4);
  });
  filtered = filtered.filter(gpu => gpu.rating >= minRating);

  // search filter
  const searchInput = document.querySelector(".search-input");
  if (searchInput && searchInput.value.trim() !== "") {
    const term = searchInput.value.toLowerCase();
    filtered = filtered.filter(gpu => 
      gpu.title.toLowerCase().includes(term) || 
      (gpu.chipset && gpu.chipset.toLowerCase().includes(term))
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
      case "memory":
        filtered.sort((a, b) => {
          const memA = parseInt(a.memory) || 0;
          const memB = parseInt(b.memory) || 0;
          return memB - memA;
        });
        break;
      case "core-clock":
        filtered.sort((a, b) => {
          const freq = str => parseFloat(str.replace("GHz", "")) || 0;
          return freq(b.coreClock) - freq(a.coreClock);
        });
        break;
      case "performance":
        filtered.sort((a, b) => {
          const freq = str => parseFloat(str.replace("GHz", "")) || 0;
          return freq(b.coreClock) - freq(a.coreClock);
        });
        break;
      default:
        break; // recent = default order
    }
  }

  renderGPUs(filtered);
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
displayGPU();
