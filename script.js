// Simple particle background animation
(function initParticles() {
  const canvas = document.getElementById('bg-particles');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const particles = [];
  const colors = ['#ffde7d', '#ff9a3c', '#ff4b5c', '#ffc857'];

  function resize() {
    canvas.width = window.innerWidth * window.devicePixelRatio;
    canvas.height = window.innerHeight * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  }

  window.addEventListener('resize', resize);
  resize();

  const COUNT = 40;
  for (let i = 0; i < COUNT; i++) {
    particles.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: 1 + Math.random() * 2,
      speedX: (Math.random() - 0.5) * 0.2,
      speedY: (Math.random() - 0.5) * 0.2,
      color: colors[Math.floor(Math.random() * colors.length)],
    });
  }

  function tick() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    particles.forEach((p) => {
      p.x += p.speedX;
      p.y += p.speedY;
      if (p.x < 0) p.x = window.innerWidth;
      if (p.x > window.innerWidth) p.x = 0;
      if (p.y < 0) p.y = window.innerHeight;
      if (p.y > window.innerHeight) p.y = 0;

      const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4);
      gradient.addColorStop(0, p.color);
      gradient.addColorStop(1, 'transparent');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2);
      ctx.fill();
    });
    requestAnimationFrame(tick);
  }

  tick();
})();

// Navigation toggle for mobile
(function initNav() {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.main-nav');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    nav.classList.toggle('open');
  });
})();

