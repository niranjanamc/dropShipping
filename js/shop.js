// TrendDrop – shop.js
// Handles filtering, sorting, and rendering on the Shop page

const shopGrid      = document.getElementById('shop-grid');
const resultsCount  = document.getElementById('results-count');
const priceRange    = document.getElementById('price-range');
const priceLabel    = document.getElementById('price-label');
const sortSelect    = document.getElementById('sort-select');

let activeCategories = new Set(['all']);
let maxPrice = 500;
let sortBy   = 'default';

function getFilteredProducts() {
  let products = window.PRODUCTS || [];

  // Category filter
  if (!activeCategories.has('all')) {
    products = products.filter(p => activeCategories.has(p.category));
  }

  // Price filter
  products = products.filter(p => p.price <= maxPrice);

  // Sort
  if (sortBy === 'price-asc')  products = [...products].sort((a, b) => a.price - b.price);
  if (sortBy === 'price-desc') products = [...products].sort((a, b) => b.price - a.price);
  if (sortBy === 'rating')     products = [...products].sort((a, b) => b.rating - a.rating);

  return products;
}

function renderShop() {
  if (!shopGrid) return;
  const products = getFilteredProducts();
  resultsCount.textContent = `Showing ${products.length} product${products.length !== 1 ? 's' : ''}`;
  shopGrid.innerHTML = products.length
    ? products.map(window.renderProductCard).join('')
    : '<p class="text-gray-400 col-span-3 text-center py-16">No products match your filters.</p>';
  window.bindCartButtons(shopGrid);
  window.bindWishlistButtons(shopGrid);
}

// Category checkboxes
document.querySelectorAll('#cat-filters input[type=checkbox]').forEach(cb => {
  cb.addEventListener('change', () => {
    if (cb.value === 'all') {
      activeCategories.clear();
      if (cb.checked) {
        activeCategories.add('all');
        document.querySelectorAll('#cat-filters input:not([value=all])').forEach(c => c.checked = false);
      }
    } else {
      activeCategories.delete('all');
      document.querySelector('#cat-filters input[value=all]').checked = false;
      if (cb.checked) activeCategories.add(cb.value);
      else activeCategories.delete(cb.value);
      if (activeCategories.size === 0) {
        activeCategories.add('all');
        document.querySelector('#cat-filters input[value=all]').checked = true;
      }
    }
    renderShop();
  });
});

// Price slider
if (priceRange) {
  priceRange.addEventListener('input', () => {
    maxPrice = parseInt(priceRange.value);
    priceLabel.textContent = `$${maxPrice}`;
    renderShop();
  });
}

// Sort
if (sortSelect) {
  sortSelect.addEventListener('change', () => {
    sortBy = sortSelect.value;
    renderShop();
  });
}

// Initial render
renderShop();
