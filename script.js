/**
 * script.js — ShopEase E-Commerce Website
 * Course : SEC035 Web Programming with Python & JS Lab
 * Author : [Your Name Here]
 *
 * Tasks covered:
 *  Task 2 — Product listing (rendered from data array)
 *  Task 3 — CSS handled in style.css
 *  Task 4 — Shopping cart: add / remove / qty update
 *  Task 5 — Price calculations (subtotal, shipping, total)
 *  Task 6 — Checkout form + confirmation modal
 *  Task 7 — Qty +/- buttons, localStorage persistence, hover effects
 */

"use strict";

/* ════════════════════════════════════════════════════════════
   TASK 2 — PRODUCT DATA
   ════════════════════════════════════════════════════════════ */
const PRODUCTS = [
  {
    id: 1, emoji: "🎧", name: "Wireless Headphones",
    category: "electronics",
    desc: "Active noise cancellation, 30-hr battery, premium sound quality.",
    price: 2499, oldPrice: 3499, discount: 29, rating: 4.8, reviews: 1240,
    badge: "hot"
  },
  {
    id: 2, emoji: "📱", name: "Smart Phone Stand",
    category: "accessories",
    desc: "Adjustable aluminium stand, 360° rotation, fits all devices.",
    price: 449, oldPrice: 699, discount: 36, rating: 4.5, reviews: 892,
    badge: "sale"
  },
  {
    id: 3, emoji: "👟", name: "Running Shoes",
    category: "sports",
    desc: "Lightweight mesh upper, responsive cushioning, anti-slip sole.",
    price: 1799, oldPrice: 2499, discount: 28, rating: 4.7, reviews: 2103,
    badge: "new"
  },
  {
    id: 4, emoji: "⌚", name: "Smart Watch Pro",
    category: "electronics",
    desc: "Health monitoring, GPS, AMOLED display, 7-day battery life.",
    price: 3299, oldPrice: 4999, discount: 34, rating: 4.9, reviews: 3456,
    badge: "hot"
  },
  {
    id: 5, emoji: "👕", name: "Classic Cotton T-Shirt",
    category: "fashion",
    desc: "100% organic cotton, breathable fabric, relaxed fit.",
    price: 599, oldPrice: 899, discount: 33, rating: 4.4, reviews: 567,
    badge: ""
  },
  {
    id: 6, emoji: "🎒", name: "Laptop Backpack",
    category: "accessories",
    desc: "Fits 15.6\" laptops, USB charging port, water-resistant.",
    price: 1299, oldPrice: 1999, discount: 35, rating: 4.6, reviews: 780,
    badge: "new"
  },
  {
    id: 7, emoji: "💡", name: "Smart LED Bulb",
    category: "home",
    desc: "16M colours, voice control compatible, 20W energy saving.",
    price: 349, oldPrice: 499, discount: 30, rating: 4.3, reviews: 412,
    badge: ""
  },
  {
    id: 8, emoji: "🏋️", name: "Resistance Bands Set",
    category: "sports",
    desc: "5-piece set, varying resistance levels, includes carry bag.",
    price: 799, oldPrice: 1199, discount: 33, rating: 4.6, reviews: 934,
    badge: "sale"
  },
  {
    id: 9, emoji: "☕", name: "Stainless Steel Mug",
    category: "home",
    desc: "Double-wall insulated, keeps hot 12hr / cold 24hr, 450ml.",
    price: 649, oldPrice: 999, discount: 35, rating: 4.7, reviews: 1120,
    badge: "new"
  },
  {
    id: 10, emoji: "🕶️", name: "Polarized Sunglasses",
    category: "fashion",
    desc: "UV400 protection, lightweight frame, unisex design.",
    price: 899, oldPrice: 1499, discount: 40, rating: 4.5, reviews: 645,
    badge: "sale"
  },
  {
    id: 11, emoji: "🖥️", name: "Monitor Light Bar",
    category: "electronics",
    desc: "Auto-dimming, USB powered, no screen glare, touch controls.",
    price: 1099, oldPrice: 1699, discount: 35, rating: 4.8, reviews: 523,
    badge: ""
  },
  {
    id: 12, emoji: "🛋️", name: "Lumbar Support Cushion",
    category: "home",
    desc: "Memory foam, ergonomic design, adjustable strap for all chairs.",
    price: 849, oldPrice: 1299, discount: 35, rating: 4.5, reviews: 788,
    badge: ""
  }
];

