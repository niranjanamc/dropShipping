// TrendDrop – checkout.js
// Renders the checkout page, validates the form, and sends order emails via EmailJS.
// Later: replace the sendOrderEmails() function body with vendor API calls.

/* ── Initialise EmailJS ───────────────────────────────────────── */
(function () {
  if (typeof emailjs !== 'undefined' && EMAILJS_CONFIG.PUBLIC_KEY !== 'YOUR_EMAILJS_PUBLIC_KEY') {
    emailjs.init({ publicKey: EMAILJS_CONFIG.PUBLIC_KEY });
  }
})();

/* ── DOM refs ─────────────────────────────────────────────────── */
const emptyState     = document.getElementById('empty-cart');
const checkoutLayout = document.getElementById('checkout-layout');
const successState   = document.getElementById('order-success');
const cartItemsList  = document.getElementById('cart-items-list');
const summaryItems   = document.getElementById('summary-items');
const summarySubtotal = document.getElementById('summary-subtotal');
const summaryTotal   = document.getElementById('summary-total');
const placeOrderBtn  = document.getElementById('place-order-btn');
const orderError     = document.getElementById('order-error');
const clearCartBtn   = document.getElementById('clear-cart-btn');

/* ── Generate a readable order ID ────────────────────────────── */
function generateOrderId() {
  const ts   = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `TD-${ts}-${rand}`;
}

/* ── Format cart for email ────────────────────────────────────── */
function formatItemsForEmail(items) {
  return items.map(i =>
    `${i.emoji}  ${i.name}  ×${i.qty}  =  $${(i.price * i.qty).toFixed(2)}`
  ).join('\n');
}

/* ── Build internal fulfillment brief ────────────────────────── */
async function buildFulfillmentBrief(items, customer, orderId) {
  // Load full product data (for supplier details)
  let products = [];
  try {
    const res = await fetch('../data/products.json');
    products = await res.json();
  } catch (_) { /* graceful fallback */ }

  const lines = items.map(item => {
    const full = products.find(p => p.id === item.id);
    const supplier = full && full.supplier ? full.supplier : {};
    return [
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
      `Product : ${item.name}  ×${item.qty}`,
      `Sale Price: $${(item.price * item.qty).toFixed(2)}`,
      supplier.costPriceUSD ? `Cost Price: $${supplier.costPriceUSD} / unit  (margin: $${(item.price - supplier.costPriceUSD).toFixed(2)})` : '',
      supplier.url          ? `Source URL: ${supplier.url}` : '(No source URL — add to products.json)',
      supplier.moq          ? `MOQ: ${supplier.moq} units  |  Lead Time: ${supplier.leadTimeDays} days` : '',
    ].filter(Boolean).join('\n');
  });

  return `
ORDER ID: ${orderId}
Date: ${new Date().toUTCString()}

━━━━━━━━━━━━ CUSTOMER ━━━━━━━━━━━━
Name    : ${customer.firstName} ${customer.lastName}
Email   : ${customer.email}
Phone   : ${customer.phone}

━━━━━━━━━━━━ SHIP TO ━━━━━━━━━━━━━
${customer.firstName} ${customer.lastName}
${customer.address1}
${customer.city}, ${customer.state} ${customer.zip}
${customer.country}

Notes: ${customer.notes || 'None'}

━━━━━━━━━━━━ ITEMS TO ORDER ━━━━━━
${lines.join('\n\n')}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ORDER TOTAL (customer paid): $${(items.reduce((s, i) => s + i.price * i.qty, 0)).toFixed(2)}

ACTION REQUIRED:
1. Log into the supplier site (URLs above)
2. Add items to cart & proceed to checkout
3. Enter the CUSTOMER address above as the shipping address
4. Complete purchase — supplier ships direct to customer
5. Email customer the tracking number once available
`.trim();
}

/* ── Send emails via EmailJS ──────────────────────────────────── */
async function sendOrderEmails(customer, items, orderId, fulfillmentBrief) {
  const isConfigured =
    EMAILJS_CONFIG.PUBLIC_KEY !== 'YOUR_EMAILJS_PUBLIC_KEY' &&
    typeof emailjs !== 'undefined';

  const total = items.reduce((s, i) => s + i.price * i.qty, 0).toFixed(2);
  const itemsSummary = formatItemsForEmail(items);

  // ── Email 1: Customer confirmation ────────────────────────────
  const customerParams = {
    to_email:    customer.email,
    to_name:     `${customer.firstName} ${customer.lastName}`,
    order_id:    orderId,
    order_items: itemsSummary,
    order_total: `$${total}`,
    ship_to:     `${customer.address1}, ${customer.city}, ${customer.state} ${customer.zip}, ${customer.country}`,
    delivery:    STORE_CONFIG.DELIVERY_NOTE,
    store_name:  STORE_CONFIG.STORE_NAME,
    store_url:   STORE_CONFIG.STORE_URL,
    reply_to:    STORE_CONFIG.SUPPORT_EMAIL,
  };

  // ── Email 2: Internal fulfillment brief ───────────────────────
  const internalParams = {
    to_email:   STORE_CONFIG.OWNER_EMAIL,
    to_name:    'TrendDrop Team',
    order_id:   orderId,
    brief:      fulfillmentBrief,
    store_name: STORE_CONFIG.STORE_NAME,
  };

  if (!isConfigured) {
    // Dev mode — log to console so you can verify the data
    console.group(`📦 ORDER ${orderId} — EmailJS not yet configured`);
    console.log('Customer email params:', customerParams);
    console.log('Internal fulfillment brief:\n', fulfillmentBrief);
    console.groupEnd();
    return { ok: true, devMode: true };
  }

  try {
    await emailjs.send(EMAILJS_CONFIG.SERVICE_ID, EMAILJS_CONFIG.CUSTOMER_TEMPLATE_ID, customerParams);
    await emailjs.send(EMAILJS_CONFIG.SERVICE_ID, EMAILJS_CONFIG.INTERNAL_TEMPLATE_ID, internalParams);
    return { ok: true };
  } catch (err) {
    console.error('EmailJS error:', err);
    return { ok: false, error: err };
  }
}

