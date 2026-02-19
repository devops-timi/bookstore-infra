// ================================================================
//  FOLIO BOOKSTORE — APP.JS
//  Handles UI rendering, cart logic, modal interactions
// ================================================================

/* ── STATE ── */
const state = {
  cart: [],           // { book, qty }
  category: "all",
  listView: false,
  sidebarOpen: true,
  isMobile: () => window.innerWidth <= 900,
};

/* ── DOM REFS ── */
const $ = (id) => document.getElementById(id);

const DOM = {
  sidebar:       $("sidebar"),
  main:          $("main"),
  hamburger:     $("hamburger"),
  sidebarToggle: $("sidebarToggle"),
  viewToggle:    $("viewToggle"),
  bookGrid:      $("bookGrid"),
  cartCount:     $("cartCount"),
  cartBtn:       $("cartBtn"),
  galleryPage:   $("galleryPage"),
  cartPage:      $("cartPage"),
  cartItems:     $("cartItems"),
  subtotal:      $("subtotal"),
  totalPrice:    $("totalPrice"),
  backToShop:    $("backToShop"),
  checkoutBtn:   $("checkoutBtn"),
  pageTitle:     $("pageTitle"),

  // Product Modal
  modalOverlay:  $("modalOverlay"),
  modalClose:    $("modalClose"),
  modalCover:    $("modalCover"),
  modalBadges:   $("modalBadges"),
  modalTitle:    $("modalTitle"),
  modalAuthor:   $("modalAuthor"),
  modalDesc:     $("modalDesc"),
  modalMeta:     $("modalMeta"),
  modalPrice:    $("modalPrice"),
  modalAddCart:  $("modalAddCart"),

  // Confirm Modal
  confirmOverlay: $("confirmOverlay"),
  confirmClose:   $("confirmClose"),
};

/* ── UTILS ── */
const fmt = (n) => "$" + Number(n).toFixed(2);

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
    : "100, 80, 60";
}

/* ── BOOK COVER PLACEHOLDER ── */
function coverPlaceholder(book, large = false) {
  const rgb = hexToRgb(book.color || "#5a4a2a");
  if (large) {
    return `<div class="modal-cover" style="background: linear-gradient(145deg, rgba(${rgb},0.18), rgba(${rgb},0.35))">
      <span class="ph-large">📚</span>
    </div>`;
  }
  return `<div class="book-cover-placeholder" style="background: linear-gradient(145deg, rgba(${rgb},0.12), rgba(${rgb},0.28))">
    <span class="ph-deco">◈</span>
    <span class="ph-title">${book.title}</span>
    <span class="ph-author">${book.author}</span>
  </div>`;
}

/* ── RENDER GALLERY ── */
function renderGallery() {
  const filtered =
    state.category === "all"
      ? BOOKS
      : BOOKS.filter((b) => b.category === state.category);

  DOM.bookGrid.innerHTML = "";
  DOM.bookGrid.className = "book-grid" + (state.listView ? " list-view" : "");

  if (filtered.length === 0) {
    DOM.bookGrid.innerHTML = `<div class="empty-cart">No books in this category yet.</div>`;
    return;
  }

  filtered.forEach((book, i) => {
    const card = document.createElement("article");
    card.className = "book-card";
    card.style.animationDelay = `${i * 0.04}s`;
    card.style.animation = "fadeUp 0.4s ease both";

    card.innerHTML = `
      ${coverPlaceholder(book)}
      <div class="book-info">
        <span class="book-category">${book.categoryLabel}</span>
        <h3 class="book-title">${book.title}</h3>
        <p class="book-author">${book.author}</p>
        <p class="book-price">${fmt(book.price)}</p>
      </div>
      <button class="browse-btn">Browse Through</button>
    `;

    card.querySelector(".browse-btn").addEventListener("click", (e) => {
      e.stopPropagation();
      openModal(book);
    });
    card.addEventListener("click", () => openModal(book));
    DOM.bookGrid.appendChild(card);
  });
}

/* ── PRODUCT MODAL ── */
let modalBook = null;