// Scroll animations
(function initScrollAnimations() {
  const elements = document.querySelectorAll('[data-animate]');
  if (!('IntersectionObserver' in window) || !elements.length) {
    elements.forEach((el) => el.classList.add('animated'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16 }
  );

  elements.forEach((el) => observer.observe(el));
})();

// Cart + products helpers
const STORAGE_KEYS = {
  PRODUCTS: 'sb_hotchips_products',
  CART: 'sb_hotchips_cart',
  ORDER: 'sb_hotchips_last_order',
  DISTANCE_KM: 'sb_hotchips_distance_km',
  ADMIN_SESSION: 'sb_hotchips_admin_session',
};

// Update these shop coordinates if needed (Keelkattalai, Chennai)
const SHOP_LOCATION = {
  lat: 12.9562,
  lon: 80.1866,
};

const defaultProducts = [
  // CHIPS
  { id: 'potato-chips-salt', name: 'Potato chips (salt)', price: 100, image: 'images/products/chips.jpg', tag: 'Chips' },
  { id: 'potato-chips-spicy', name: 'Potato chips (spicy)', price: 100, image: 'images/products/chips.jpg', tag: 'Chips' },
  { id: 'lays-tomato', name: 'Lays (tomato flavour)', price: 100, image: 'images/products/chips.jpg', tag: 'Chips' },
  { id: 'potato-masala-chips', name: 'Potato masala chips', price: 100, image: 'images/products/chips.jpg', tag: 'Chips' },
  { id: 'potato-finger-masala', name: 'Potato finger masala chips', price: 100, image: 'images/products/chips.jpg', tag: 'Chips' },
  { id: 'potato-masala-pudhina', name: 'Potato masala chips (pudhina flavour)', price: 100, image: 'images/products/chips.jpg', tag: 'Chips' },
  { id: 'nendram-chips', name: 'Nendram chips', price: 100, image: 'images/products/chips.jpg', tag: 'Chips' },
  { id: 'vaazhakai-chips', name: 'Vaazhakai chips', price: 100, image: 'images/products/chips.jpg', tag: 'Chips' },
  { id: 'vaazhai-thandu-chips', name: 'Vaazhai thandu chips', price: 100, image: 'images/products/chips.jpg', tag: 'Chips' },
  { id: 'maravalli-chips', name: 'Maravalli chips', price: 100, image: 'images/products/chips.jpg', tag: 'Chips' },
  { id: 'maravalli-finger-chips', name: 'Maravalli finger chips', price: 100, image: 'images/products/chips.jpg', tag: 'Chips' },
  { id: 'pala-chips', name: 'Pala chips', price: 100, image: 'images/products/chips.jpg', tag: 'Chips' },
  { id: 'carrot-chips', name: 'Carrot chips', price: 100, image: 'images/products/chips.jpg', tag: 'Chips' },
  { id: 'ladys-finger-chips', name: 'Ladys finger chips', price: 100, image: 'images/products/chips.jpg', tag: 'Chips' },
  { id: 'bitterguard-chips', name: 'Bitterguard chips', price: 100, image: 'images/products/chips.jpg', tag: 'Chips' },
  { id: 'picnic', name: 'Picnic', price: 100, image: 'images/products/chips.jpg', tag: 'Chips' },

  // FRYUMS
  { id: 'wheel-chips', name: 'Wheel chips (salt/spicy)', price: 80, image: 'images/products/fryums.jpg', tag: 'Fryums' },
  { id: 'triangle-chips', name: 'Triangle chips (salt/spicy)', price: 80, image: 'images/products/fryums.jpg', tag: 'Fryums' },
  { id: 'corn-fryum', name: 'Corn', price: 80, image: 'images/products/fryums.jpg', tag: 'Fryums' },
  { id: 'lays-fryum', name: 'Lays fryum', price: 80, image: 'images/products/fryums.jpg', tag: 'Fryums' },
  { id: 'finger-fryum', name: 'Finger fryum', price: 80, image: 'images/products/fryums.jpg', tag: 'Fryums' },
  { id: 'twister-fryum', name: 'Twister fryum', price: 80, image: 'images/products/fryums.jpg', tag: 'Fryums' },
  { id: 'onion-fryum', name: 'Onion fryum', price: 80, image: 'images/products/fryums.jpg', tag: 'Fryums' },
  { id: 'garlic-fryum', name: 'Garlic fryum', price: 80, image: 'images/products/fryums.jpg', tag: 'Fryums' },
  { id: 'cheese-ball', name: 'Cheese ball', price: 80, image: 'images/products/fryums.jpg', tag: 'Fryums' },
  { id: 'corn-puff', name: 'Corn puff', price: 80, image: 'images/products/fryums.jpg', tag: 'Fryums' },

  // MURUKKU ITEMS
  { id: 'thaen-kuzhal-murukku', name: 'Thaen kuzhal murukku', price: 120, image: 'images/products/murukku.jpg', tag: 'Murukku' },
  { id: 'thaenga-pal-murukku', name: 'Thaenga pal murukku', price: 120, image: 'images/products/murukku.jpg', tag: 'Murukku' },
  { id: 'mullu-murukku', name: 'Mullu murukku', price: 120, image: 'images/products/murukku.jpg', tag: 'Murukku' },
  { id: 'classic-murukku', name: 'Murukku', price: 120, image: 'images/products/murukku.jpg', tag: 'Murukku' },
  { id: 'garlic-murukku', name: 'Garlic murukku', price: 120, image: 'images/products/murukku.jpg', tag: 'Murukku' },
  { id: 'thattai', name: 'Thattai', price: 120, image: 'images/products/murukku.jpg', tag: 'Murukku' },
  { id: 'pepper-thattai', name: 'Pepper thattai', price: 120, image: 'images/products/murukku.jpg', tag: 'Murukku' },
  { id: 'maida-thattai', name: 'Maida thattai', price: 120, image: 'images/products/murukku.jpg', tag: 'Murukku' },
  { id: 'achu-murukku', name: 'Achu murukku', price: 120, image: 'images/products/murukku.jpg', tag: 'Murukku' },

  // BREAD
  { id: 'bread', name: 'Bread', price: 40, image: 'images/products/bread.jpg', tag: 'Bread' },
  { id: 'jam-bun', name: 'Jam bun', price: 30, image: 'images/products/bread.jpg', tag: 'Bread' },
  { id: 'frooti-cream-bun', name: 'Frooti cream bun', price: 30, image: 'images/products/bread.jpg', tag: 'Bread' },
  { id: 'cup-cake', name: 'Cup cake', price: 20, image: 'images/products/bread.jpg', tag: 'Bread' },

  // MIXTURES
  { id: 'avul-mixture', name: 'Avul mixture', price: 110, image: 'images/products/mixture.jpg', tag: 'Mixture' },
  { id: 'kerala-mixture', name: 'Kerala mixture', price: 110, image: 'images/products/mixture.jpg', tag: 'Mixture' },
  { id: 'special-mixture', name: 'Special mixture', price: 110, image: 'images/products/mixture.jpg', tag: 'Mixture' },
  { id: 'kaaraboondhi', name: 'Kaaraboondhi', price: 110, image: 'images/products/mixture.jpg', tag: 'Mixture' },
  { id: 'ompodi', name: 'Ompodi', price: 110, image: 'images/products/mixture.jpg', tag: 'Mixture' },
  { id: 'milagu-saev', name: 'Milagu saev', price: 110, image: 'images/products/mixture.jpg', tag: 'Mixture' },
  { id: 'om-saev', name: 'Om saev', price: 110, image: 'images/products/mixture.jpg', tag: 'Mixture' },
  { id: 'ribbon-saev', name: 'Ribbon saev', price: 110, image: 'images/products/mixture.jpg', tag: 'Mixture' },
  { id: 'masala-kadalai', name: 'Masala kadalai', price: 110, image: 'images/products/mixture.jpg', tag: 'Mixture' },
  { id: 'masala-oil-peanut', name: 'Masala oil peanut', price: 110, image: 'images/products/mixture.jpg', tag: 'Mixture' },
  { id: 'butter-murukku', name: 'Butter murukku', price: 110, image: 'images/products/mixture.jpg', tag: 'Mixture' },
  { id: 'dal', name: 'Dal', price: 110, image: 'images/products/mixture.jpg', tag: 'Mixture' },
  { id: 'uppu-kadalai', name: 'Uppu kadalai', price: 110, image: 'images/products/mixture.jpg', tag: 'Mixture' },
  { id: 'green-pattani', name: 'Green pattani', price: 110, image: 'images/products/mixture.jpg', tag: 'Mixture' },
  { id: 'navadhaaniyam', name: 'Navadhaaniyam', price: 110, image: 'images/products/mixture.jpg', tag: 'Mixture' },

  // SWEETS
  { id: 'gulab-jamun', name: 'Gulab jamun', price: 150, image: 'images/products/sweets.jpg', tag: 'Sweets' },
  { id: 'tirunelveli-alwa', name: 'Tirunelveli alwa', price: 150, image: 'images/products/sweets.jpg', tag: 'Sweets' },
  { id: 'muscoth-alwa', name: 'Muscoth alwa', price: 150, image: 'images/products/sweets.jpg', tag: 'Sweets' },
  { id: 'wheat-alwa', name: 'Wheat alwa', price: 150, image: 'images/products/sweets.jpg', tag: 'Sweets' },
  { id: 'rasagulla', name: 'Rasagulla', price: 150, image: 'images/products/sweets.jpg', tag: 'Sweets' },
  { id: 'soan-papudi', name: 'Soan papudi', price: 150, image: 'images/products/sweets.jpg', tag: 'Sweets' },
  { id: 'poli-dal', name: 'Poli (dal)', price: 150, image: 'images/products/sweets.jpg', tag: 'Sweets' },
  { id: 'macroons', name: 'Macroons', price: 150, image: 'images/products/sweets.jpg', tag: 'Sweets' },
  { id: 'appam', name: 'Appam', price: 150, image: 'images/products/sweets.jpg', tag: 'Sweets' },
  { id: 'palkova', name: 'Palkova', price: 150, image: 'images/products/sweets.jpg', tag: 'Sweets' },
  { id: 'coconut-burfi-balls', name: 'Coconut burfi (in balls)', price: 150, image: 'images/products/sweets.jpg', tag: 'Sweets' },
  { id: 'thaen-mittai', name: 'Thaen mittai', price: 150, image: 'images/products/sweets.jpg', tag: 'Sweets' },
  { id: 'athurasam', name: 'Athurasam', price: 150, image: 'images/products/sweets.jpg', tag: 'Sweets' },
  { id: 'somasu', name: 'Somasu', price: 150, image: 'images/products/sweets.jpg', tag: 'Sweets' },

  // OTHERS
  { id: 'pori-urundai', name: 'Pori urundai', price: 60, image: 'images/products/others.jpg', tag: 'Others' },
  { id: 'corn-urndai', name: 'Corn urndai', price: 60, image: 'images/products/others.jpg', tag: 'Others' },
  { id: 'peanut-urundai', name: 'Peanut urundai', price: 60, image: 'images/products/others.jpg', tag: 'Others' },
  { id: 'udacha-kadailai-urundai', name: 'Udacha kadailai urundai', price: 60, image: 'images/products/others.jpg', tag: 'Others' },
  { id: 'yellu-urundai', name: 'Yellu urundai (black/white)', price: 60, image: 'images/products/others.jpg', tag: 'Others' },
  { id: 'burfi', name: 'Burfi', price: 60, image: 'images/products/others.jpg', tag: 'Others' },
  { id: 'rava-laddu', name: 'Rava laddu', price: 60, image: 'images/products/others.jpg', tag: 'Others' },
  { id: 'coconut-burfi-sugar', name: 'Coconut burfi(sugar/jaggery)', price: 60, image: 'images/products/others.jpg', tag: 'Others' },
  { id: 'pop-corn', name: 'Pop corn', price: 40, image: 'images/products/others.jpg', tag: 'Others' },
  { id: 'masala-pori', name: 'Masala pori', price: 40, image: 'images/products/others.jpg', tag: 'Others' },

  // BISCUITS
  { id: 'butter-biscuit', name: 'Butter biscuit', price: 80, image: 'images/products/biscuit.jpg', tag: 'Biscuit' },
  { id: 'ragi-biscuit', name: 'Ragi biscuit', price: 80, image: 'images/products/biscuit.jpg', tag: 'Biscuit' },
  { id: 'nei-biscuit', name: 'Nei biscuit', price: 80, image: 'images/products/biscuit.jpg', tag: 'Biscuit' },
  { id: 'nice-biscuit', name: 'Nice biscuit', price: 80, image: 'images/products/biscuit.jpg', tag: 'Biscuit' },
  { id: 'coconut-biscuit-mini', name: 'Coconut biscuit (mini size)', price: 80, image: 'images/products/biscuit.jpg', tag: 'Biscuit' },
  { id: 'malkist', name: 'Malkist (chocolate/cheese)', price: 80, image: 'images/products/biscuit.jpg', tag: 'Biscuit' },
  { id: 'hide-and-seek', name: 'Hide and seek', price: 80, image: 'images/products/biscuit.jpg', tag: 'Biscuit' },
  { id: 'moms-magic', name: 'Mom’s magic', price: 80, image: 'images/products/biscuit.jpg', tag: 'Biscuit' },
  { id: 'waffers', name: 'Waffers (chocolate,vennila,orange,strawberry)', price: 80, image: 'images/products/biscuit.jpg', tag: 'Biscuit' },
  { id: 'alphabet-biscuit', name: 'Alphabet biscuit', price: 80, image: 'images/products/biscuit.jpg', tag: 'Biscuit' },
  { id: 'number-biscuit', name: 'Number biscuit', price: 80, image: 'images/products/biscuit.jpg', tag: 'Biscuit' },
  { id: 'banana-biscuit', name: 'Banana biscuit', price: 80, image: 'images/products/biscuit.jpg', tag: 'Biscuit' },
  { id: 'little-hearts', name: 'Little hearts', price: 80, image: 'images/products/biscuit.jpg', tag: 'Biscuit' },
  { id: 'nutrichoice', name: 'Nutrichoice', price: 80, image: 'images/products/biscuit.jpg', tag: 'Biscuit' },
  { id: 'mariegold', name: 'Mariegold', price: 80, image: 'images/products/biscuit.jpg', tag: 'Biscuit' },
  { id: 'marielight', name: 'Marielight', price: 80, image: 'images/products/biscuit.jpg', tag: 'Biscuit' },
  { id: 'milk-classic', name: 'Milk classic', price: 80, image: 'images/products/biscuit.jpg', tag: 'Biscuit' },
  { id: 'milk-bikis', name: 'Milk bikis', price: 80, image: 'images/products/biscuit.jpg', tag: 'Biscuit' },
  { id: 'good-day', name: 'Good day', price: 80, image: 'images/products/biscuit.jpg', tag: 'Biscuit' },
  { id: 'dark-fantasy', name: 'Dark fantasy', price: 80, image: 'images/products/biscuit.jpg', tag: 'Biscuit' },
  { id: 'bourbon', name: 'Bourbon', price: 80, image: 'images/products/biscuit.jpg', tag: 'Biscuit' },
  { id: 'treat', name: 'Treat', price: 80, image: 'images/products/biscuit.jpg', tag: 'Biscuit' },
  { id: 'parle-g', name: 'Parle – G', price: 80, image: 'images/products/biscuit.jpg', tag: 'Biscuit' },
  { id: 'pure-magic', name: 'Pure magic', price: 80, image: 'images/products/biscuit.jpg', tag: 'Biscuit' },
  { id: '50-50', name: '50 50', price: 80, image: 'images/products/biscuit.jpg', tag: 'Biscuit' },
  { id: 'maska-chaska', name: 'Maska chaska', price: 80, image: 'images/products/biscuit.jpg', tag: 'Biscuit' },
  { id: 'animal-bisuit', name: 'Animal bisuit', price: 80, image: 'images/products/biscuit.jpg', tag: 'Biscuit' },
  { id: 'salt-biscuit', name: 'Salt biscuit', price: 80, image: 'images/products/biscuit.jpg', tag: 'Biscuit' },
  { id: 'milk-cream-biscuit', name: 'Milk cream biscuit', price: 80, image: 'images/products/biscuit.jpg', tag: 'Biscuit' },
  { id: 'lottee-choco-pei', name: 'Lottee choco pei', price: 80, image: 'images/products/biscuit.jpg', tag: 'Biscuit' },

  // RUSK
  { id: 'savera-cashew-rusk', name: 'Savera cashew rusk', price: 70, image: 'images/products/rusk.jpg', tag: 'Rusk' },
  { id: 'savera-milk-rusk', name: 'Savera milk rusk', price: 70, image: 'images/products/rusk.jpg', tag: 'Rusk' },
  { id: 'parle-milk-rusk', name: 'Parle milk rusk', price: 70, image: 'images/products/rusk.jpg', tag: 'Rusk' },
  { id: 'parle-elachi-rusk', name: 'Parle elachi rusk', price: 70, image: 'images/products/rusk.jpg', tag: 'Rusk' },
  { id: 'brittania-milk-rusk', name: 'Brittania milk rusk', price: 70, image: 'images/products/rusk.jpg', tag: 'Rusk' },
  { id: 'britania-elachi-rush', name: 'Britania elachi rush', price: 70, image: 'images/products/rusk.jpg', tag: 'Rusk' },

  // EVENING SPECIALS
  { id: 'onian-pakoda', name: 'Onion pakoda', price: 50, image: 'images/products/evening.jpg', tag: 'Evening' },
  { id: 'cauliflower-pakoda', name: 'Cauliflower pakoda', price: 60, image: 'images/products/evening.jpg', tag: 'Evening' },
  { id: 'samosa', name: 'Samosa', price: 15, image: 'images/products/evening.jpg', tag: 'Evening' },
  { id: 'cutlet', name: 'Cutlet', price: 20, image: 'images/products/evening.jpg', tag: 'Evening' },
  { id: 'mini-samosa', name: 'Mini samosa', price: 5, image: 'images/products/evening.jpg', tag: 'Evening' },
];

function getStoredProducts() {
  const stored = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
  if (!stored) return defaultProducts;
  try {
    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed) || !parsed.length) return defaultProducts;
    return parsed;
  } catch {
    return defaultProducts;
  }
}

