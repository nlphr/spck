const product_list = document.getElementById('storage-product-list');
let allStorage = []; // store fetched data

function renderStorage(storageItems) {
  let htmls = "";
  storageItems.forEach((storageData) => {
    const formattedPrice = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(storageData.price);

    htmls += `
      <div class="product-row">
        <div class="col-image">
          <img src="${storageData.imageUrl}" alt="${storageData.title}">
        </div>
        <div class="col-name"><h4 class="product-title">${storageData.title}</h4></div>
        <div class="col-capacity"><span class="data-value">${storageData.capacity}</span></div>
        <div class="col-type"><span class="data-value">${storageData.type}</span></div>
        <div class="col-form-factor"><span class="data-value">${storageData.formFactor}</span></div>
        <div class="col-interface"><span class="data-value">${storageData.interface}</span></div>
        <div class="col-rating">
          <div class="rating-stars">${"★".repeat(Math.max(0, Math.floor(storageData.rating || 0)))}${"☆".repeat(Math.max(0, 5 - Math.floor(storageData.rating || 0)))}</div>
          <span class="rating-text">${storageData.rating || 0}/5</span>
        </div>
        <div class="col-price">
          <span class="price-value">${formattedPrice}</span>
          <button class="add-to-cart-btn" onclick="window.location.href='productDetails.html?type=storage&id=${storageData.id}'">Buy</button>
        </div>
      </div>
    `;
  });
  product_list.innerHTML = htmls || `<div class="no-products"><p>No Storage devices match your filters.</p></div>`;
}

function displayStorage() {
  db.collection("storageData").get().then((querySnapshot) => {
    allStorage = [];
    querySnapshot.forEach((doc) => allStorage.push({ id: doc.id, ...doc.data() }));
    renderStorage(allStorage);
  }).catch((error) => {
    product_list.innerHTML = `<div class="error-message"><p>Error fetching Storage data: ${error.message}</p></div>`;
    console.error("Error fetching Storage data:", error);
  });
}

// ====== FILTER + SORT + SEARCH LOGIC ======
function applyFiltersAndSort() {
  let filtered = [...allStorage];

  // price filter
  const priceSlider = document.getElementById("priceSlider");
  if (priceSlider) {
    const maxPrice = Number(priceSlider.value);
    filtered = filtered.filter(storage => storage.price <= maxPrice);
  }

  // rating filter
  const ratingCheckboxes = document.querySelectorAll(".filter-section input[type='checkbox']");
  let minRating = 0;
  ratingCheckboxes.forEach((box, idx) => {
    if (box.checked && idx === 0) minRating = Math.max(minRating, 3);
    if (box.checked && idx === 1) minRating = Math.max(minRating, 4);
  });
  filtered = filtered.filter(storage => storage.rating >= minRating);

  // search filter
  const searchInput = document.querySelector(".search-input");
  if (searchInput && searchInput.value.trim() !== "") {
    const term = searchInput.value.toLowerCase();
    filtered = filtered.filter(storage => 
      storage.title.toLowerCase().includes(term) || 
      (storage.type && storage.type.toLowerCase().includes(term)) ||
      (storage.capacity && storage.capacity.toLowerCase().includes(term))
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
      case "capacity":
        filtered.sort((a, b) => {
          const capA = parseInt(a.capacity) || 0;
          const capB = parseInt(b.capacity) || 0;
          return capB - capA; // Higher capacity is better
        });
        break;
      case "type":
        filtered.sort((a, b) => a.type.localeCompare(b.type));
        break;
      case "performance":
        filtered.sort((a, b) => {
          // SSD > HDD for performance
          const typeA = a.type.toLowerCase();
          const typeB = b.type.toLowerCase();
          if (typeA.includes('ssd') && !typeB.includes('ssd')) return -1;
          if (!typeA.includes('ssd') && typeB.includes('ssd')) return 1;
          return 0;
        });
        break;
      default:
        break; // recent = default order
    }
  }

  renderStorage(filtered);
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
displayStorage();