
/* ===== data (realistic seafood/grill items) ===== */
const DISHES = [
    { id: 1, name: 'Grilled Sea Bass', cat: 'Esasy', price: 48, img: 'img/deva-williamson-S2jw81lfrG0-unsplash.jpg', desc: 'Taze bass, limon we zerdeçally sos bilen.' },
    { id: 2, name: 'Garlic Prawns', cat: 'Başlangyçlar', price: 28, img: 'img/hyyar.jpg', desc: 'Sarimsakly karides, bagyşly sously.' },
    { id: 3, name: 'Mixed Grill Platter', cat: 'Grill', price: 65, img: 'img/montatip-lilitsanong-hU2ieCpAoDI-unsplash.jpg', desc: 'Dana, towuk we baran gurulary, garnitür bilen.' },
    { id: 4, name: 'Citrus Salmon', cat: 'Esasy', price: 52, img: 'img/olenka-kotyk-iRguZkRTQyA-unsplash.jpg', desc: 'Qovurylan salmon, sitrusly glaze.' },
    { id: 5, name: 'Seafood Risotto', cat: 'Esasy', price: 39, img: 'img/pexels-chevanon-323682.jpg', desc: 'Qalpakly deniz önümleri bilen kremli risotto.' },
    { id: 6, name: 'Grilled Octopus', cat: 'Grill', price: 58, img: 'img/pexels-elly-fairytale-3893668.jpg', desc: 'Tütdelenip bişirilen oktapod, ot sousy.' },
    { id: 7, name: 'Tiramisu (Desert)', cat: 'Desert', price: 14, img: 'img/dondurma.jpg', desc: 'Ýumşak tiramisu we kofe süýji.' },
    { id: 8, name: 'Sea Breeze Mocktail', cat: 'Içgiler', price: 9, img: 'img/pexels-adefemi-adedoyin-517656025-33647547.jpg', desc: 'Nasyrlanan sitrus we nar şiresi bilen refreshing.' }
];

/* ===== state ===== */
let cart = JSON.parse(localStorage.getItem('sg_cart') || '[]');

/* ===== render menu row ===== */
const menuRow = document.getElementById('menuRow');
function renderMenu(filter = 'Hemmesi') {
    menuRow.innerHTML = '';
    const items = DISHES.filter(d => filter === 'Hemmesi' ? true : d.cat === filter);
    items.forEach(d => {
        const card = document.createElement('div');
        card.className = 'card-sea';
        card.innerHTML = `
    <img src="${d.img}" alt="${d.name}">
        <div class="card-body">
            <h5>${d.name}</h5>
            <p>${d.desc}</p>
            <div style="display:flex;justify-content:space-between;align-items:center">
                <div class="price">${d.price} TMT</div>
                <div>
                    <button class="btn btn-sm btn-outline-secondary me-1" data-id="${d.id}" onclick="openDetails(event, ${d.id})"><i class="bi bi-eye"></i></button>
                    <button class="btn btn-sm btn-cta" data-id="${d.id}" onclick="addToCart(event, ${d.id})"><i class="bi bi-basket3"></i> Satyly</button>
                </div>
            </div>
        </div>
        `;
        menuRow.appendChild(card);
    });
}
renderMenu();

/* ===== category buttons ===== */
document.querySelectorAll('[data-cat]').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('[data-cat]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderMenu(btn.getAttribute('data-cat'));
    });
});

/* ===== gallery ===== */
const galleryGrid = document.getElementById('galleryGrid');
DISHES.forEach(d => {
    const img = document.createElement('img');
    img.src = d.img; img.alt = d.name; img.loading = 'lazy';
    galleryGrid.appendChild(img);
});

