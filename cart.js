// ── Cart Module - Mana Bake ──

const CART_KEY = 'manabake_cart';

// Get cart from localStorage
function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch {
    return [];
  }
}

// Save cart to localStorage
function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

// Add item to cart
function addToCart(name, price, unit) {
  const cart = getCart();
  const existing = cart.find(item => item.name === name);

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ name, price: parseInt(price), unit, qty: 1 });
  }

  saveCart(cart);
  updateCartBadge();
}

// Update the badge count in navbar
function updateCartBadge() {
  const cart = getCart();
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);

  const badge = document.getElementById('cartBadge');
  if (badge) {
    if (totalItems > 0) {
      badge.textContent = totalItems;
      badge.style.display = 'inline-flex';
    } else {
      badge.style.display = 'none';
    }
  }
}

// Format rupiah
function formatRupiah(num) {
  return 'Rp.' + num.toLocaleString('id-ID');
}

// ── Init on page load ──
document.addEventListener('DOMContentLoaded', () => {

  // Sync badge on load
  updateCartBadge();

  // Handle Add to Cart buttons
  document.querySelectorAll('.add-to-cart-circle-btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();

      const name = this.dataset.name;
      const price = this.dataset.price;
      const unit = this.dataset.unit;

      if (!name || !price) return;

      // Add to cart
      addToCart(name, price, unit);

      // Visual feedback
      this.textContent = '✓';
      this.classList.add('added');
      this.disabled = true;

      setTimeout(() => {
        this.textContent = '+';
        this.classList.remove('added');
        this.disabled = false;
      }, 1500);
    });
  });
});
