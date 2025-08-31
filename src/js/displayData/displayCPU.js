const product_list = document.getElementById('cpu-product-list');
let allCPUs = []; // store fetched data

function renderCPUs(cpus) {
  let htmls = "";
  cpus.forEach((cpuData) => {
    const formattedPrice = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(cpuData.price);

    htmls += `
      <div class="product-row">
        <div class="col-image">
          <img src="${cpuData.imageUrl}" alt="${cpuData.title}">
        </div>
        <div class="col-name"><h4 class="product-title">${cpuData.title}</h4></div>
        <div class="col-core"><span class="data-value">${cpuData.coreCount}</span></div>
        <div class="col-clock"><span class="data-value">${cpuData.performanceCoreClock}</span></div>
        <div class="col-arch"><span class="data-value">${cpuData.microarchitecture || "N/A"}</span></div>
        <div class="col-tdp"><span class="data-value">${cpuData.TPD}</span></div>
        <div class="col-rating">
          <div class="rating-stars">${"★".repeat(Math.max(0, Math.floor(cpuData.rating || 0)))}${"☆".repeat(Math.max(0, 5 - Math.floor(cpuData.rating || 0)))}</div>
          <span class="rating-text">${cpuData.rating || 0}/5</span>
        </div>
        <div class="col-price">
          <span class="price-value">${formattedPrice}</span>
          <button class="add-to-cart-btn">Buy</button>
        </div>
      </div>
    `;
  });
  product_list.innerHTML = htmls || `<div class="no-products"><p>No CPUs match your filters.</p></div>`;
}

function displayCPU() {
  db.collection("cpuData").get().then((querySnapshot) => {
    allCPUs = [];
    querySnapshot.forEach((doc) => allCPUs.push(doc.data()));
    renderCPUs(allCPUs);
  }).catch((error) => {
    product_list.innerHTML = `<div class="error-message"><p>Error fetching CPU data: ${error.message}</p></div>`;
    console.error("Error fetching CPU data:", error);
  });
}

// ====== FILTER + SORT + SEARCH LOGIC ======
function applyFiltersAndSort() {
  let filtered = [...allCPUs];

  // price filter
  const priceSlider = document.getElementById("priceSlider");
  if (priceSlider) {
    const maxPrice = Number(priceSlider.value);
    filtered = filtered.filter(cpu => cpu.price <= maxPrice);
  }

  // rating filter
  const ratingCheckboxes = document.querySelectorAll(".filter-section input[type='checkbox']");
  let minRating = 0;
  ratingCheckboxes.forEach((box, idx) => {
    if (box.checked && idx === 0) minRating = Math.max(minRating, 3);
    if (box.checked && idx === 1) minRating = Math.max(minRating, 4);
  });
  filtered = filtered.filter(cpu => cpu.rating >= minRating);

  // search filter
  const searchInput = document.querySelector(".search-input");
  if (searchInput && searchInput.value.trim() !== "") {
    const term = searchInput.value.toLowerCase();
    filtered = filtered.filter(cpu => 
      cpu.title.toLowerCase().includes(term) || 
      (cpu.microarchitecture && cpu.microarchitecture.toLowerCase().includes(term))
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
      case "core-count":
        filtered.sort((a, b) => b.coreCount - a.coreCount);
        break;
      case "performance":
        filtered.sort((a, b) => {
          const freq = str => parseFloat(str.replace("GHz", "")) || 0;
          return freq(b.performanceCoreClock) - freq(a.performanceCoreClock);
        });
        break;
      default:
        break; // recent = default order
    }
  }

  renderCPUs(filtered);
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
