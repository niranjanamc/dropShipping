// TrendDrop – main.js
// Shared functionality across all pages

/* ─── Mobile menu toggle ─── */
const menuBtn = document.getElementById('menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
if (menuBtn && mobileMenu) {
  menuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
  });
}

/* ─── Product data ─── */
const PRODUCTS = [
  { id: 1, name: 'Urban Slim Fit Jacket',      category: 'men',         price: 89,  rating: 4.7, reviews: 124, badge: 'Bestseller', emoji: '🧥' },
  { id: 2, name: 'Wireless Noise-Cancel Headphones', category: 'electronics', price: 149, rating: 4.9, reviews: 312, badge: 'Hot',        emoji: '🎧' },
  { id: 3, name: 'Floral Maxi Dress',          category: 'women',       price: 62,  rating: 4.6, reviews: 98,  badge: 'New',        emoji: '👗' },
  { id: 4, name: 'Smart Watch Pro',             category: 'electronics', price: 199, rating: 4.8, reviews: 207, badge: 'Hot',        emoji: '⌚' },
  { id: 5, name: 'Leather Crossbody Bag',       category: 'accessories', price: 75,  rating: 4.5, reviews: 176, badge: 'New',        emoji: '👜' },
  { id: 6, name: 'Cargo Utility Pants',         category: 'men',         price: 55,  rating: 4.4, reviews: 89,  badge: null,         emoji: '👖' },
  { id: 7, name: 'TWS Bluetooth Earbuds',       category: 'electronics', price: 59,  rating: 4.7, reviews: 445, badge: 'Bestseller', emoji: '🎵' },
  { id: 8, name: 'Silk Wrap Blouse',            category: 'women',       price: 48,  rating: 4.5, reviews: 64,  badge: null,         emoji: '👚' },
  { id: 9, name: 'Polarized Sunglasses',        category: 'accessories', price: 35,  rating: 4.3, reviews: 220, badge: null,         emoji: '🕶️' },
  { id: 10, name: 'Portable Power Bank 20K',   category: 'electronics', price: 45,  rating: 4.8, reviews: 531, badge: 'Bestseller', emoji: '🔋' },
  { id: 11, name: 'Boho Midi Skirt',            category: 'women',       price: 39,  rating: 4.4, reviews: 77,  badge: 'New',        emoji: '👘' },
  { id: 12, name: 'Classic Oxford Sneakers',    category: 'men',         price: 95,  rating: 4.6, reviews: 142, badge: null,         emoji: '👟' },
];

/* ─── Render product card ─── */
function renderProductCard(product) {
  const badgeColors = {
    'Bestseller': 'bg-yellow-400 text-yellow-900',
    'Hot':        'bg-red-500 text-white badge-new',
    'New':        'bg-green-500 text-white',
  };
  const badgeHTML = product.badge
    ? `<span class="absolute top-3 left-3 text-xs font-bold px-2 py-1 rounded-full ${badgeColors[product.badge] || 'bg-gray-200'}">${product.badge}</span>`
    : '';

  const stars = '★'.repeat(Math.floor(product.rating)) + (product.rating % 1 >= 0.5 ? '½' : '');

  return `
    <div class="product-card bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl border border-gray-100">
      <div class="relative bg-gradient-to-br from-gray-100 to-gray-50 h-48 flex items-center justify-center text-7xl select-none">
        ${product.emoji}
        ${badgeHTML}
        <button class="wishlist-btn absolute top-3 right-3 text-gray-300 hover:text-red-500 transition text-xl" data-id="${product.id}" aria-label="Add to wishlist">♡</button>
      </div>
      <div class="p-5">
        <p class="text-xs text-gray-400 uppercase tracking-wide mb-1">${product.category}</p>
        <h3 class="font-semibold text-gray-800 text-sm leading-snug mb-2">${product.name}</h3>
        <div class="flex items-center gap-1 mb-3">
          <span class="stars text-sm">${'★'.repeat(Math.floor(product.rating))}</span>
          <span class="text-xs text-gray-400">${product.rating} (${product.reviews})</span>
        </div>
        <div class="flex items-center justify-between">
          <span class="text-lg font-extrabold text-primary">$${product.price}</span>
          <button class="add-to-cart bg-accent hover:bg-red-600 text-white text-xs font-bold px-4 py-2 rounded-full transition" data-id="${product.id}">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  `;
}

/* ─── Render featured products on homepage ─── */
const productGrid = document.getElementById('product-grid');
if (productGrid) {
  const featured = PRODUCTS.slice(0, 8);
  productGrid.innerHTML = featured.map(renderProductCard).join('');
  bindCartButtons(productGrid);
  bindWishlistButtons(productGrid);
}

/* ─── Testimonials ─── */
const testimonials = [
  { name: 'Emily R.',  location: 'New York, NY',   text: 'Amazing quality and super fast shipping! The dress I ordered looks even better in person. Will definitely shop here again.',    rating: 5 },
  { name: 'James K.',  location: 'Los Angeles, CA', text: 'The wireless headphones are incredible. Sound quality is on par with brands costing twice as much. Highly recommend.',       rating: 5 },
  { name: 'Aisha M.',  location: 'Chicago, IL',     text: 'Customer service was so helpful when I had a question about sizing. Received my order in 3 days. Really impressed!',         rating: 5 },
];

const testimonialsEl = document.getElementById('testimonials');
if (testimonialsEl) {
  testimonialsEl.innerHTML = testimonials.map(t => `
    <div class="bg-white rounded-2xl p-7 shadow-md border border-gray-100">
      <div class="stars text-lg mb-3">${'★'.repeat(t.rating)}</div>
      <p class="text-gray-600 text-sm leading-relaxed mb-5 italic">"${t.text}"</p>
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-pink-400 text-white text-sm font-bold flex items-center justify-center">
          ${t.name.charAt(0)}
        </div>
        <div>
          <p class="font-semibold text-sm text-primary">${t.name}</p>
          <p class="text-xs text-gray-400">${t.location}</p>
        </div>
      </div>
    </div>
  `).join('');
}

/* ─── Newsletter form ─── */
const newsletterForm = document.getElementById('newsletter-form');
const newsletterMsg  = document.getElementById('newsletter-msg');
if (newsletterForm) {
  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    newsletterMsg.classList.remove('hidden');
    newsletterForm.reset();
  });
}

/* ─── Mini cart (toast notification) ─── */
let cartCount = 0;

function showToast(message) {
  const existing = document.getElementById('cart-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.id = 'cart-toast';
  toast.className = 'fixed bottom-6 right-6 bg-primary text-white px-6 py-3 rounded-full shadow-xl text-sm font-medium z-50 flex items-center gap-2 fade-in';
  toast.innerHTML = `🛒 ${message}`;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

function bindCartButtons(container) {
  container.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', () => {
      cartCount++;
      const id = parseInt(btn.dataset.id);
      const product = PRODUCTS.find(p => p.id === id);
      showToast(`${product ? product.name : 'Item'} added to cart!`);
    });
  });
}

function bindWishlistButtons(container) {
  container.querySelectorAll('.wishlist-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.textContent = btn.textContent === '♡' ? '♥' : '♡';
      btn.classList.toggle('text-red-500');
    });
  });
}

/* ─── Expose globals ─── */
window.PRODUCTS         = PRODUCTS;
window.renderProductCard = renderProductCard;
window.bindCartButtons   = bindCartButtons;
window.bindWishlistButtons = bindWishlistButtons;
