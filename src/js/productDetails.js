// Simple product details functionality
let currentProduct = null;

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
  // Get URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const componentType = urlParams.get('type');
  const productId = urlParams.get('id');
  
  // Try to load selected product; fall back to demo if params missing
  if (componentType && productId) {
    loadSelectedProduct(componentType, productId);
  } else {
    showDemoProduct();
  }
  
  // Initialize basic functionality
  initializeBasicFunctionality();
});

// Show demo product
function showDemoProduct() {
  const demoProduct = {
    title: 'Intel Core i7-12700K',
    price: 299.99,
    rating: 4.2,
    description: '12th Gen Intel Core i7 processor with 12 cores and 20 threads.',
    imageUrl: 'https://via.placeholder.com/400x400?text=CPU+Image'
  };
  
  displayProduct(demoProduct);
}

// Map URL type to Firestore collection name
function mapTypeToCollection(type) {
  const mapping = {
    cpu: 'cpuData',
    gpu: 'gpuData',
    mainboard: 'mainboardData',
    ram: 'ramData',
    storage: 'storageData',
    case: 'caseData',
    power: 'powerSupplyData',
    psu: 'powerSupplyData',
    cpucooler: 'cpuCoolerData',
    cooler: 'cpuCoolerData'
  };
  return mapping[type?.toLowerCase()] || null;
}

// Load selected product from Firestore using URL params
function loadSelectedProduct(componentType, productId) {
  const collectionName = mapTypeToCollection(componentType);
  if (!collectionName) {
    console.warn('Unknown component type:', componentType);
    showDemoProduct();
    return;
  }

  try {
    db.collection(collectionName)
      .doc(productId)
      .get()
      .then((doc) => {
        if (doc.exists) {
          const product = doc.data();
          displayProduct(product);
        } else {
          console.warn('Product not found, showing demo.');
          showDemoProduct();
        }
      })
      .catch((error) => {
        console.error('Error loading product:', error);
        showDemoProduct();
      });
  } catch (e) {
    console.error('Unexpected error loading product:', e);
    showDemoProduct();
  }
}

// Display product information
function displayProduct(product) {
  currentProduct = product;
  
  // Update basic info
  document.getElementById('product-title').textContent = product.title;
  document.getElementById('main-product-image').src = product.imageUrl;
  document.getElementById('current-price').textContent = `$${product.price}`;
  document.getElementById('product-description').innerHTML = `<p>${product.description}</p>`;
  const breadcrumbType = document.getElementById('component-type');
  const breadcrumbName = document.getElementById('product-name');
  if (breadcrumbType) breadcrumbType.textContent = (product.componentType || '').toString() || 'Component';
  if (breadcrumbName) breadcrumbName.textContent = product.title;
  
  // Update rating
  const stars = '★'.repeat(Math.floor(product.rating)) + '☆'.repeat(5 - Math.floor(product.rating));
  document.getElementById('product-stars').textContent = stars;
  document.getElementById('rating-text').textContent = `${product.rating}/5`;
  
  // Update total price
  updateTotalPrice();
}

// Initialize basic functionality
function initializeBasicFunctionality() {
  // Quantity input
  const quantityInput = document.getElementById('quantity');
  quantityInput.addEventListener('input', updateTotalPrice);
  
  // Payment form
  const paymentForm = document.getElementById('payment-form');
  paymentForm.addEventListener('submit', handlePayment);
  
  // Mobile navigation
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function() {
      navMenu.classList.toggle('active');
      navToggle.classList.toggle('active');
    });
  }
}

// Change quantity
function changeQuantity(delta) {
  const quantityInput = document.getElementById('quantity');
  const currentQty = parseInt(quantityInput.value) || 1;
  const newQty = Math.max(1, Math.min(10, currentQty + delta));
  quantityInput.value = newQty;
  updateTotalPrice();
}

// Update total price
function updateTotalPrice() {
  const quantity = parseInt(document.getElementById('quantity').value) || 1;
  const unitPrice = currentProduct?.price || 299.99;
  const total = quantity * unitPrice;
  
  document.getElementById('total-price').textContent = `$${total.toFixed(2)}`;
}

// Show payment form
function showPaymentForm() {
  const modal = document.getElementById('payment-modal');
  modal.style.display = 'block';
  document.body.style.overflow = 'hidden';

  // Populate modal summary with current product
  if (currentProduct) {
    const qty = parseInt(document.getElementById('quantity').value) || 1;
    const unitPrice = currentProduct.price || 0;
    const total = qty * unitPrice;

    const modalImg = document.getElementById('modal-product-image');
    const modalTitle = document.getElementById('modal-product-title');
    const modalSpecs = document.getElementById('modal-product-specs');
    const modalUnitPrice = document.getElementById('modal-unit-price');
    const modalQty = document.getElementById('modal-quantity');
    const modalTotal = document.getElementById('modal-total-price');

    if (modalImg) modalImg.src = currentProduct.imageUrl || '';
    if (modalTitle) modalTitle.textContent = currentProduct.title || 'Product';
    if (modalSpecs) modalSpecs.textContent = currentProduct.description || '';
    if (modalUnitPrice) modalUnitPrice.textContent = `$${unitPrice.toFixed(2)}`;
    if (modalQty) modalQty.textContent = `${qty}`;
    if (modalTotal) modalTotal.textContent = `$${total.toFixed(2)}`;
  }
}

// Close payment form
function closePaymentForm() {
  const modal = document.getElementById('payment-modal');
  modal.style.display = 'none';
  document.body.style.overflow = 'auto';
  document.getElementById('payment-form').reset();
}

// Add to cart
function addToCart() {
  const quantity = parseInt(document.getElementById('quantity').value) || 1;
  
  // Simple cart storage
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  cart.push({
    title: currentProduct?.title || 'Product',
    price: currentProduct?.price || 299.99,
    quantity: quantity
  });
  
  localStorage.setItem('cart', JSON.stringify(cart));
  alert('Product added to cart!');
}

// Handle payment
function handlePayment(event) {
  event.preventDefault();
  
  // Simple validation
  const formData = new FormData(event.target);
  const data = Object.fromEntries(formData.entries());
  
  if (!data.firstName || !data.lastName || !data.email) {
    alert('Please fill in all required fields');
    return;
  }
  
  // Simulate payment processing
  alert('Payment processing...');
  
  setTimeout(() => {
    alert('Payment successful!');
    closePaymentForm();
  }, 2000);
}

// Close modal when clicking outside
window.addEventListener('click', function(event) {
  const modal = document.getElementById('payment-modal');
  if (event.target === modal) {
    closePaymentForm();
  }
});

// Close modal with Escape key
document.addEventListener('keydown', function(event) {
  if (event.key === 'Escape') {
    closePaymentForm();
  }
});
