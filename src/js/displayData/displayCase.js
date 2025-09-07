const product_list = document.getElementById('case-product-list');
let allCases = []; // store fetched data

function renderCases(cases) {
  let htmls = "";
  cases.forEach((caseData) => {
    const formattedPrice = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(caseData.price);

    htmls += `
      <div class="product-row">
        <div class="col-image">
          <img src="${caseData.imageUrl}" alt="${caseData.title}">
        </div>
        <div class="col-name"><h4 class="product-title">${caseData.title}</h4></div>
        <div class="col-type"><span class="data-value">${caseData.type}</span></div>
        <div class="col-form-factor"><span class="data-value">${caseData.formFactor}</span></div>
        <div class="col-side-panel"><span class="data-value">${caseData.sidePanel}</span></div>
        <div class="col-volume"><span class="data-value">${caseData.externalVolume}</span></div>
        <div class="col-rating">
          <div class="rating-stars">${"★".repeat(Math.max(0, Math.floor(caseData.rating || 0)))}${"☆".repeat(Math.max(0, 5 - Math.floor(caseData.rating || 0)))}</div>
          <span class="rating-text">${caseData.rating || 0}/5</span>
        </div>
        <div class="col-price">
          <span class="price-value">${formattedPrice}</span>
          <button class="add-to-cart-btn" onclick="window.location.href='productDetails.html?type=case&id=${caseData.id}'">Buy</button>
        </div>
      </div>
    `;
  });
  product_list.innerHTML = htmls || `<div class="no-products"><p>No Cases match your filters.</p></div>`;
}

function displayCase() {
  db.collection("caseData").get().then((querySnapshot) => {
    allCases = [];
    querySnapshot.forEach((doc) => allCases.push({ id: doc.id, ...doc.data() }));
    renderCases(allCases);
  }).catch((error) => {
    product_list.innerHTML = `<div class="error-message"><p>Error fetching Case data: ${error.message}</p></div>`;
    console.error("Error fetching Case data:", error);
  });
}

// ====== FILTER + SORT + SEARCH LOGIC ======
function applyFiltersAndSort() {
  let filtered = [...allCases];

  // price filter
  const priceSlider = document.getElementById("priceSlider");
  if (priceSlider) {
    const maxPrice = Number(priceSlider.value);
    filtered = filtered.filter(caseItem => caseItem.price <= maxPrice);
  }

  // rating filter
  const ratingCheckboxes = document.querySelectorAll(".filter-section input[type='checkbox']");
  let minRating = 0;
  ratingCheckboxes.forEach((box, idx) => {
    if (box.checked && idx === 0) minRating = Math.max(minRating, 3);
    if (box.checked && idx === 1) minRating = Math.max(minRating, 4);
  });
  filtered = filtered.filter(caseItem => caseItem.rating >= minRating);

  // search filter
  const searchInput = document.querySelector(".search-input");
  if (searchInput && searchInput.value.trim() !== "") {
    const term = searchInput.value.toLowerCase();
    filtered = filtered.filter(caseItem => 
      caseItem.title.toLowerCase().includes(term) || 
      (caseItem.type && caseItem.type.toLowerCase().includes(term)) ||
      (caseItem.formFactor && caseItem.formFactor.toLowerCase().includes(term))
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
      case "type":
        filtered.sort((a, b) => a.type.localeCompare(b.type));
        break;
      case "form-factor":
        filtered.sort((a, b) => a.formFactor.localeCompare(b.formFactor));
        break;
      case "performance":
        filtered.sort((a, b) => {
          const volA = parseFloat(a.externalVolume) || 0;
          const volB = parseFloat(b.externalVolume) || 0;
          return volB - volA; // Larger volume = better
        });
        break;
      default:
        break; // recent = default order
    }
  }

  renderCases(filtered);
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
displayCase();

