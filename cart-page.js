// ── Cart Page Logic - Mana Bake ──

const WA_NUMBER = '6281218186737';

function formatRupiahPage(num) {
  return 'Rp.' + num.toLocaleString('id-ID');
}

// ── Render cart items into the DOM ──
function renderCart() {
  const cart = getCart();
  const listEl    = document.getElementById('cartItemsList');
  const emptyEl   = document.getElementById('cartEmpty');
  const contentEl = document.getElementById('cartContent');

  if (!listEl) return;

  if (cart.length === 0) {
    emptyEl.classList.remove('hidden');
    contentEl.style.display = 'none';
    updateCartBadge();
    return;
  }

  emptyEl.classList.add('hidden');
  contentEl.style.display = 'block';

  // Build rows
  listEl.innerHTML = cart.map((item, idx) => {
    const subtotal = item.price * item.qty;
    return `
      <div class="cart-row" data-index="${idx}">
        <span class="col-product">
          <span class="cart-item-name">${item.name}</span>
          <span class="cart-item-unit text-xs text-gray-400">/ ${item.unit}</span>
        </span>
        <span class="col-price">${formatRupiahPage(item.price)}</span>
        <span class="col-qty">
          <div class="qty-control">
            <button class="qty-btn qty-dec" data-index="${idx}" aria-label="Kurangi">−</button>
            <span class="qty-num">${item.qty}</span>
            <button class="qty-btn qty-inc" data-index="${idx}" aria-label="Tambah">+</button>
          </div>
        </span>
        <span class="col-subtotal">${formatRupiahPage(subtotal)}</span>
        <span class="col-action">
          <button class="cart-delete-btn" data-index="${idx}" aria-label="Hapus produk">✕</button>
        </span>
      </div>
    `;
  }).join('');

  // Update summary
  const totalItems = cart.reduce((s, i) => s + i.qty, 0);
  const totalPrice = cart.reduce((s, i) => s + i.price * i.qty, 0);

  document.getElementById('summaryItemCount').textContent = `${totalItems} item`;
  document.getElementById('summarySubtotal').textContent  = formatRupiahPage(totalPrice);
  document.getElementById('summaryTotal').textContent     = formatRupiahPage(totalPrice);

  updateCartBadge();
  attachRowEvents();
}

// ── Attach events to qty and delete buttons ──
function attachRowEvents() {
  // Increment
  document.querySelectorAll('.qty-inc').forEach(btn => {
    btn.addEventListener('click', () => {
      const cart = getCart();
      const idx  = parseInt(btn.dataset.index);
      cart[idx].qty += 1;
      saveCart(cart);
      renderCart();
    });
  });

  // Decrement
  document.querySelectorAll('.qty-dec').forEach(btn => {
    btn.addEventListener('click', () => {
      const cart = getCart();
      const idx  = parseInt(btn.dataset.index);
      cart[idx].qty -= 1;
      if (cart[idx].qty <= 0) {
        cart.splice(idx, 1);
      }
      saveCart(cart);
      renderCart();
    });
  });

  // Delete
  document.querySelectorAll('.cart-delete-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const cart = getCart();
      const idx  = parseInt(btn.dataset.index);

      // Animate row out
      const row = btn.closest('.cart-row');
      row.style.transition = 'opacity 0.25s, transform 0.25s';
      row.style.opacity    = '0';
      row.style.transform  = 'translateX(20px)';

      setTimeout(() => {
        cart.splice(idx, 1);
        saveCart(cart);
        renderCart();
      }, 250);
    });
  });
}

// ── Clear entire cart ──
function clearCart() {
  if (!confirm('Yakin ingin mengosongkan keranjang?')) return;
  saveCart([]);
  renderCart();
}

// ── Generate WhatsApp checkout message ──
function checkoutWhatsApp() {
  const cart = getCart();
  if (cart.length === 0) {
    window.open(`https://wa.me/${WA_NUMBER}`, '_blank');
    return;
  }

  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);

  let msg = 'Halo, saya ingin memesan:\n\n';
  cart.forEach(item => {
    const subtotal = item.price * item.qty;
    msg += `- ${item.name} x${item.qty} = ${formatRupiahPage(subtotal)}\n`;
  });
  msg += `\nTotal: ${formatRupiahPage(total)}`;

  const encoded = encodeURIComponent(msg);
  window.open(`https://wa.me/${WA_NUMBER}?text=${encoded}`, '_blank');
}

// ── Init ──
document.addEventListener('DOMContentLoaded', () => {
  renderCart();

  document.getElementById('clearCartBtn')?.addEventListener('click', clearCart);
  document.getElementById('checkoutBtn')?.addEventListener('click', checkoutWhatsApp);
});