function saveProducts(products) {
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
}

function getCart() {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.CART);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function getDistanceKm() {
  const raw = localStorage.getItem(STORAGE_KEYS.DISTANCE_KM);
  if (!raw) return 0;
  const value = Number(raw);
  return Number.isFinite(value) && value >= 0 ? value : 0;
}

function setDistanceKm(km) {
  const value = Number(km);
  const safe = Number.isFinite(value) && value >= 0 ? value : 0;
  localStorage.setItem(STORAGE_KEYS.DISTANCE_KM, String(safe));
}

function calcDeliveryCharge(km) {
  const distance = Number(km);
  if (!Number.isFinite(distance) || distance <= 0) return 0;
  return Math.ceil(distance) * 10;
}

function toRad(deg) {
  return (deg * Math.PI) / 180;
}

function haversineKm(a, b) {
  const R = 6371;
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lon - a.lon);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);

  const s =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(s), Math.sqrt(1 - s));
  return R * c;
}

async function fillDistanceFromGPS(targetInput) {
  if (!targetInput) return;
  if (!('geolocation' in navigator)) {
    alert('GPS not supported in this browser.');
    return;
  }

  targetInput.disabled = true;
  try {
    const pos = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 12000,
        maximumAge: 60000,
      });
    });

    const user = { lat: pos.coords.latitude, lon: pos.coords.longitude };
    const km = haversineKm(SHOP_LOCATION, user);
    const rounded = Math.max(0, Math.round(km * 10) / 10);
    targetInput.value = String(rounded);
    setDistanceKm(rounded);
    targetInput.dispatchEvent(new Event('input', { bubbles: true }));
  } catch (err) {
    const code = err && typeof err === 'object' ? err.code : 0;
    if (code === 1) {
      alert('Location permission denied. Please allow GPS or enter distance manually.');
    } else {
      alert('Unable to fetch GPS location. Please try again or enter distance manually.');
    }
  } finally {
    targetInput.disabled = false;
  }
}