/* ════════════════════════════════════════════════════════════
   CART STATE
   Task 7 (Bonus) — persist cart in localStorage
   ════════════════════════════════════════════════════════════ */
const SHIPPING_COST      = 99;    // ₹ flat shipping
const FREE_SHIP_THRESHOLD = 999;  // free shipping above this amount

// Load cart from localStorage or start empty
let cart = loadCart();

/* ─── localStorage helpers ─── */
function saveCart() {
  localStorage.setItem("shopease_cart", JSON.stringify(cart));
}
function loadCart() {
  try {
    return JSON.parse(localStorage.getItem("shopease_cart")) || [];
  } catch { return []; }
}

/* ════════════════════════════════════════════════════════════
   RENDER PRODUCT CARDS
   Task 2 — grid layout, Task 3 — styling in CSS
   ════════════════════════════════════════════════════════════ */
function renderProducts(filtered) {
  const grid = document.getElementById("products-grid");
  if (!grid) return;

  if (filtered.length === 0) {
    grid.innerHTML = `<p style="color:var(--text-muted);padding:2rem 0">No products found for this category.</p>`;
    return;
  }

  grid.innerHTML = filtered.map((p, i) => `
    <article class="product-card" style="animation-delay:${i * 0.06}s" data-id="${p.id}" data-category="${p.category}">
      <div class="product-img-area">
        ${p.badge ? `<span class="badge badge-${p.badge}">${p.badge.toUpperCase()}</span>` : ""}
        <span>${p.emoji}</span>
        <div class="card-actions-top">
          <button class="card-icon-btn" title="Wishlist" aria-label="Add to wishlist">♡</button>
          <button class="card-icon-btn" title="Quick View" aria-label="Quick view">👁</button>
        </div>
      </div>
      <div class="product-body">
        <p class="product-category">${p.category}</p>
        <h3 class="product-name">${p.name}</h3>
        <p class="product-desc">${p.desc}</p>
        <div class="product-rating">
          ${"★".repeat(Math.round(p.rating))}${"☆".repeat(5 - Math.round(p.rating))}
          <span>(${p.reviews.toLocaleString()})</span>
        </div>
        <div class="product-price-row">
          <span class="product-price">₹${p.price.toLocaleString()}</span>
          <span class="product-price-old">₹${p.oldPrice.toLocaleString()}</span>
          <span class="product-discount">${p.discount}% off</span>
        </div>
      </div>
      <div class="product-footer">
        <button class="btn-add-cart" onclick="addToCart(${p.id})" id="btn-${p.id}">
          🛒 Add to Cart
        </button>
      </div>
    </article>
  `).join("");

  // Re-highlight buttons for items already in cart
  cart.forEach(item => highlightCartBtn(item.id));
}

/* ════════════════════════════════════════════════════════════
   TASK 4 — ADD / REMOVE FROM CART
   ════════════════════════════════════════════════════════════ */
function addToCart(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  const existing = cart.find(c => c.id === productId);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ id: product.id, name: product.name, emoji: product.emoji, price: product.price, qty: 1 });
  }

  saveCart();
  highlightCartBtn(productId);
  updateCartBadge();
  renderCart();
  renderCheckoutPreview();
  showToast(`🛒 "${product.name}" added to cart!`);
}

function removeFromCart(productId) {
  const item = cart.find(c => c.id === productId);
  const name = item ? item.name : "Item";
  cart = cart.filter(c => c.id !== productId);
  saveCart();
  resetCartBtn(productId);
  updateCartBadge();
  renderCart();
  renderCheckoutPreview();
  showToast(`🗑 "${name}" removed.`, "toast-error");
}

