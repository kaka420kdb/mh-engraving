/* ========================================
   MH ENGRAVING - Main JavaScript
   ======================================== */

// ===== PRODUCT DATA =====
const products = [
    {
        id: 1,
        name: "Personalized Wood Nameplate",
        category: "wood",
        price: 799,
        originalPrice: 1000,
        image: [ 
            "1.jpg",
            "12.jpg",
            "10.jpg",
            "13.jpg"
        ],
        desc: "Beautifully engraved wooden nameplate perfect for homes and offices. Made from premium teak wood with deep laser-etched lettering that lasts a lifetime.",
        badge: "Bestseller"
    },
    {
        id: 2,
        name: "Wooden Surah Frame",
        category: "wood",
        price: 599,
        originalPrice: 999,
        image: [ 
            "7.jpg"
        ],
        desc: "Elegant wooden frame with intricate engraving. A beautiful addition to any living space.",
        badge: "New"
    },
    {
        id: 3,
        name: "Engraved Wooden Key holder",
        category: "wood",
        price:23,
        originalPrice: 100,
        image: [ 
            
            "3.jpg",
            "5.jpg",
             "2.jpg"
            
        ],
        desc: "Handcrafted wooden key holder with elegant engraving. A practical and stylish addition to any home or office.",
        badge: ""
    },
    {
        id: 4,
        name: "Wood Home Plate",
        category: "wood",
        price: 599,
        originalPrice: 800,
         image: [ 
            "15.jpg",
            "4.jpg",
            "14.jpg",
            
        ],
        desc: "Premium wooden home plate with intricate engraving. A beautiful addition to any living space.",
        badge: "Popular"
    },
    {
        id: 5,
        name: "Anime card",
        category: "wood board",
        price: 50,
        originalPrice: 100,
       image: [ 
            "50.jpg",
            "60.png",
            
        ],
        desc: "Stylish anime card made from premium wood board. Perfect for collectors and fans of their favorite characters and decorate your space.",
        badge: "Popular"
    },
    {
        id: 6,
        name: "Glass Photo Frame",
        category: "glass",
        price: 799,
        originalPrice: 1200,
        image: "21.jpeg",
        desc: "Wobderful glass photo frame with intricate engraving.",
        badge: "Premium"
    },
    {
        id: 7,
        name: "Customized Key Holder",
        category: "wood",
        price: 90,
        originalPrice: 150,
         image: [ 
            "90.jpeg",
            "a.jpeg",
            
        ],
        desc: "Premium wooden key holder with customized engraving. A perfect gift for loved ones or a stylish addition to your key.",
        badge: "Popular"
    },

       
];

// ===== STATE =====
let cart = [];
let currentFilter = 'all';
let modalProductId = null;
let modalQty = 1;
let modalSlides = [];
let currentModalSlide = 0;

// ===== HELPER: GET IMAGES =====
function getImages(product) {
    return Array.isArray(product.image) ? product.image : [product.image];
}

