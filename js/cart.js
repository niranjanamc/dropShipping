// TrendDrop – cart.js
// Cart management using localStorage.
// Loaded on every page. Exposes window.Cart for other scripts.

const CART_KEY = 'trenddrop_cart';

const Cart = {

  /* ── Read / Write ─────────────────────────────────────── */
  get() {
    try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
    catch { return []; }
  },

  save(items) {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
    Cart.updateBadge();
  },

  /* ── Mutations ────────────────────────────────────────── */
  add(item) {
    const items = Cart.get();
    const existing = items.find(i => i.id === item.id);
    if (existing) {
      existing.qty += item.qty || 1;
    } else {
      items.push({ id: item.id, name: item.name, price: item.price, emoji: item.emoji, qty: item.qty || 1 });
    }
    Cart.save(items);
    Cart.showToast(`${item.name} added to cart!`);
  },

  remove(id) {
    Cart.save(Cart.get().filter(i => i.id !== id));
  },

  updateQty(id, qty) {
    const items = Cart.get();
    const item = items.find(i => i.id === id);
    if (item) {
      item.qty = Math.max(1, qty);
      Cart.save(items);
    }
  },

  clear() {
    localStorage.removeItem(CART_KEY);
    Cart.updateBadge();
  },

  /* ── Computed ─────────────────────────────────────────── */
  count() {
    return Cart.get().reduce((sum, i) => sum + i.qty, 0);
  },

  total() {
    return Cart.get().reduce((sum, i) => sum + i.price * i.qty, 0);
  },

  /* ── UI helpers ───────────────────────────────────────── */
  updateBadge() {
    const count = Cart.count();
    document.querySelectorAll('#cart-count').forEach(el => {
      el.textContent = count;
      el.classList.toggle('hidden', count === 0);
    });
  },

  showToast(message) {
    const existing = document.getElementById('cart-toast');
    if (existing) existing.remove();
    const toast = document.createElement('div');
    toast.id = 'cart-toast';
    toast.className = [
      'fixed bottom-6 right-6 bg-primary text-white',
      'px-6 py-3 rounded-full shadow-xl text-sm font-medium z-50',
      'flex items-center gap-2 fade-in'
    ].join(' ');
    toast.innerHTML = `🛒 ${message} — <a href="${Cart._checkoutHref()}" class="underline font-bold">View cart</a>`;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 4000);
  },

  _checkoutHref() {
    // Works from root (index.html) and from pages/ subdirectory
    return window.location.pathname.includes('/pages/')
      ? 'checkout.html'
      : 'pages/checkout.html';
  }
};

// Expose globally
window.Cart = Cart;

// Init badge on every page load
document.addEventListener('DOMContentLoaded', () => Cart.updateBadge());
