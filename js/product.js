// TrendDrop – product.js
// Dynamically renders a product page from data/products.json
// URL: pages/product.html?id=13  OR  pages/product.html?slug=power-wrist-strength-exerciser

const categoryLabels = {
  men: "Men's Fashion", women: "Women's Fashion",
  electronics: 'Electronics', accessories: 'Accessories',
  fitness: 'Fitness & Strength Training'
};

const badgeColors = {
  'Bestseller': 'bg-yellow-400 text-yellow-900',
  'Hot':        'bg-red-500 text-white',
  'New':        'bg-green-500 text-white',
};

/* ─── Get product identifier from URL ─── */
const params = new URLSearchParams(window.location.search);
const productId   = params.get('id')   ? parseInt(params.get('id'))   : null;
const productSlug = params.get('slug') || null;

/* ─── Load products.json ─── */
fetch('../data/products.json')
  .then(r => r.json())
  .then(products => {
    const product = products.find(p =>
      (productId   && p.id   === productId) ||
      (productSlug && p.slug === productSlug)
    );

    document.getElementById('loading').classList.add('hidden');

    if (!product) {
      document.getElementById('not-found').classList.remove('hidden');
      return;
    }

    renderProduct(product, products);
  })
  .catch(() => {
    document.getElementById('loading').innerHTML = '<p class="text-red-400">Failed to load product data.</p>';
  });