/* ── Render cart items in checkout ───────────────────────────── */
function renderCart() {
  const items = window.Cart.get();

  if (!items.length) {
    emptyState.classList.remove('hidden');
    checkoutLayout.classList.add('hidden');
    return;
  }

  emptyState.classList.add('hidden');
  checkoutLayout.classList.remove('hidden');

  // Cart items list (editable)
  cartItemsList.innerHTML = items.map(item => `
    <div class="flex items-center gap-4 py-3 border-b border-gray-50 last:border-0" id="item-row-${item.id}">
      <span class="text-3xl">${item.emoji}</span>
      <div class="flex-1 min-w-0">
        <p class="font-semibold text-sm text-gray-800 truncate">${item.name}</p>
        <p class="text-xs text-gray-400">$${item.price.toFixed(2)} each</p>
      </div>
      <div class="flex items-center gap-2">
        <button onclick="changeQty(${item.id}, ${item.qty - 1})"
          class="w-7 h-7 rounded-full border border-gray-200 hover:border-accent hover:text-accent transition text-sm font-bold flex items-center justify-center">−</button>
        <span class="w-6 text-center text-sm font-bold" id="qty-${item.id}">${item.qty}</span>
        <button onclick="changeQty(${item.id}, ${item.qty + 1})"
          class="w-7 h-7 rounded-full border border-gray-200 hover:border-accent hover:text-accent transition text-sm font-bold flex items-center justify-center">+</button>
      </div>
      <span class="font-bold text-primary text-sm w-16 text-right" id="line-total-${item.id}">
        $${(item.price * item.qty).toFixed(2)}
      </span>
      <button onclick="removeItem(${item.id})" class="text-gray-300 hover:text-red-500 transition text-lg ml-1" aria-label="Remove">✕</button>
    </div>
  `).join('');

  // Order summary sidebar
  const subtotal = window.Cart.total();
  const shipping = subtotal >= 50 ? 0 : 9.99;
  const total    = subtotal + shipping;

  summaryItems.innerHTML = items.map(item => `
    <div class="flex justify-between text-sm">
      <span class="text-gray-600 truncate mr-2">${item.emoji} ${item.name} ×${item.qty}</span>
      <span class="font-semibold whitespace-nowrap">$${(item.price * item.qty).toFixed(2)}</span>
    </div>
  `).join('');

  summarySubtotal.textContent = `$${subtotal.toFixed(2)}`;
  document.getElementById('summary-shipping').textContent = shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`;
  summaryTotal.textContent = `$${total.toFixed(2)}`;
}

/* ── Cart item controls ───────────────────────────────────────── */
window.changeQty = function (id, newQty) {
  if (newQty < 1) { removeItem(id); return; }
  window.Cart.updateQty(id, newQty);
  renderCart();
};

window.removeItem = function (id) {
  window.Cart.remove(id);
  renderCart();
};

clearCartBtn && clearCartBtn.addEventListener('click', () => {
  if (confirm('Remove all items from your cart?')) {
    window.Cart.clear();
    renderCart();
  }
});

/* ── Place Order ──────────────────────────────────────────────── */
placeOrderBtn && placeOrderBtn.addEventListener('click', async () => {
  const items = window.Cart.get();
  if (!items.length) return;

  // Collect form values
  const customer = {
    firstName: document.getElementById('first-name').value.trim(),
    lastName:  document.getElementById('last-name').value.trim(),
    email:     document.getElementById('email').value.trim(),
    phone:     document.getElementById('phone').value.trim(),
    address1:  document.getElementById('address1').value.trim(),
    city:      document.getElementById('city').value.trim(),
    state:     document.getElementById('state').value.trim(),
    zip:       document.getElementById('zip').value.trim(),
    country:   document.getElementById('country').value,
    notes:     document.getElementById('notes').value.trim(),
  };

  // Validate required fields
  const missing = Object.entries(customer)
    .filter(([k, v]) => k !== 'notes' && !v)
    .map(([k]) => k);

  if (missing.length) {
    orderError.textContent = 'Please fill in all required fields.';
    orderError.classList.remove('hidden');
    document.getElementById('order-form').scrollIntoView({ behavior: 'smooth' });
    return;
  }

  orderError.classList.add('hidden');

  // Disable button and show loading
  placeOrderBtn.disabled = true;
  placeOrderBtn.textContent = 'Placing order…';
  placeOrderBtn.classList.add('opacity-75', 'cursor-not-allowed');

  const orderId = generateOrderId();
  const brief   = await buildFulfillmentBrief(items, customer, orderId);
  const result  = await sendOrderEmails(customer, items, orderId, brief);

  if (result.ok) {
    window.Cart.clear();
    // Show success state
    checkoutLayout.classList.add('hidden');
    successState.classList.remove('hidden');
    document.getElementById('success-name').textContent    = customer.firstName;
    document.getElementById('success-order-id').textContent = orderId;
    document.getElementById('success-email').textContent   = customer.email;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else {
    placeOrderBtn.disabled = false;
    placeOrderBtn.textContent = 'Place Order';
    placeOrderBtn.classList.remove('opacity-75', 'cursor-not-allowed');
    orderError.textContent = 'Something went wrong sending your order. Please try again or contact support.';
    orderError.classList.remove('hidden');
  }
});

/* ── Init ─────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', renderCart);