function saveCart(cart) {
  localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
  updateCartBadge();
}

function addToCart(productId, quantity = 1) {
  const products = getStoredProducts();
  const product = products.find((p) => p.id === productId);
  if (!product) return;

  const cart = getCart();
  const existing = cart.find((item) => item.id === productId);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({ id: productId, quantity });
  }
  saveCart(cart);
  animateAddToCart();
}

function animateAddToCart() {
  const badges = document.querySelectorAll('.cart-count-badge');
  badges.forEach((badge) => {
    badge.classList.add('pulse');
    setTimeout(() => badge.classList.remove('pulse'), 400);
  });
}

function updateCartBadge() {
  const badges = document.querySelectorAll('.cart-count-badge');
  const totalQty = getCart().reduce((sum, item) => sum + item.quantity, 0);
  badges.forEach((badge) => {
    badge.textContent = totalQty;
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  updateCartBadge();
  initHomeBestsellers();
  initProductsPage();
  initAdminPanel();
  initCartPage();
  initCheckoutPage();
  initSuccessPage();
});

function initHomeBestsellers() {
  const grid = document.querySelector('[data-products-grid="bestsellers"]');
  if (!grid) return;

  const products = getStoredProducts().slice(0, 4);
  grid.innerHTML = products
    .map(
      (p) => `
      <article class="product-card">
        <div class="product-image-wrap">
          <span class="product-chip">${p.tag || 'Hot'}</span>
          <img src="${p.image}" alt="${p.name}" class="product-image" onerror="this.classList.add('placeholder'); this.removeAttribute('src'); this.textContent='${p.name}';" />
        </div>
        <div class="product-body">
          <div class="product-name">${p.name}</div>
          <div class="product-meta">
            <div class="product-price">₹${p.price} <span>/ 100g </span></div>
            <button class="btn btn-secondary btn-xs" data-add="${p.id}">Add</button>
          </div>
        </div>
      </article>
    `
    )
    .join('');

  grid.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-add]');
    if (!btn) return;
    addToCart(btn.getAttribute('data-add'));
  });
}