/* ─── Task 7 — Qty +/- buttons ─── */
function changeQty(productId, delta) {
  const item = cart.find(c => c.id === productId);
  if (!item) return;

  item.qty += delta;
  if (item.qty <= 0) {
    removeFromCart(productId);
    return;
  }
  saveCart();
  renderCart();
  renderCheckoutPreview();
}

function clearCart() {
  if (cart.length === 0) return;
  if (!confirm("Clear all items from your cart?")) return;
  cart = [];
  saveCart();
  // Reset all add-to-cart buttons
  PRODUCTS.forEach(p => resetCartBtn(p.id));
  updateCartBadge();
  renderCart();
  renderCheckoutPreview();
  showToast("🗑 Cart cleared.");
}

/* ─── Visual helpers ─── */
function highlightCartBtn(productId) {
  const btn = document.getElementById(`btn-${productId}`);
  if (btn) {
    btn.textContent = "✔ In Cart";
    btn.classList.add("added");
  }
}
function resetCartBtn(productId) {
  const btn = document.getElementById(`btn-${productId}`);
  if (btn) {
    btn.textContent = "🛒 Add to Cart";
    btn.classList.remove("added");
  }
}
function updateCartBadge() {
  const badge = document.getElementById("cart-badge");
  if (!badge) return;
  const total = cart.reduce((s, c) => s + c.qty, 0);
  badge.textContent = total;
  badge.classList.add("bump");
  setTimeout(() => badge.classList.remove("bump"), 300);
}

/* ════════════════════════════════════════════════════════════
   TASK 4 & 5 — RENDER CART + PRICE CALCULATION
   ════════════════════════════════════════════════════════════ */
function renderCart() {
  const emptyMsg  = document.getElementById("cart-empty-msg");
  const list      = document.getElementById("cart-items-list");
  const summary   = document.getElementById("cart-summary");

  if (!list) return;

  if (cart.length === 0) {
    emptyMsg.style.display  = "flex";
    list.innerHTML          = "";
    summary.style.visibility = "hidden";
    return;
  }

  emptyMsg.style.display   = "none";
  summary.style.visibility = "visible";

  // Render each cart item row
  list.innerHTML = cart.map(item => `
    <div class="cart-item" id="cart-row-${item.id}">
      <div class="cart-item-emoji">${item.emoji}</div>
      <div class="cart-item-info">
        <span class="cart-item-name">${item.name}</span>
        <span class="cart-item-price">₹${item.price.toLocaleString()} each</span>
        <span class="cart-item-subtotal">Subtotal: ₹${(item.price * item.qty).toLocaleString()}</span>
      </div>
      <div class="cart-item-right">
        <span class="cart-item-total">₹${(item.price * item.qty).toLocaleString()}</span>
        <!-- Task 7 — Quantity control -->
        <div class="qty-control">
          <button class="qty-btn" onclick="changeQty(${item.id}, -1)" aria-label="Decrease quantity">−</button>
          <span class="qty-value">${item.qty}</span>
          <button class="qty-btn" onclick="changeQty(${item.id}, +1)" aria-label="Increase quantity">+</button>
        </div>
        <button class="btn-remove" onclick="removeFromCart(${item.id})">✕ Remove</button>
      </div>
    </div>
  `).join("");

  // Task 5 — Calculate totals
  updateSummary();
}

/* ─── Task 5 — Calculate & update summary panel ─── */
function updateSummary() {
  const subtotal      = cart.reduce((s, c) => s + c.price * c.qty, 0);
  const freeShipping  = subtotal >= FREE_SHIP_THRESHOLD;
  const shipping      = freeShipping ? 0 : (cart.length > 0 ? SHIPPING_COST : 0);
  const total         = subtotal + shipping;

  // DOM updates
  setText("summary-subtotal", `₹${subtotal.toLocaleString()}`);
  setText("summary-shipping", freeShipping ? "FREE" : `₹${shipping}`);
  setText("summary-total",    `₹${total.toLocaleString()}`);

  // Discount row
  const discRow = document.getElementById("discount-row");
  if (discRow) {
    if (freeShipping && cart.length > 0) {
      discRow.style.display = "flex";
      setText("summary-discount", `-₹${SHIPPING_COST}`);
    } else {
      discRow.style.display = "none";
    }
  }

  // Free shipping note
  const noteEl = document.getElementById("free-ship-note");
  if (noteEl) {
    if (!freeShipping && cart.length > 0) {
      const remaining = FREE_SHIP_THRESHOLD - subtotal;
      noteEl.textContent = `Add ₹${remaining} more for FREE shipping!`;
    } else {
      noteEl.textContent = "";
    }
  }

  // Update checkout total display
  setText("checkout-total-display", `₹${total.toLocaleString()}`);
  setText("checkout-sidebar-total",  `₹${total.toLocaleString()}`);
}

