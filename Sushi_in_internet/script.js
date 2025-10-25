
/* ========== DATA (unique, different from prior versions) ========== */
const DISHES = [
    { id: 1, name: "Smoked Dutar Salmon", cat: "Balık", price: "45 TMT", img: "img/elisheva-g-nyekPQwZbgw-unsplash.jpg", desc: "" },
    { id: 2, name: "Siyabryg Fusion Roll", cat: "Deniz", price: "38 TMT", img: "img/greta-punch-upY7FPFfMNo-unsplash.jpg", desc: "" },
    { id: 3, name: "Quinoa Pilaf with Lamb", cat: "Esasy", price: "42 TMT", img: "img/pexels-nadin-sh-78971847-14286683.jpg", desc: "" },
    { id: 4, name: "Charred Eggplant & Pomegranate", cat: "Başlangyç", price: "26 TMT", img: "img/kadi.jpg", desc: "" },
    { id: 5, name: "Citrus Karides Skewers", cat: "Başlangyç", price: "30 TMT", img: "img/pexels-infonautica-3533865.jpg", desc: "" },
    { id: 6, name: "Smoky Lamb Ribs", cat: "Esasy", price: "55 TMT", img: "img/pexels-luchik-14587648.jpg", desc: "" },
    { id: 7, name: "Herb-infused Flatbread", cat: "Yanaglar", price: "12 TMT", img: "img/pexels-minan1398-1482803.jpg", desc: "" },
    { id: 8, name: "Fusion Sunset Mocktail", cat: "Içgiler", price: "12 TMT", img: "img/pexels-valeriya-939052.jpg", desc: "" },
    { id: 9, name: "Dark Chocolate & Tea Foam", cat: "Desert", price: "18 TMT", img: "img/sera-iZgQKxuMRHc-unsplash.jpg", desc: "" }
];

/* ========== state and helpers ========== */
let activeFilter = 'Hemmesi';
const favorites = JSON.parse(localStorage.getItem('ft_favs') || '[]');

function uniqueCats() {
    const set = new Set(DISHES.map(d => d.cat));
    return ['Hemmesi', ...Array.from(set)];
}

/* ========== render filters in sidebar ========== */
const filtersWrap = document.getElementById('filters');
uniqueCats().forEach(cat => {
    const ch = document.createElement('div');
    ch.className = 'chip' + (cat === 'Hemmesi' ? ' active' : '');
    ch.textContent = cat;
    ch.onclick = () => { document.querySelectorAll('.chip').forEach(c => c.classList.remove('active')); ch.classList.add('active'); activeFilter = cat; renderMenu(); }
    filtersWrap.appendChild(ch);
});

/* ========== render menu grid ========== */
const menuGrid = document.getElementById('menuGrid');
function renderMenu() {
    menuGrid.innerHTML = '';
    const items = DISHES.filter(d => activeFilter === 'Hemmesi' ? true : d.cat === activeFilter);
    items.forEach(d => {
        const el = document.createElement('div'); el.className = 'dish';
        el.innerHTML = `
      <img class="img-fluid img-fluid img-cover" src="${d.img}" alt="${d.name}" style="height:150px;object-fit:cover;">
      <div class="body">
        <h4>${d.name}</h4>
        <p>${d.desc}</p>
        <div class="meta">
          <div class="small text-muted">${d.cat}</div>
          <div class="price">${d.price}</div>
        </div>
      </div>
    `;
        el.onclick = () => openDish(d.id);
        menuGrid.appendChild(el);
    });
}
renderMenu();

/* ========== render gallery (masonry feel via column layout) ========== */
const galleryGrid = document.getElementById('galleryGrid');
const galleryImgs = DISHES.map(d => d.img);
galleryImgs.forEach((src, i) => {
    const img = document.createElement('img');
    img.src = src; img.alt = 'foto'; img.style.width = '100%'; img.style.display = 'block';
    img.style.marginBottom = '12px';
    galleryGrid.appendChild(img);
});

/* ========== modal interactions ========== */
const dishModalEl = document.getElementById('dishModal');
const dishModal = new bootstrap.Modal(dishModalEl);
const dishTitle = document.getElementById('dishTitle');
const dishImg = document.getElementById('dishImg');
const dishDesc = document.getElementById('dishDesc');
const dishPrice = document.getElementById('dishPrice');
const favBtn = document.getElementById('favBtn');
const orderBtn = document.getElementById('orderBtn');
let currentDishId = null;

function openDish(id) {
    const d = DISHES.find(x => x.id === id);
    currentDishId = id;
    dishTitle.textContent = d.name;
    dishImg.src = d.img;
    dishDesc.textContent = d.desc;
    dishPrice.textContent = d.price;
    updateFavBtn();
    dishModal.show();
}

function updateFavBtn() {
    const exists = favorites.includes(currentDishId);
    favBtn.innerHTML = exists ? '<i class="bi bi-heart-fill" style="color:#f43f5e"></i> Alnan' : '<i class="bi bi-heart"></i> Saýla';
}

/* fav toggle */
favBtn.addEventListener('click', () => {
    if (!currentDishId) return;
    const idx = favorites.indexOf(currentDishId);
    if (idx >= 0) { favorites.splice(idx, 1); } else { favorites.push(currentDishId); }
    localStorage.setItem('ft_favs', JSON.stringify(favorites));
    updateFavListUI();
    updateFavBtn();
});

/* order demo */
orderBtn.addEventListener('click', () => {
    alert('Sargyt kabul edildi — demo.'); dishModal.hide();
});

/* ========== favorites list UI in sidebar ========== */
const favListEl = document.getElementById('favoritesList');
const favEmpty = document.getElementById('favoritesEmpty');
const favCount = document.getElementById('favCount');
function updateFavListUI() {
    favListEl.innerHTML = '';
    if (favorites.length === 0) {
        favEmpty.style.display = 'block';
    } else {
        favEmpty.style.display = 'none';
    }
    favorites.forEach(id => {
        const d = DISHES.find(x => x.id === id);
        const row = document.createElement('div'); row.className = 'fav-item';
        row.innerHTML = `<div>${d.name}</div><div style="display:flex;gap:8px"><div style="font-weight:700">${d.price}</div><button class="btn btn-sm btn-outline-light" data-id="${id}">🗑</button></div>`;
        favListEl.appendChild(row);
        row.querySelector('button').onclick = (e) => {
            const remId = Number(e.currentTarget.getAttribute('data-id'));
            const i = favorites.indexOf(remId);
            if (i >= 0) { favorites.splice(i, 1); localStorage.setItem('ft_favs', JSON.stringify(favorites)); updateFavListUI(); renderMenu(); }
        }
    });
    favCount.textContent = favorites.length;
}
updateFavListUI();

/* clear favs */
document.getElementById('clearFav').addEventListener('click', () => {
    if (!confirm('Saýlananlary hakykatdan hem aýyrmak isleýärsiňizmi?')) return;
    favorites.length = 0; localStorage.setItem('ft_favs', '[]'); updateFavListUI();
});

/* booking form */
document.getElementById('bookForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('bname').value.trim();
    const phone = document.getElementById('bphone').value.trim();
    const date = document.getElementById('bdate').value;
    if (!name || !phone || !date) { alert('Bütün meýdanlary dolduryň'); return; }
    alert(`Sagboluň, ${name}! Siziň bronyňyz kabul edildi: ${date}`);
    e.target.reset();
});

/* scroll helper */
function scrollToSection(id) {
    const el = document.getElementById(id === 'menu' ? 'menuSec' : id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* small accessibility: keyboard open first dish */
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') { const first = DISHES[0]; if (first) openDish(first.id); }
});