function initProductsPage() {
  const listEl = document.getElementById('product-list');
  const filterContainer = document.getElementById('category-filters');
  if (!listEl) return;

  function render(category = 'All') {
    let products = getStoredProducts();
    if (category !== 'All') {
      products = products.filter((p) => (p.tag || '').toLowerCase() === category.toLowerCase());
    }

    if (products.length === 0) {
      listEl.innerHTML = `<p class="no-products">No products found in the "${category}" category.</p>`;
      return;
    }

    listEl.innerHTML = products
      .map(
        (p) => `
      <article class="product-card" data-id="${p.id}">
        <div class="product-image-wrap">
          <span class="product-chip">${p.tag || 'Fresh'}</span>
          <img src="${p.image}" alt="${p.name}" class="product-image" onerror="this.classList.add('placeholder'); this.removeAttribute('src');" />
        </div>
        <div class="product-body">
          <div class="product-name">${p.name}</div>
          <div class="product-meta">
            <div class="product-price">₹${p.price} <span>/ 100g </span></div>
            <div class="product-add">
              <button class="btn btn-primary btn-sm" data-add="${p.id}">Add to Cart</button>
            </div>
          </div>
        </div>
      </article>
    `
      )
      .join('');
  }

  if (filterContainer) {
    filterContainer.addEventListener('click', (e) => {
      const btn = e.target.closest('.filter-btn');
      if (!btn) return;

      // Update active state
      filterContainer.querySelectorAll('.filter-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      // Re-render
      render(btn.getAttribute('data-category'));
    });
  }

  render();

  listEl.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-add]');
    if (!btn) return;
    addToCart(btn.getAttribute('data-add'));
  });
}