/* ─── Render product ─── */
function renderProduct(p, allProducts) {
  // Update page title
  document.title = `${p.name} – TrendDrop`;

  // Breadcrumb
  document.getElementById('breadcrumb-name').textContent = p.name;

  // Main image / emoji placeholder
  const mainImg = document.getElementById('main-image');
  if (p.images && p.images.length > 0) {
    mainImg.innerHTML = `<img src="${p.images[0]}" alt="${p.name}" class="w-full h-full object-contain rounded-3xl p-4"/>`;
    const thumbRow = document.getElementById('thumb-row');
    thumbRow.innerHTML = p.images.map((img, i) => `
      <button onclick="swapImage('${img}')"
        class="w-20 h-20 rounded-xl border-2 ${i === 0 ? 'border-accent' : 'border-gray-200'} overflow-hidden hover:border-accent transition">
        <img src="${img}" alt="View ${i+1}" class="w-full h-full object-cover"/>
      </button>
    `).join('');
  } else {
    mainImg.innerHTML = `<span class="text-9xl select-none">${p.emoji}</span>`;
    document.getElementById('image-hint').textContent =
      '📷 No images yet — upload to Cloudinary and add URLs to data/products.json → images[]';
  }

  // Badge
  if (p.badge) {
    const badge = document.getElementById('product-badge');
    badge.textContent = p.badge;
    badge.className = `text-xs font-bold px-3 py-1 rounded-full ${badgeColors[p.badge] || 'bg-gray-200'}`;
    badge.classList.remove('hidden');
  }

  // Category
  document.getElementById('product-category').textContent =
    `${categoryLabels[p.category] || p.category}  ›  ${p.subcategory || ''}`;

  // Name & description
  document.getElementById('product-name').textContent = p.name;
  document.getElementById('product-short-desc').textContent = p.shortDesc;
  document.getElementById('long-desc').textContent = p.longDesc;

  // Rating
  document.getElementById('product-stars').textContent = '★'.repeat(Math.floor(p.rating)) + (p.rating % 1 >= 0.5 ? '½' : '');
  document.getElementById('product-rating').textContent = p.rating;
  document.getElementById('product-review-count').textContent = `(${p.reviewCount} reviews)`;

  // Price
  document.getElementById('product-price').textContent = `$${p.price}`;
  if (p.comparePrice && p.comparePrice > p.price) {
    document.getElementById('product-compare-price').textContent = `$${p.comparePrice}`;
    const savings = Math.round(((p.comparePrice - p.price) / p.comparePrice) * 100);
    document.getElementById('product-savings').textContent = `Save ${savings}%`;
  }

  // Features
  if (p.features && p.features.length) {
    document.getElementById('product-features').innerHTML = p.features.map(f =>
      `<li class="flex items-start gap-2"><span class="text-accent font-bold mt-0.5">✓</span><span>${f}</span></li>`
    ).join('');
  }

  // Specs table
  if (p.specs && Object.keys(p.specs).length) {
    document.getElementById('specs-body').innerHTML = Object.entries(p.specs).map(([key, val], i) => `
      <tr class="${i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}">
        <td class="px-4 py-3 font-semibold text-gray-700 w-1/3 border border-gray-100">${key}</td>
        <td class="px-4 py-3 text-gray-600 border border-gray-100">${val}</td>
      </tr>
    `).join('');
  }

  // Reviews
  document.getElementById('avg-rating-big').textContent = p.rating;
  document.getElementById('avg-stars').textContent = '★'.repeat(Math.floor(p.rating));
  document.getElementById('total-reviews').textContent = `${p.reviewCount} verified reviews`;

  if (p.reviews && p.reviews.length) {
    document.getElementById('reviews-list').innerHTML = p.reviews.map(r => `
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div class="stars text-base mb-2">${'★'.repeat(r.rating)}</div>
        <p class="text-gray-600 text-sm leading-relaxed italic mb-4">"${r.text}"</p>
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-full bg-gradient-to-br from-accent to-pink-400 text-white text-xs font-bold flex items-center justify-center">
            ${r.author.charAt(0)}
          </div>
          <div>
            <p class="font-semibold text-sm text-primary">${r.author}</p>
            <p class="text-xs text-gray-400">${r.location} · ${formatDate(r.date)}</p>
          </div>
        </div>
      </div>
    `).join('');
  }

  // Supplier section
  if (p.supplier && p.supplier.url) {
    const sec = document.getElementById('supplier-section');
    sec.classList.remove('hidden');
    document.getElementById('supplier-moq').textContent  = p.supplier.moq;
    document.getElementById('supplier-lead').textContent = p.supplier.leadTimeDays;
    document.getElementById('supplier-link').href        = p.supplier.url;
  }

  // Add to cart
  document.getElementById('add-to-cart-btn').addEventListener('click', () => {
    showToast(`${p.name} added to cart!`);
  });

  // Wishlist
  const wishBtn = document.getElementById('wishlist-btn');
  wishBtn.addEventListener('click', () => {
    const active = wishBtn.textContent.trim() === '♥';
    wishBtn.textContent = active ? ' ♡' : '♥';
    wishBtn.classList.toggle('text-accent', !active);
    wishBtn.classList.toggle('border-accent', !active);
  });

  // Related products (same category, excluding current)
  const related = allProducts
    .filter(r => r.category === p.category && r.id !== p.id)
    .slice(0, 4);

  document.getElementById('related-grid').innerHTML = related.map(r => `
    <a href="product.html?id=${r.id}" class="product-card bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl border border-gray-100 block">
      <div class="bg-gradient-to-br from-gray-100 to-gray-50 h-36 flex items-center justify-center text-6xl select-none">${r.emoji}</div>
      <div class="p-4">
        <p class="text-xs text-gray-400 uppercase tracking-wide mb-1">${categoryLabels[r.category] || r.category}</p>
        <h3 class="font-semibold text-gray-800 text-sm leading-snug mb-2">${r.name}</h3>
        <span class="text-lg font-extrabold text-primary">$${r.price}</span>
      </div>
    </a>
  `).join('');

  // Tabs
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => {
        b.classList.remove('border-accent', 'text-accent');
        b.classList.add('border-transparent', 'text-gray-500');
      });
      btn.classList.add('border-accent', 'text-accent');
      btn.classList.remove('border-transparent', 'text-gray-500');
      document.querySelectorAll('.tab-panel').forEach(p => p.classList.add('hidden'));
      document.getElementById(`tab-${btn.dataset.tab}`).classList.remove('hidden');
    });
  });

  // Show content
  document.getElementById('product-content').classList.remove('hidden');
}

/* ─── Helpers ─── */
function swapImage(src) {
  const main = document.getElementById('main-image');
  main.innerHTML = `<img src="${src}" alt="Product" class="w-full h-full object-contain rounded-3xl p-4"/>`;
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function showToast(message) {
  const existing = document.getElementById('cart-toast');
  if (existing) existing.remove();
  const toast = document.createElement('div');
  toast.id = 'cart-toast';
  toast.className = 'fixed bottom-6 right-6 bg-primary text-white px-6 py-3 rounded-full shadow-xl text-sm font-medium z-50 fade-in';
  toast.innerHTML = `🛒 ${message}`;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}