/* ════════════════════════════════════════════════════════════
   TASK 6 — CHECKOUT PREVIEW SIDEBAR
   ════════════════════════════════════════════════════════════ */
function renderCheckoutPreview() {
  const el = document.getElementById("checkout-items-preview");
  if (!el) return;

  if (cart.length === 0) {
    el.innerHTML = `<p class="empty-preview">Add items to cart first.</p>`;
    return;
  }

  el.innerHTML = cart.map(item => `
    <div class="checkout-item-row">
      <span>${item.emoji} ${item.name} × ${item.qty}</span>
      <span>₹${(item.price * item.qty).toLocaleString()}</span>
    </div>
  `).join("");
}

/* ════════════════════════════════════════════════════════════
   TASK 6 — CHECKOUT FORM SUBMISSION
   ════════════════════════════════════════════════════════════ */
function initCheckoutForm() {
  const form = document.getElementById("checkout-form");
  if (!form) return;

  form.addEventListener("submit", event => {
    event.preventDefault();

    // Validate: cart must not be empty
    if (cart.length === 0) {
      showToast("⚠️ Your cart is empty! Add products first.", "toast-error");
      document.getElementById("products").scrollIntoView({ behavior: "smooth" });
      return;
    }

    // Client-side field validation
    const required = form.querySelectorAll("input[required]");
    let valid = true;
    required.forEach(input => {
      if (!input.value.trim()) {
        input.classList.add("input-error", "shake");
        input.addEventListener("animationend", () => input.classList.remove("shake"), { once: true });
        input.addEventListener("input", () => input.classList.remove("input-error"), { once: true });
        valid = false;
      }
    });
    if (!valid) {
      showToast("⚠️ Please fill in all required fields.", "toast-error");
      return;
    }

    // Collect form data
    const fname   = form.fname.value.trim();
    const lname   = form.lname.value.trim();
    const email   = form.email.value.trim();
    const address = form.address.value.trim();
    const city    = form.city.value.trim();
    const payment = form.payment.value;

    // Calculate totals for confirmation
    const subtotal     = cart.reduce((s, c) => s + c.price * c.qty, 0);
    const freeShipping = subtotal >= FREE_SHIP_THRESHOLD;
    const shipping     = freeShipping ? 0 : SHIPPING_COST;
    const total        = subtotal + shipping;
    const orderId      = "SE" + Date.now().toString().slice(-6);

    // Populate confirmation modal
    setText("modal-customer-name", `${fname} ${lname}`);
    setText("modal-email", email);

    const payLabels = { cod: "Cash on Delivery", upi: "UPI", card: "Debit/Credit Card" };
    document.getElementById("modal-details").innerHTML = `
      <strong>Order ID:</strong> ${orderId}<br />
      <strong>Name:</strong> ${fname} ${lname}<br />
      <strong>Delivery:</strong> ${address}, ${city}<br />
      <strong>Payment:</strong> ${payLabels[payment]}<br />
      <strong>Items:</strong> ${cart.reduce((s, c) => s + c.qty, 0)} items<br />
      <strong>Total Paid:</strong> ₹${total.toLocaleString()}
    `;

    // Show modal
    document.getElementById("confirm-modal").classList.add("open");
  });
}