function initAdminPanel() {
  const form = document.getElementById('admin-product-form');
  const list = document.getElementById('admin-product-list');
  if (!form || !list) return;

  const authCard = document.getElementById('admin-auth');
  const panel = document.getElementById('admin-panel');
  const loginForm = document.getElementById('admin-login-form');
  const logoutBtn = document.getElementById('admin-logout-btn');
  const panelLogoutBtn = document.getElementById('admin-panel-logout');
  const hint = document.getElementById('admin-login-hint');

  const idInput = document.getElementById('admin-product-id');
  const nameInput = document.getElementById('admin-name');
  const priceInput = document.getElementById('admin-price');
  const imageInput = document.getElementById('admin-image');
  const saveBtn = document.getElementById('admin-save-btn');
  const resetBtn = document.getElementById('admin-reset-btn');

  const ADMIN_USER = 'balaji';
  const ADMIN_PASS = '7667052277';

  function isLoggedIn() {
    return localStorage.getItem(STORAGE_KEYS.ADMIN_SESSION) === '1';
  }

  function setLoggedIn(value) {
    localStorage.setItem(STORAGE_KEYS.ADMIN_SESSION, value ? '1' : '0');
  }

  function updateAdminVisibility() {
    const logged = isLoggedIn();
    if (authCard) authCard.style.display = logged ? 'none' : 'block';
    if (panel) panel.style.display = logged ? 'grid' : 'none';
    if (logoutBtn) logoutBtn.style.display = logged ? 'inline-flex' : 'none';
    if (!logged) resetForm();
    if (logged) render();
  }

  function render() {
    const products = getStoredProducts();
    list.innerHTML = products
      .map(
        (p) => `
        <div class="admin-product-item" data-id="${p.id}">
          <div class="admin-product-info">
            <img src="${p.image}" class="admin-product-thumb" onerror="this.src='images/placeholder.jpg'; this.onerror=null;" />
            <div class="admin-product-details">
              <span class="admin-product-name">${p.name}</span>
              <span class="admin-product-price">₹${p.price}</span>
              <span class="admin-product-tag">${p.tag || 'Custom'}</span>
            </div>
          </div>
          <div class="admin-product-controls">
            <button class="admin-btn edit">Edit</button>
            <button class="admin-btn delete">Delete</button>
          </div>
        </div>
      `
      )
      .join('');
  }

  const fileInput = document.getElementById('admin-image-file');

  // Image preview logic
  const previewContainer = document.createElement('div');
  previewContainer.className = 'admin-image-preview';
  previewContainer.style.marginTop = '0.5rem';
  previewContainer.style.display = 'none';
  imageInput.insertAdjacentElement('afterend', previewContainer);

  function setPreview(src) {
    if (src) {
      previewContainer.style.display = 'block';
      previewContainer.innerHTML = `<img src="${src}" style="max-height: 100px; border-radius: 8px;" onerror="this.parentElement.innerHTML='<span style-color:var(--accent-red)>Invalid Image Link</span>';" />`;
    } else {
      previewContainer.style.display = 'none';
    }
  }

  imageInput.addEventListener('input', () => {
    setPreview(imageInput.value.trim());
  });

  if (fileInput) {
    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target.result;
        imageInput.value = base64; // Temporarily store in URL field
        setPreview(base64);
      };
      reader.readAsDataURL(file);
    });
  }

  function resetForm() {
    idInput.value = '';
    nameInput.value = '';
    priceInput.value = '';
    imageInput.value = '';
    if (fileInput) fileInput.value = '';
    previewContainer.style.display = 'none';
    saveBtn.textContent = 'Add Product';
  }

  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const username = document.getElementById('admin-username')?.value?.trim() || '';
      const password = document.getElementById('admin-password')?.value || '';

      if (username === ADMIN_USER && password === ADMIN_PASS) {
        setLoggedIn(true);
        if (hint) hint.textContent = '';
        updateAdminVisibility();
      } else {
        if (hint) hint.textContent = 'Invalid username or password.';
      }
    });
  }

  function logout() {
    setLoggedIn(false);
    const u = document.getElementById('admin-username');
    const p = document.getElementById('admin-password');
    if (u) u.value = '';
    if (p) p.value = '';
    updateAdminVisibility();
  }

  if (logoutBtn) logoutBtn.addEventListener('click', logout);
  if (panelLogoutBtn) panelLogoutBtn.addEventListener('click', logout);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!isLoggedIn()) {
      alert('Please login as admin to manage products.');
      return;
    }
    const name = nameInput.value.trim();
    const price = Number(priceInput.value);
    const image = imageInput.value.trim();
    if (!name || !price) return;

    // Create ID from name if not editing
    const id = idInput.value || name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const products = getStoredProducts();
    const index = products.findIndex((p) => p.id === id);

    // Preserve existing tag if editing, otherwise default to 'Custom'
    const existingProduct = index >= 0 ? products[index] : null;

    const productData = {
      id,
      name,
      price,
      image: image || (existingProduct ? existingProduct.image : `images/products/${id}.jpg`),
      tag: existingProduct ? existingProduct.tag : 'Custom',
    };

    if (index >= 0 && idInput.value) {
      // Editing existing
      products[index] = productData;
    } else {
      // Adding new (ensure unique ID)
      if (products.some(p => p.id === id) && !idInput.value) {
        productData.id = id + '-' + Date.now().toString().slice(-4);
      }
      products.push(productData);
    }

    saveProducts(products);
    render();
    initProductsPage();
    initHomeBestsellers();
    resetForm();
    alert('Product saved successfully!');
  });

  list.addEventListener('click', (e) => {
    if (!isLoggedIn()) {
      alert('Please login as admin to manage products.');
      return;
    }
    const item = e.target.closest('.admin-product-item');
    if (!item) return;
    const id = item.getAttribute('data-id');
    const products = getStoredProducts();
    const product = products.find((p) => p.id === id);
    if (!product) return;

    if (e.target.classList.contains('edit')) {
      idInput.value = product.id;
      nameInput.value = product.name;
      priceInput.value = product.price;
      imageInput.value = product.image;
      imageInput.dispatchEvent(new Event('input')); // Trigger preview
      saveBtn.textContent = 'Update Product';
      window.scrollTo({ top: form.offsetTop - 100, behavior: 'smooth' });
    } else if (e.target.classList.contains('delete')) {
      if (confirm(`Are you sure you want to delete "${product.name}"?`)) {
        const filtered = products.filter((p) => p.id !== id);
        saveProducts(filtered);
        render();
        initProductsPage();
        initHomeBestsellers();
      }
    }
  });

  const resetDefaultsBtn = document.getElementById('admin-reset-defaults');
  if (resetDefaultsBtn) {
    resetDefaultsBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to reset all products and prices to defaults? This will erase your current modifications.')) {
        localStorage.removeItem(STORAGE_KEYS.PRODUCTS);
        render();
        initProductsPage();
        initHomeBestsellers();
        alert('Products reset to defaults. All 100+ items loaded!');
      }
    });
  }

  resetBtn.addEventListener('click', resetForm);
  updateAdminVisibility();
}