function openModal(book) {
  modalBook = book;
  const rgb = hexToRgb(book.color || "#5a4a2a");

  DOM.modalCover.style.background = `linear-gradient(145deg, rgba(${rgb},0.18), rgba(${rgb},0.42))`;
  DOM.modalCover.innerHTML = `<span class="ph-large" style="font-size:4rem; opacity:0.22">📖</span>`;

  DOM.modalBadges.innerHTML = `<span class="badge">${book.categoryLabel}</span>
    ${book.stock < 10 ? `<span class="badge" style="color:var(--rust)">Only ${book.stock} left</span>` : ""}`;

  DOM.modalTitle.textContent = book.title;
  DOM.modalAuthor.textContent = `by ${book.author}`;
  DOM.modalDesc.textContent = book.description;

  DOM.modalMeta.innerHTML = `
    <span><b>Genre</b><br>${book.categoryLabel}</span>
    <span><b>Published</b><br>${book.year}</span>
    <span><b>In Stock</b><br>${book.stock} copies</span>
  `;

  DOM.modalPrice.textContent = fmt(book.price);
  DOM.modalOverlay.classList.add("open");
}

function closeModal() {
  DOM.modalOverlay.classList.remove("open");
  modalBook = null;
}

DOM.modalClose.addEventListener("click", closeModal);
DOM.modalOverlay.addEventListener("click", (e) => {
  if (e.target === DOM.modalOverlay) closeModal();
});

DOM.modalAddCart.addEventListener("click", () => {
  if (modalBook) {
    addToCart(modalBook);
    closeModal();
    flashCartBtn();
  }
});

/* ── CART ── */
function addToCart(book) {
  const existing = state.cart.find((i) => i.book.id === book.id);
  if (existing) {
    existing.qty++;
  } else {
    state.cart.push({ book, qty: 1 });
  }
  updateCartCount();
}

function removeFromCart(bookId) {
  state.cart = state.cart.filter((i) => i.book.id !== bookId);
  updateCartCount();
  renderCart();
}

function changeQty(bookId, delta) {
  const item = state.cart.find((i) => i.book.id === bookId);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) removeFromCart(bookId);
  else {
    updateCartCount();
    renderCart();
  }
}

function updateCartCount() {
  const total = state.cart.reduce((s, i) => s + i.qty, 0);
  DOM.cartCount.textContent = total;
  DOM.cartCount.style.background = total > 0 ? "var(--gold)" : "transparent";
  DOM.cartCount.style.color = total > 0 ? "var(--ink)" : "transparent";
}

function flashCartBtn() {
  DOM.cartBtn.style.transform = "scale(1.2)";
  setTimeout(() => (DOM.cartBtn.style.transform = ""), 200);
}

function renderCart() {
  const total = state.cart.reduce((s, i) => s + i.book.price * i.qty, 0);
  DOM.subtotal.textContent = fmt(total);
  DOM.totalPrice.textContent = fmt(total);

  if (state.cart.length === 0) {
    DOM.cartItems.innerHTML = `<p class="empty-cart">Your cart is empty.<br>Find a book you love ✦</p>`;
    return;
  }

  DOM.cartItems.innerHTML = "";
  state.cart.forEach(({ book, qty }) => {
    const rgb = hexToRgb(book.color || "#5a4a2a");
    const div = document.createElement("div");
    div.className = "cart-item";
    div.innerHTML = `
      <div class="cart-item-cover-ph" style="background: linear-gradient(145deg, rgba(${rgb},0.15), rgba(${rgb},0.3))">📖</div>
      <div class="cart-item-info">
        <p class="cart-item-title">${book.title}</p>
        <p class="cart-item-author">${book.author}</p>
        <p class="cart-item-price">${fmt(book.price * qty)}</p>
      </div>
      <div class="cart-item-actions">
        <button class="qty-btn" data-action="dec" data-id="${book.id}">−</button>
        <span class="qty-display">${qty}</span>
        <button class="qty-btn" data-action="inc" data-id="${book.id}">+</button>
        <button class="remove-btn" data-id="${book.id}">✕</button>
      </div>
    `;
    DOM.cartItems.appendChild(div);
  });

  DOM.cartItems.querySelectorAll("[data-action='dec']").forEach((btn) =>
    btn.addEventListener("click", () => changeQty(Number(btn.dataset.id), -1))
  );
  DOM.cartItems.querySelectorAll("[data-action='inc']").forEach((btn) =>
    btn.addEventListener("click", () => changeQty(Number(btn.dataset.id), 1))
  );
  DOM.cartItems.querySelectorAll(".remove-btn").forEach((btn) =>
    btn.addEventListener("click", () => removeFromCart(Number(btn.dataset.id)))
  );
}

