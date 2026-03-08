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
  // ── Fashion ───────────────────────────────────────────────────────────────
  { id: 1,  name: 'Urban Slim Fit Jacket',           category: 'men',         price: 89,  rating: 4.7, reviews: 124, badge: 'Bestseller', emoji: '🧥', desc: 'Premium slim-fit jacket with water-resistant coating. Perfect for city commutes and casual outings.' },
  { id: 2,  name: 'Wireless Noise-Cancel Headphones',category: 'electronics', price: 149, rating: 4.9, reviews: 312, badge: 'Hot',        emoji: '🎧', desc: 'Over-ear headphones with 40-hour battery life, active noise cancellation and hi-fi sound.' },
  { id: 3,  name: 'Floral Maxi Dress',               category: 'women',       price: 62,  rating: 4.6, reviews: 98,  badge: 'New',        emoji: '👗', desc: 'Lightweight floral-print maxi dress in breathable chiffon fabric. Available in 6 colours.' },
  { id: 4,  name: 'Smart Watch Pro',                 category: 'electronics', price: 199, rating: 4.8, reviews: 207, badge: 'Hot',        emoji: '⌚', desc: 'Health-tracking smartwatch with GPS, SpO2 monitor, 7-day battery and always-on AMOLED display.' },
  { id: 5,  name: 'Leather Crossbody Bag',           category: 'accessories', price: 75,  rating: 4.5, reviews: 176, badge: 'New',        emoji: '👜', desc: 'Genuine leather crossbody bag with adjustable strap and RFID-blocking card slots.' },
  { id: 6,  name: 'Cargo Utility Pants',             category: 'men',         price: 55,  rating: 4.4, reviews: 89,  badge: null,         emoji: '👖', desc: 'Durable stretch-canvas cargo pants with 8 pockets and reinforced knee panels.' },
  { id: 7,  name: 'TWS Bluetooth Earbuds',           category: 'electronics', price: 59,  rating: 4.7, reviews: 445, badge: 'Bestseller', emoji: '🎵', desc: 'True wireless earbuds with 6-hour playtime, IPX5 waterproof rating and fast-charge case.' },
  { id: 8,  name: 'Silk Wrap Blouse',                category: 'women',       price: 48,  rating: 4.5, reviews: 64,  badge: null,         emoji: '👚', desc: 'Elegant wrap-style blouse in pure silk blend — effortlessly transitions from desk to dinner.' },
  { id: 9,  name: 'Polarized Sunglasses',            category: 'accessories', price: 35,  rating: 4.3, reviews: 220, badge: null,         emoji: '🕶️', desc: 'UV400 polarized lenses in a lightweight TR90 frame. Includes hard case and cleaning cloth.' },
  { id: 10, name: 'Portable Power Bank 20K',         category: 'electronics', price: 45,  rating: 4.8, reviews: 531, badge: 'Bestseller', emoji: '🔋', desc: '20,000 mAh power bank with 65W USB-C PD fast charging — powers a laptop twice over.' },
  { id: 11, name: 'Boho Midi Skirt',                 category: 'women',       price: 39,  rating: 4.4, reviews: 77,  badge: 'New',        emoji: '👘', desc: 'Tiered boho midi skirt in crinkle cotton — free-spirited style with a flattering silhouette.' },
  { id: 12, name: 'Classic Oxford Sneakers',         category: 'men',         price: 95,  rating: 4.6, reviews: 142, badge: null,         emoji: '👟', desc: 'Vulcanised rubber sole sneakers with premium canvas upper — clean, minimal design.' },

  // ── Fitness & Strength Training ───────────────────────────────────────────
  { id: 13, name: 'Power Wrist Strength Exerciser',  category: 'fitness',     price: 22,  rating: 4.6, reviews: 312, badge: 'New',        emoji: '💪', desc: 'Compact wrist and forearm exerciser for grip and rotational strength. Adjustable resistance for all levels.', source: 'https://www.alibaba.com/product-detail/Power-Wrists-Exerciser-for-Strength-Training_1601417584485.html' },
  { id: 14, name: 'Multi-Function Pull Down Station',category: 'fitness',     price: 249, rating: 4.8, reviews: 178, badge: 'Hot',        emoji: '🏋️', desc: 'Commercial-grade lat pull-down and cable row machine with 11 adjustable positions and 200 lb weight stack.', source: 'https://www.alibaba.com/product-detail/Strength-Training-Gym-Pull-Down-Multi_1601628143749.html' },
  { id: 15, name: 'VBT Linear Encoder Sensor',       category: 'fitness',     price: 115, rating: 4.7, reviews: 94,  badge: 'New',        emoji: '📡', desc: 'Velocity-Based Training sensor that tracks bar speed in real-time to identify whether you\'re training for power, strength, or hypertrophy.' },
  { id: 16, name: 'Pneumatic BFR Training Cuffs',    category: 'fitness',     price: 58,  rating: 4.5, reviews: 137, badge: null,         emoji: '🩹', desc: 'Integrated-pump blood flow restriction cuffs for occlusion training. Triggers maximum muscle growth with minimal load on joints.' },
  { id: 17, name: 'Silicone Finger Extensor Trainer',category: 'fitness',     price: 14,  rating: 4.4, reviews: 523, badge: 'Bestseller', emoji: '🖐️', desc: 'Honeycomb silicone resistance rings that train the often-neglected extensor muscles — prevents tennis elbow and improves hand balance.' },
  { id: 18, name: '360° Rotating Cable Handles',     category: 'fitness',     price: 42,  rating: 4.8, reviews: 289, badge: 'Hot',        emoji: '🔄', desc: 'Professional rotating turret D-handles with full 360° swivel — eliminates joint strain common with fixed-angle cable attachments.' },
  { id: 19, name: 'Digital Hand Dynamometer 180kg',  category: 'fitness',     price: 72,  rating: 4.7, reviews: 156, badge: null,         emoji: '✊', desc: 'High-precision 180kg / 396lb grip strength meter. Tracks CNS recovery — a 10%+ drop signals the body hasn\'t recovered from the last session.' },
  { id: 20, name: 'Hook Grip Weightlifting Tape',    category: 'fitness',     price: 12,  rating: 4.6, reviews: 841, badge: 'Bestseller', emoji: '🤚', desc: 'Flexible EAB (Elastic Adhesive Bandage) thumb tape purpose-built for Olympic lifting hook grip. Far superior to stiff athletic tape.' },
  { id: 21, name: 'Electric Vacuum Callus Shaver',   category: 'fitness',     price: 45,  rating: 4.5, reviews: 203, badge: null,         emoji: '⚡', desc: 'High-torque electric callus remover with built-in vacuum to capture skin dust — essential palm maintenance for heavy lifters.' },
  { id: 22, name: 'Aluminum Alloy Arm Blaster',      category: 'fitness',     price: 35,  rating: 4.7, reviews: 418, badge: 'New',        emoji: '🦾', desc: 'CNC-machined aluminium arm blaster that locks elbows in place during curls — removes all momentum and forces strict bicep isolation.' },
  { id: 23, name: 'Antibacterial Liquid Gym Chalk',  category: 'fitness',     price: 18,  rating: 4.8, reviews: 672, badge: 'Hot',        emoji: '🤲', desc: '70%+ alcohol quick-dry liquid chalk that delivers superior grip while sanitising hands. Replaces messy dry chalk blocks entirely.' },
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

  const categoryLabels = {
    men: "Men's Fashion", women: "Women's Fashion",
    electronics: 'Electronics', accessories: 'Accessories',
    fitness: 'Fitness & Strength'
  };
  const categoryLabel = categoryLabels[product.category] || product.category;
  const sourceLink = product.source
    ? `<a href="${product.source}" target="_blank" rel="noopener" class="text-xs text-accent hover:underline mt-1 inline-block">View on Alibaba →</a>`
    : '';

  // Detect if we're in the pages/ subdirectory or root
  const isSubPage = window.location.pathname.includes('/pages/');
  const productPageBase = isSubPage ? 'product.html' : 'pages/product.html';

  return `
    <div class="product-card bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl border border-gray-100">
      <a href="${productPageBase}?id=${product.id}" class="block">
        <div class="relative bg-gradient-to-br from-gray-100 to-gray-50 h-48 flex items-center justify-center text-7xl select-none">
          ${product.emoji}
          ${badgeHTML}
        </div>
      </a>
      <div class="p-5">
        <div class="flex items-start justify-between mb-1">
          <p class="text-xs text-gray-400 uppercase tracking-wide">${categoryLabel}</p>
          <button class="wishlist-btn text-gray-300 hover:text-red-500 transition text-lg leading-none" data-id="${product.id}" aria-label="Add to wishlist">♡</button>
        </div>
        <a href="${productPageBase}?id=${product.id}" class="block hover:text-accent transition">
          <h3 class="font-semibold text-gray-800 text-sm leading-snug mb-2">${product.name}</h3>
        </a>
        ${product.desc ? `<p class="text-xs text-gray-500 leading-relaxed mb-2 line-clamp-2">${product.desc}</p>` : ''}
        <div class="flex items-center gap-1 mb-3">
          <span class="stars text-sm">${'★'.repeat(Math.floor(product.rating))}</span>
          <span class="text-xs text-gray-400">${product.rating} (${product.reviews})</span>
        </div>
        <div class="flex items-center justify-between mt-2">
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
  const featured = PRODUCTS.filter(p => p.category !== 'fitness').slice(0, 8);
  productGrid.innerHTML = featured.map(renderProductCard).join('');
  bindCartButtons(productGrid);
  bindWishlistButtons(productGrid);
}

/* ─── Render fitness spotlight on homepage ─── */
const fitnessGrid = document.getElementById('fitness-grid');
if (fitnessGrid) {
  const fitnessProducts = PRODUCTS.filter(p => p.category === 'fitness').slice(0, 4);
  fitnessGrid.innerHTML = fitnessProducts.map(p => renderProductCard(p, true)).join('');
  bindCartButtons(fitnessGrid);
  bindWishlistButtons(fitnessGrid);
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