/* ===== details (modal-like quick view) ===== */
function openDetails(e, id) {
    e.stopPropagation();
    const dish = DISHES.find(x => x.id === id);
    const html = `
        <div style="padding:12px;">
            <img src="${dish.img}" style="width:100%;height:220px;object-fit:cover;border-radius:8px;margin-bottom:10px">
                <h5 style="margin:0 0 6px 0">${dish.name}</h5>
                <p style="color:${getComputedStyle(document.documentElement).getPropertyValue('--muted') || '#6b7280'}">${dish.desc}</p>
                <div style="display:flex;justify-content:space-between;align-items:center;margin-top:8px">
                    <div style="font-weight:700;color:var(--accent)">${dish.price} TMT</div>
                    <div>
                        <button class="btn btn-outline-secondary btn-sm" onclick="closeQuick()">Ýap</button>
                        <button class="btn btn-cta btn-sm" onclick="addToCart(event, ${dish.id})">Satyly</button>
                    </div>
                </div>
        </div>
        `;
    const overlay = document.createElement('div');
    overlay.className = 'position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center';
    overlay.style.background = 'rgba(2,6,23,0.6)'; overlay.style.zIndex = '2000';
    const panel = document.createElement('div');
    panel.style.width = 'min(680px,92%)'; panel.style.borderRadius = '12px'; panel.style.overflow = 'hidden';
    panel.innerHTML = html;
    overlay.appendChild(panel);
    overlay.addEventListener('click', (ev) => { if (ev.target === overlay) overlay.remove(); });
    document.body.appendChild(overlay);
    window.closeQuick = () => overlay.remove();
}

/* ===== cart functions ===== */
const cartList = document.getElementById('cartList');
const cartTotal = document.getElementById('cartTotal');
const openCartBtn = document.getElementById('openCartBtn');

function addToCart(e, id) {
    e.stopPropagation();
    const dish = DISHES.find(x => x.id === id);
    const existing = cart.find(i => i.id === id);
    if (existing) existing.qty += 1; else cart.push({ id: dish.id, name: dish.name, price: dish.price, qty: 1 });
    saveCart(); renderCart();
    alert(`${dish.name} - keragt goşuldy`);
}
function saveCart() { localStorage.setItem('sg_cart', JSON.stringify(cart)); }
function renderCart() {
    cartList.innerHTML = '';
    if (cart.length === 0) { cartList.innerHTML = '<div style="color:var(--muted)">Körzinka boş</div>'; cartTotal.textContent = '0 TMT'; openCartBtn.textContent = 'Sargytlar (0)'; return; }
    cart.forEach(item => {
        const row = document.createElement('div');
        row.style.display = 'flex'; row.style.justifyContent = 'space-between'; row.style.alignItems = 'center'; row.style.marginBottom = '8px';
        row.innerHTML = `<div><strong>${item.name}</strong><div style="font-size:13px;color:${getComputedStyle(document.documentElement).getPropertyValue('--muted')}">Qty: ${item.qty}</div></div><div style="text-align:right"><div style="font-weight:700">${item.price * item.qty} TMT</div><button class="btn btn-sm btn-outline-light mt-1" onclick="removeFromCart(${item.id})">Aýyr</button></div>`;
        cartList.appendChild(row);
    });
    const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
    cartTotal.textContent = total + ' TMT';
    openCartBtn.textContent = `Sargytlar (${cart.reduce((s, i) => s + i.qty, 0)})`;
}
function removeFromCart(id) {
    const idx = cart.findIndex(i => i.id === id);
    if (idx >= 0) cart.splice(idx, 1);
    saveCart(); renderCart();
}
document.getElementById('clearCart').addEventListener('click', () => {
    if (confirm('Körzinkany arassalamak isleýärsiňizmi?')) { cart = []; saveCart(); renderCart(); }
});

/* checkout demo */
document.getElementById('checkoutBtn').addEventListener('click', () => {
    if (cart.length === 0) { alert('Körzinka boş'); return; }
    alert('Sargyt ugradyldy — demo. Sagboluň!');
    cart = []; saveCart(); renderCart();
});

/* persist and initial render */
renderCart();

/* reservation form */
document.getElementById('reserveForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const name = document.getElementById('rName').value.trim();
    const phone = document.getElementById('rPhone').value.trim();
    const date = document.getElementById('rDate').value;
    const time = document.getElementById('rTime').value;
    if (!name || !phone || !date || !time) { alert('Iltimas, ähli meýdanlary dolduryň'); return; }
    alert(`Rahmat, ${name}! Siziň brondyňyz kabul edildi: ${date} ${time}`);
    e.target.reset();
});

/* set year */
document.getElementById('year').textContent = new Date().getFullYear();