/* ── PAGES ── */
function showPage(name) {
  DOM.galleryPage.classList.remove("active");
  DOM.cartPage.classList.remove("active");
  if (name === "gallery") {
    DOM.galleryPage.classList.add("active");
    DOM.pageTitle.textContent = state.category === "all" ? "All Books" : categoryLabel(state.category);
  } else if (name === "cart") {
    renderCart();
    DOM.cartPage.classList.add("active");
    DOM.pageTitle.textContent = "Your Cart";
  }
}

function categoryLabel(cat) {
  const map = {
    all: "All Books", nyt: "NYT Bestsellers", classics: "Classics",
    children: "Children's Books", top9: "Top 9", social: "Social Justice", fantasy: "Fantasy",
  };
  return map[cat] || "Books";
}

/* ── SIDEBAR ── */
function setSidebar(open) {
  state.sidebarOpen = open;
  if (state.isMobile()) {
    DOM.sidebar.classList.toggle("mobile-open", open);
    DOM.sidebar.classList.remove("collapsed");
  } else {
    DOM.sidebar.classList.toggle("collapsed", !open);
    DOM.main.classList.toggle("expanded", !open);
  }
}

DOM.hamburger.addEventListener("click", () => setSidebar(!state.sidebarOpen));
DOM.sidebarToggle.addEventListener("click", () => setSidebar(false));

/* ── CATEGORY BUTTONS ── */
document.querySelectorAll(".cat-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".cat-btn").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    state.category = btn.dataset.category;
    renderGallery();
    showPage("gallery");
    DOM.pageTitle.textContent = categoryLabel(state.category);
    if (state.isMobile()) setSidebar(false);
  });
});

/* ── VIEW TOGGLE ── */
DOM.viewToggle.addEventListener("click", () => {
  state.listView = !state.listView;
  DOM.viewIcon.innerHTML = state.listView
    ? `<line x1="3" y1="6" x2="21" y2="6" stroke="currentColor" stroke-width="1.5"/>
       <line x1="3" y1="12" x2="21" y2="12" stroke="currentColor" stroke-width="1.5"/>
       <line x1="3" y1="18" x2="21" y2="18" stroke="currentColor" stroke-width="1.5"/>`
    : `<rect x="2" y="2" width="7" height="7" rx="1" fill="currentColor"/>
       <rect x="11" y="2" width="7" height="7" rx="1" fill="currentColor"/>
       <rect x="2" y="11" width="7" height="7" rx="1" fill="currentColor"/>
       <rect x="11" y="11" width="7" height="7" rx="1" fill="currentColor"/>`;
  renderGallery();
});

/* ── CART BTN ── */
DOM.cartBtn.addEventListener("click", () => showPage("cart"));
DOM.backToShop.addEventListener("click", () => showPage("gallery"));

/* ── CHECKOUT ── */
DOM.checkoutBtn.addEventListener("click", () => {
  if (state.cart.length === 0) return;
  // POST order to backend
  fetch("/api/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ items: state.cart.map((i) => ({ bookId: i.book.id, qty: i.qty })) }),
  }).catch(() => {}); // graceful offline fallback
  DOM.confirmOverlay.classList.add("open");
});

DOM.confirmClose.addEventListener("click", () => {
  DOM.confirmOverlay.classList.remove("open");
  state.cart = [];
  updateCartCount();
  showPage("gallery");
});

/* ── CLOSE OVERLAYS ON ESCAPE ── */
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeModal();
    DOM.confirmOverlay.classList.remove("open");
    if (state.isMobile() && state.sidebarOpen) setSidebar(false);
  }
});

/* ── INIT ── */
renderGallery();
updateCartCount();
showPage("gallery");