function initCartPage() {
  const itemsEl = document.getElementById('cart-items');
  const subtotalEl = document.getElementById('cart-subtotal');
  const packagingEl = document.getElementById('cart-packaging');
  const deliveryEl = document.getElementById('cart-delivery');
  const totalEl = document.getElementById('cart-total');
  const clearBtn = document.getElementById('clear-cart');
  const distanceInput = document.getElementById('cart-distance');

  if (!itemsEl || !subtotalEl || !packagingEl || !totalEl) return;

  const PACKAGING = 10;

  function render() {
    const products = getStoredProducts();
    const cart = getCart();
    if (!cart.length) {
      itemsEl.innerHTML = '<p>Your cart is empty. Add some crispy snacks from the products page.</p>';
      subtotalEl.textContent = '0';
      packagingEl.textContent = PACKAGING;
      if (deliveryEl) deliveryEl.textContent = '0';
      totalEl.textContent = '0';
      return;
    }

    let subtotal = 0;
    itemsEl.innerHTML = cart
      .map((item) => {
        const product = products.find((p) => p.id === item.id);
        if (!product) return '';
        const lineTotal = product.price * item.quantity;
        subtotal += lineTotal;
        return `
          <div class="cart-item" data-id="${product.id}">
            <div class="cart-thumb">
              <img src="${product.image}" alt="${product.name}" onerror="this.parentElement.innerHTML='<span>${product.name}</span>';" />
            </div>
            <div class="cart-info">
              <span>${product.name}</span>
              <span class="line">₹${product.price} x ${item.quantity}</span>
              <div class="cart-qty">
                <button data-action="dec">-</button>
                <span>${item.quantity}</span>
                <button data-action="inc">+</button>
              </div>
              <button class="cart-remove" data-action="remove">Remove</button>
            </div>
            <div class="cart-price">
              <strong>₹${lineTotal}</strong>
            </div>
          </div>
        `;
      })
      .join('');

    subtotalEl.textContent = subtotal;
    packagingEl.textContent = subtotal ? PACKAGING : 0;
    const km = distanceInput ? Number(distanceInput.value || 0) : getDistanceKm();
    const delivery = subtotal ? calcDeliveryCharge(km) : 0;
    if (deliveryEl) deliveryEl.textContent = delivery;
    totalEl.textContent = subtotal ? subtotal + PACKAGING + delivery : 0;
  }

  if (distanceInput) {
    distanceInput.value = getDistanceKm() || '';
    distanceInput.addEventListener('input', () => {
      setDistanceKm(distanceInput.value);
      render();
    });
  }

  const useGpsBtn = document.getElementById('cart-use-gps');
  if (useGpsBtn && distanceInput) {
    useGpsBtn.addEventListener('click', () => fillDistanceFromGPS(distanceInput));
  }

  if (distanceInput && !distanceInput.value) {
    setTimeout(() => {
      fillDistanceFromGPS(distanceInput);
    }, 600);
  }

  itemsEl.addEventListener('click', (e) => {
    const itemEl = e.target.closest('.cart-item');
    if (!itemEl) return;
    const id = itemEl.getAttribute('data-id');
    const action = e.target.getAttribute('data-action');
    if (!action) return;

    let cart = getCart();
    const index = cart.findIndex((item) => item.id === id);
    if (index === -1) return;

    if (action === 'inc') {
      cart[index].quantity += 1;
    } else if (action === 'dec') {
      cart[index].quantity = Math.max(1, cart[index].quantity - 1);
    } else if (action === 'remove') {
      cart.splice(index, 1);
    }

    saveCart(cart);
    render();
  });

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      localStorage.removeItem(STORAGE_KEYS.CART);
      render();
      updateCartBadge();
    });
  }

  render();
}