/* ─── Modal close → clear cart & reset ─── */
function initModalClose() {
  const btn = document.getElementById("modal-close-btn");
  if (!btn) return;

  btn.addEventListener("click", () => {
    document.getElementById("confirm-modal").classList.remove("open");

    // Clear cart after successful order
    cart = [];
    saveCart();
    PRODUCTS.forEach(p => resetCartBtn(p.id));
    updateCartBadge();
    renderCart();
    renderCheckoutPreview();

    // Reset form
    document.getElementById("checkout-form")?.reset();

    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });
    showToast("🎉 Thank you for your order!", "toast-success");
  });
}

/* ════════════════════════════════════════════════════════════
   CATEGORY FILTER
   ════════════════════════════════════════════════════════════ */
function initCategoryFilter() {
  const pills = document.querySelectorAll(".pill");
  pills.forEach(pill => {
    pill.addEventListener("click", () => {
      pills.forEach(p => p.classList.remove("active"));
      pill.classList.add("active");

      const filter = pill.dataset.filter;
      const filtered = filter === "all" ? PRODUCTS : PRODUCTS.filter(p => p.category === filter);
      renderProducts(filtered);
    });
  });
}

/* ════════════════════════════════════════════════════════════
   SORT PRODUCTS
   ════════════════════════════════════════════════════════════ */
function initSort() {
  const sel = document.getElementById("sort-select");
  if (!sel) return;

  sel.addEventListener("change", () => {
    const activePill = document.querySelector(".pill.active");
    const filter     = activePill?.dataset.filter || "all";
    let list = filter === "all" ? [...PRODUCTS] : PRODUCTS.filter(p => p.category === filter);

    switch (sel.value) {
      case "price-low":  list.sort((a, b) => a.price - b.price);  break;
      case "price-high": list.sort((a, b) => b.price - a.price);  break;
      case "name":       list.sort((a, b) => a.name.localeCompare(b.name)); break;
      default: break;
    }
    renderProducts(list);
  });
}

/* ════════════════════════════════════════════════════════════
   NAVBAR SCROLL EFFECT
   ════════════════════════════════════════════════════════════ */
function initNavbarScroll() {
  const nav = document.getElementById("navbar");
  if (!nav) return;
  window.addEventListener("scroll", () => {
    nav.style.boxShadow = window.scrollY > 50
      ? "0 4px 24px rgba(0,0,0,0.25)"
      : "0 2px 16px rgba(0,0,0,0.18)";
  });
}

/* ════════════════════════════════════════════════════════════
   CART TOGGLE BUTTON (scrolls to cart section)
   ════════════════════════════════════════════════════════════ */
function initCartToggle() {
  document.getElementById("cart-toggle-btn")?.addEventListener("click", () => {
    document.getElementById("cart-section")?.scrollIntoView({ behavior: "smooth" });
  });
  document.getElementById("clear-cart-btn")?.addEventListener("click", clearCart);
}

/* ════════════════════════════════════════════════════════════
   TOAST NOTIFICATION
   ════════════════════════════════════════════════════════════ */
function showToast(message, type = "", duration = 3000) {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.textContent = message;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity   = "0";
    toast.style.transform = "translateY(10px)";
    toast.style.transition = "opacity 0.35s, transform 0.35s";
    setTimeout(() => toast.remove(), 380);
  }, duration);
}

/* ════════════════════════════════════════════════════════════
   UTILITY
   ════════════════════════════════════════════════════════════ */
function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

/* ════════════════════════════════════════════════════════════
   INIT — Run everything when DOM is ready
   ════════════════════════════════════════════════════════════ */
document.addEventListener("DOMContentLoaded", () => {
  // Render initial product grid (all products)
  renderProducts(PRODUCTS);

  // Restore cart state from localStorage
  updateCartBadge();
  renderCart();
  renderCheckoutPreview();

  // Wire up all features
  initCategoryFilter();
  initSort();
  initCheckoutForm();
  initModalClose();
  initNavbarScroll();
  initCartToggle();

  // Close modal on backdrop click
  document.getElementById("confirm-modal")?.addEventListener("click", function (e) {
    if (e.target === this) this.classList.remove("open");
  });

  // Welcome toast
  setTimeout(() => showToast("👋 Welcome to ShopEase! Explore our products."), 800);
});