// ===== RENDER PRODUCTS =====
// ===== RENDER PRODUCTS =====
function renderProducts(filter = 'all') {
    const grid = document.getElementById('products-grid');
    const filtered = filter === 'all' ? products : products.filter(p => p.category === filter);

    grid.innerHTML = '';

    // Eikhane poriborton korben:
    // shudhu 'filtered.forEach' er bodole nicher line-ta likhun: aine id 0,6 er jaigai joida diba oita hobe
    filtered.slice(0, 7).forEach((product, index) => {
        const discount = Math.round((1 - product.price / product.originalPrice) * 100);
        const card = document.createElement('div');
        // ... baki shob code ager motoi thakbe
        card.className = 'product-card bg-white rounded-3xl overflow-hidden border border-slate-100 group';
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';

        const imgArray = getImages(product);
        let imageHtml = '';
        
        // MULTIPLE IMAGES SLIDER LOGIC (FIXED FOR FULL IMAGE VIEW)
        if (imgArray.length > 1) {
            imageHtml = `
                <div class="relative w-full h-72 overflow-hidden bg-slate-50">
                    <div class="flex h-full overflow-x-auto snap-x snap-mandatory scrollbar-hide">
                        ${imgArray.map(img => `
                            <img src="${img}" alt="${product.name}" class="min-w-full w-full h-full object-contain flex-shrink-0 snap-center p-2">
                        `).join('')}
                    </div>
                    <div class="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 pointer-events-none z-10">
                        ${imgArray.map((_, i) => `<span class="w-1.5 h-1.5 rounded-full ${i === 0 ? 'bg-slate-800' : 'bg-slate-400'} shadow-sm"></span>`).join('')}
                    </div>
                </div>
            `;
        } else {
            // SINGLE IMAGE LOGIC (FIXED FOR FULL IMAGE VIEW)
            imageHtml = `<div class="w-full h-72 bg-slate-50 overflow-hidden"><img src="${imgArray[0]}" alt="${product.name}" class="product-img w-full h-full object-contain p-2"></div>`;
        }

        card.innerHTML = `
            <div class="relative overflow-hidden cursor-pointer" onclick="openProductModal(${product.id})">
                ${imageHtml}
                <div class="product-overlay absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none"></div>
                
                ${product.badge ? `<span class="absolute top-4 left-4 bg-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg z-10">${product.badge}</span>` : ''}
                <span class="absolute top-4 right-4 bg-white/90 backdrop-blur text-slate-700 text-xs font-bold px-2.5 py-1 rounded-full z-10">-${discount}%</span>
                
                <div class="absolute bottom-4 left-4 right-4 add-cart-btn z-20">
                    <button onclick="event.stopPropagation(); addToCart(${product.id})" class="w-full bg-white text-slate-900 font-medium py-3 rounded-xl hover:bg-orange-500 hover:text-white transition-all shadow-xl flex items-center justify-center gap-2 text-sm">
                        <i data-lucide="shopping-bag" class="w-4 h-4"></i> Quick Add
                    </button>
                </div>
            </div>
            <div class="p-5 relative z-10 bg-white">
                <div class="text-xs font-medium text-orange-500 uppercase tracking-wider mb-1">${product.category} engraving</div>
                <h3 class="font-semibold text-base mb-3 cursor-pointer hover:text-orange-600 transition-colors" onclick="openProductModal(${product.id})">${product.name}</h3>
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                        <span class="text-xl font-bold">৳${product.price}</span>
                        <span class="text-sm text-slate-400 line-through">৳${product.originalPrice}</span>
                    </div>
                    <button onclick="addToCart(${product.id})" class="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center hover:bg-slate-900 hover:text-white transition-all duration-300">
                        <i data-lucide="plus" class="w-5 h-5"></i>
                    </button>
                </div>
            </div>
        `;

        grid.appendChild(card);

        requestAnimationFrame(() => {
            setTimeout(() => {
                card.style.transition = 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 80);
        });
    });

    lucide.createIcons();
}

// ===== FILTER PRODUCTS =====
function filterProducts(cat) {
    currentFilter = cat;
    document.querySelectorAll('#filter-pills .cat-pill').forEach(pill => {
        pill.classList.remove('active');
        if (pill.dataset.cat === cat) pill.classList.add('active');
    });

    document.querySelectorAll('.cat-pill-hero').forEach(btn => {
        btn.className = 'cat-pill-hero px-5 py-2 rounded-full text-sm font-medium bg-white text-slate-600 border border-slate-200 whitespace-nowrap hover:border-orange-300 hover:text-orange-600 transition-all';
    });

    const catMap = { 'all': 0, 'wood': 1, 'metal': 2, 'glass': 3, 'leather': 4, 'acrylic': 5 };
    const heroBtns = document.querySelectorAll('.cat-pill-hero');
    if (heroBtns[catMap[cat]]) {
        heroBtns[catMap[cat]].className = 'cat-pill-hero px-5 py-2 rounded-full text-sm font-medium bg-slate-900 text-white whitespace-nowrap transition-all';
    }

    renderProducts(cat);
}

// ===== CART FUNCTIONS =====
function addToCart(id, qty = 1) {
    const product = products.find(p => p.id === id);
    const existing = cart.find(item => item.id === id);

    if (existing) {
        existing.qty += qty;
    } else {
        cart.push({ ...product, qty });
    }

    updateCartUI();
    showToast(`${product.name} added to cart!`, 'success');
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCartUI();
}

function updateCartQty(id, delta) {
    const item = cart.find(i => i.id === id);
    if (item) {
        item.qty += delta;
        if (item.qty <= 0) {
            removeFromCart(id);
            return;
        }
    }
    updateCartUI();
}

function clearCart() {
    cart = [];
    updateCartUI();
    showToast('Cart cleared', 'info');
}

function updateCartUI() {
    const badge = document.getElementById('cart-badge');
    const itemsContainer = document.getElementById('cart-items');
    const footer = document.getElementById('cart-footer');
    const totalEl = document.getElementById('cart-total');

    const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
    const totalPrice = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

    if (totalItems > 0) {
        badge.classList.remove('hidden');
        badge.textContent = totalItems;
        badge.classList.add('badge-bounce');
        setTimeout(() => badge.classList.remove('badge-bounce'), 400);

        footer.classList.remove('hidden');
        totalEl.textContent = `৳${totalPrice.toLocaleString()}`;

        let html = '';
        cart.forEach(item => {
            // Cart e choto kore dekhanor jonno object-cover use kora hoyeche
            const cartImg = getImages(item)[0]; 
            
            html += `
                <div class="flex gap-4 mb-4 pb-4 border-b border-slate-100">
                    <img src="${cartImg}" alt="${item.name}" class="w-20 h-20 object-cover rounded-xl flex-shrink-0 bg-slate-50 p-1">
                    <div class="flex-1 min-w-0">
                        <h4 class="font-semibold text-sm truncate">${item.name}</h4>
                        <p class="text-orange-500 font-bold text-sm mt-1">৳${item.price}</p>
                        <div class="flex items-center gap-2 mt-2">
                            <button onclick="updateCartQty(${item.id}, -1)" class="w-7 h-7 bg-slate-100 rounded-lg flex items-center justify-center hover:bg-slate-200 transition-colors">
                                <i data-lucide="minus" class="w-3 h-3"></i>
                            </button>
                            <span class="text-sm font-semibold w-6 text-center">${item.qty}</span>
                            <button onclick="updateCartQty(${item.id}, 1)" class="w-7 h-7 bg-slate-100 rounded-lg flex items-center justify-center hover:bg-slate-200 transition-colors">
                                <i data-lucide="plus" class="w-3 h-3"></i>
                            </button>
                        </div>
                    </div>
                    <button onclick="removeFromCart(${item.id})" class="self-start p-1.5 hover:bg-red-50 rounded-lg transition-colors group">
                        <i data-lucide="trash-2" class="w-4 h-4 text-slate-400 group-hover:text-red-500"></i>
                    </button>
                </div>
            `;
        });
        itemsContainer.innerHTML = html;
    } else {
        badge.classList.add('hidden');
        footer.classList.add('hidden');
        itemsContainer.innerHTML = `
            <div class="flex flex-col items-center justify-center h-full text-center">
                <div class="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                    <i data-lucide="shopping-bag" class="w-10 h-10 text-slate-300"></i>
                </div>
                <p class="text-slate-500 font-medium">Your cart is empty</p>
                <p class="text-sm text-slate-400 mt-1">Browse our products and add items</p>
            </div>
        `;
    }

    lucide.createIcons();
}

function toggleCart() {
    const sidebar = document.getElementById('cart-sidebar');
    const overlay = document.getElementById('cart-overlay');
    const isOpen = !sidebar.classList.contains('translate-x-full');

    if (isOpen) {
        sidebar.classList.add('translate-x-full');
        overlay.style.opacity = '0';
        setTimeout(() => overlay.classList.add('hidden'), 300);
        document.body.style.overflow = '';
    } else {
        overlay.classList.remove('hidden');
        requestAnimationFrame(() => {
            overlay.style.opacity = '1';
            sidebar.classList.remove('translate-x-full');
        });
        document.body.style.overflow = 'hidden';
    }
}

function checkout() {
    const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    showToast(`Order total: ৳${total.toLocaleString()}. Redirecting to checkout...`, 'success');
}

// ===== PRODUCT MODAL & SLIDER =====
function openProductModal(id) {
    modalProductId = id;
    modalQty = 1;
    const product = products.find(p => p.id === id);
    const discount = Math.round((1 - product.price / product.originalPrice) * 100);

    modalSlides = getImages(product);
    currentModalSlide = 0;
    renderModalSlider();

    document.getElementById('modal-badge').textContent = product.badge || product.category;
    document.getElementById('modal-cat').textContent = product.category + ' engraving';
    document.getElementById('modal-title').textContent = product.name;
    document.getElementById('modal-price').textContent = `৳${product.price}`;
    document.getElementById('modal-original-price').textContent = `৳${product.originalPrice}`;
    document.getElementById('modal-discount').textContent = `-${discount}%`;
    document.getElementById('modal-desc').textContent = product.desc;
    document.getElementById('modal-qty').textContent = '1';

    const modal = document.getElementById('product-modal');
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';

    requestAnimationFrame(() => {
        modal.querySelector('.modal-backdrop').style.opacity = '1';
        modal.querySelector('.modal-content').style.opacity = '1';
        modal.querySelector('.modal-content').style.transform = 'scale(1)';
    });

    lucide.createIcons();
}

function renderModalSlider() {
    const container = document.getElementById('modal-img-container');
    // Modal e o object-contain use kora hoyeche full image dekhanor jonno
    let html = `
        <div class="modal-slider-track flex h-full" style="transform: translateX(0%)">
            ${modalSlides.map(img => `<img src="${img}" class="min-w-full w-full h-full object-contain bg-slate-100 flex-shrink-0 p-4">`).join('')}
        </div>
    `;

    if (modalSlides.length > 1) {
        html += `
            <button onclick="event.stopPropagation(); moveModalSlide(-1)" class="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all z-10">
                <i data-lucide="chevron-left" class="w-5 h-5"></i>
            </button>
            <button onclick="event.stopPropagation(); moveModalSlide(1)" class="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all z-10">
                <i data-lucide="chevron-right" class="w-5 h-5"></i>
            </button>
            <div class="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                ${modalSlides.map((_, i) => `<span class="modal-dot w-2.5 h-2.5 rounded-full ${i === 0 ? 'bg-slate-800' : 'bg-slate-400'} transition-all cursor-pointer" onclick="goToModalSlide(${i})"></span>`).join('')}
            </div>
        `;
    }
    
    container.innerHTML = html;
}

function moveModalSlide(dir) {
    currentModalSlide += dir;
    if (currentModalSlide < 0) currentModalSlide = modalSlides.length - 1;
    if (currentModalSlide >= modalSlides.length) currentModalSlide = 0;
    
    document.querySelector('.modal-slider-track').style.transform = `translateX(-${currentModalSlide * 100}%)`;
    
    document.querySelectorAll('.modal-dot').forEach((dot, i) => {
        dot.className = `modal-dot w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${i === currentModalSlide ? 'bg-slate-800' : 'bg-slate-400'}`;
    });
}

function goToModalSlide(index) {
    currentModalSlide = index;
    document.querySelector('.modal-slider-track').style.transform = `translateX(-${currentModalSlide * 100}%)`;
    document.querySelectorAll('.modal-dot').forEach((dot, i) => {
        dot.className = `modal-dot w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${i === currentModalSlide ? 'bg-slate-800' : 'bg-slate-400'}`;
    });
}

function closeProductModal() {
    const modal = document.getElementById('product-modal');
    modal.querySelector('.modal-backdrop').style.opacity = '0';
    modal.querySelector('.modal-content').style.opacity = '0';
    modal.querySelector('.modal-content').style.transform = 'scale(0.95)';

    setTimeout(() => {
        modal.classList.add('hidden');
        document.body.style.overflow = '';
    }, 300);
}

function modalQtyChange(delta) {
    modalQty = Math.max(1, modalQty + delta);
    document.getElementById('modal-qty').textContent = modalQty;
}

function addFromModal() {
    if (modalProductId) {
        addToCart(modalProductId, modalQty);
        closeProductModal();
    }
}

// 👇 এইখানে বসাও
function orderWhatsApp() {
    const product = products.find(p => p.id === modalProductId);

    const text =
`🛍️ New Order Request

📦 Product: ${product.name}
📂 Category: ${product.category}
💰 Price: ৳${product.price}
🔢 Quantity: ${modalQty}

📝 Description:
${product.desc}

I want to order this product.`;

    window.open(
        `https://wa.me/8801911830708?text=${encodeURIComponent(text)}`,
        '_blank'
    );
} 
// ===== TOAST NOTIFICATIONS =====
function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    const icon = type === 'success' ? 'check-circle' : 'info';
    const color = type === 'success' ? 'green' : 'blue';

    toast.className = 'toast-enter flex items-center gap-3 bg-white rounded-2xl px-5 py-4 shadow-xl shadow-slate-900/10 border border-slate-100 min-w-[300px]';
    toast.innerHTML = `
        <div class="w-8 h-8 bg-${color}-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <i data-lucide="${icon}" class="w-4 h-4 text-${color}-600"></i>
        </div>
        <p class="text-sm font-medium text-slate-700 flex-1">${message}</p>
    `;

    container.appendChild(toast);
    lucide.createIcons();

    setTimeout(() => {
        toast.classList.remove('toast-enter');
        toast.classList.add('toast-exit');
        setTimeout(() => toast.remove(), 400);
    }, 3000);
}