function initCheckoutPage() {
  const form = document.getElementById('checkout-form');
  const itemsEl = document.getElementById('checkout-summary-items');
  const subtotalEl = document.getElementById('checkout-subtotal');
  const packagingEl = document.getElementById('checkout-packaging');
  const deliveryEl = document.getElementById('checkout-delivery');
  const totalEl = document.getElementById('checkout-total');
  const distanceInput = document.getElementById('checkout-distance');
  const paymentModal = document.getElementById('payment-modal');
  const paymentClose = document.getElementById('payment-close');
  const paymentCancel = document.getElementById('payment-cancel');
  const paymentPayNow = document.getElementById('payment-paynow');
  const payAmountEl = document.getElementById('pay-amount');

  if (!form || !itemsEl || !subtotalEl || !packagingEl || !totalEl) return;

  const PACKAGING = 10;
  let pendingOrder = null;

  function renderSummary() {
    const products = getStoredProducts();
    const cart = getCart();
    if (!cart.length) {
      itemsEl.innerHTML = '<p>Your cart is empty. Please add items before checkout.</p>';
      subtotalEl.textContent = '0';
      packagingEl.textContent = PACKAGING;
      if (deliveryEl) deliveryEl.textContent = '0';
      totalEl.textContent = '0';
      return false;
    }

    let subtotal = 0;
    itemsEl.innerHTML = cart
      .map((item) => {
        const product = products.find((p) => p.id === item.id);
        if (!product) return '';
        const lineTotal = product.price * item.quantity;
        subtotal += lineTotal;
        return `
          <div class="summary-row">
            <span>${product.name} x ${item.quantity}</span>
            <span>₹${lineTotal}</span>
          </div>
        `;
      })
      .join('');

    subtotalEl.textContent = subtotal;
    packagingEl.textContent = PACKAGING;
    const km = distanceInput ? Number(distanceInput.value || 0) : getDistanceKm();
    const delivery = calcDeliveryCharge(km);
    if (deliveryEl) deliveryEl.textContent = delivery;
    totalEl.textContent = subtotal + PACKAGING + delivery;
    if (payAmountEl) payAmountEl.textContent = String(subtotal + PACKAGING + delivery);

    return true;
  }

  function getPaymentMethod() {
    const method = form.querySelector('input[name="paymentMethod"]:checked');
    return method ? method.value : 'ONLINE';
  }

  function openPaymentModal(amount, order) {
    if (!paymentModal) return;
    pendingOrder = order;
    if (payAmountEl) payAmountEl.textContent = String(amount);
    paymentModal.classList.add('open');
    paymentModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closePaymentModal() {
    if (!paymentModal) return;
    paymentModal.classList.remove('open');
    paymentModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function initPaymentTabs() {
    if (!paymentModal) return;
    const tabs = paymentModal.querySelectorAll('[data-paytab]');
    const panels = paymentModal.querySelectorAll('[data-panel]');
    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        const key = tab.getAttribute('data-paytab');
        tabs.forEach((t) => t.classList.toggle('active', t === tab));
        panels.forEach((p) => p.classList.toggle('active', p.getAttribute('data-panel') === key));
      });
    });
  }

  if (distanceInput) {
    distanceInput.value = getDistanceKm() || '';
    distanceInput.addEventListener('input', () => {
      setDistanceKm(distanceInput.value);
      renderSummary();
    });
  }

  const useGpsBtn = document.getElementById('checkout-use-gps');
  if (useGpsBtn && distanceInput) {
    useGpsBtn.addEventListener('click', () => fillDistanceFromGPS(distanceInput));
  }

  if (distanceInput && !distanceInput.value) {
    setTimeout(() => {
      fillDistanceFromGPS(distanceInput);
    }, 600);
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const hasItems = renderSummary();
    if (!hasItems) {
      alert('Your cart is empty. Please add items before placing an order.');
      return;
    }

    const order = {
      name: form.customerName.value.trim(),
      phone: form.customerPhone.value.trim(),
      address: form.customerAddress.value.trim(),
      distanceKm: distanceInput ? Number(distanceInput.value || 0) : getDistanceKm(),
      deliveryCharge: Number(deliveryEl?.textContent || 0) || 0,
      paymentMethod: getPaymentMethod(),
      total: Number(totalEl.textContent) || 0,
      timestamp: new Date().toISOString(),
      cart: getCart(),
    };

    if (!order.name || !order.phone || !order.address) {
      alert('Please fill all required fields.');
      return;
    }

    if (!Number.isFinite(order.distanceKm) || order.distanceKm <= 0) {
      alert('Please enter the distance (km) to calculate delivery charge.');
      return;
    }

    localStorage.setItem(STORAGE_KEYS.ORDER, JSON.stringify(order));

    if (order.paymentMethod === 'COD') {
      localStorage.removeItem(STORAGE_KEYS.CART);
      window.location.href = 'order-success.html';
    } else {
      openPaymentModal(order.total, order);
    }
  });

  initPaymentTabs();

  if (paymentClose) paymentClose.addEventListener('click', closePaymentModal);
  if (paymentCancel) paymentCancel.addEventListener('click', closePaymentModal);

  if (paymentModal) {
    paymentModal.addEventListener('click', (e) => {
      if (e.target === paymentModal) closePaymentModal();
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closePaymentModal();
  });

  if (paymentPayNow) {
    paymentPayNow.addEventListener('click', () => {
      const orderRaw = localStorage.getItem(STORAGE_KEYS.ORDER);
      if (!orderRaw || !pendingOrder) {
        alert('Please click "Place Order" again.');
        return;
      }
      closePaymentModal();
      localStorage.removeItem(STORAGE_KEYS.CART);
      window.location.href = 'order-success.html';
    });
  }

  renderSummary();
}

function initSuccessPage() {
  if (!document.body.classList.contains('page-success')) return;
  localStorage.removeItem(STORAGE_KEYS.ORDER);
}