// ===== CUSTOM FORM HANDLER =====
function handleCustomForm(e) {
    e.preventDefault();
    showToast('Quote request submitted! We\'ll get back to you within 24 hours.', 'success');
    e.target.reset();
}

// ===== MOBILE MENU =====
function toggleMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    const isOpen = menu.style.maxHeight && menu.style.maxHeight !== '0px';

    if (isOpen) { closeMobileMenu(); } 
    else { menu.style.maxHeight = '400px'; menu.style.opacity = '1'; }
}

function closeMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    menu.style.maxHeight = '0px';
    menu.style.opacity = '0';
}

// ===== NAVBAR SCROLL EFFECT =====
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('bg-white/90', 'backdrop-blur-xl', 'shadow-lg', 'shadow-slate-900/5');
    } else {
        navbar.classList.remove('bg-white/90', 'backdrop-blur-xl', 'shadow-lg', 'shadow-slate-900/5');
    }
});

// ===== SCROLL REVEAL OBSERVER =====
const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('active'); });
}, observerOptions);

document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(el => {
    revealObserver.observe(el);
});

// ===== COUNTER ANIMATION =====
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const counter = entry.target;
            const target = parseInt(counter.dataset.target);
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;

            const timer = setInterval(() => {
                current += step;
                if (current >= target) { current = target; clearInterval(timer); }
                counter.textContent = Math.floor(current).toLocaleString();
            }, 16);

            counterObserver.unobserve(counter);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.counter').forEach(el => counterObserver.observe(el));

// ===== INITIALIZE ON DOM READY =====
document.addEventListener('DOMContentLoaded', () => {
    const uploadInput = document.getElementById("designUpload");

if(uploadInput){
    uploadInput.addEventListener("change", function () {
        const fileName = document.getElementById("file-name");

        if (this.files.length > 0) {
            fileName.textContent = "Selected: " + this.files[0].name;
        }
    });
}
    renderProducts('all');
    lucide.createIcons();
});
