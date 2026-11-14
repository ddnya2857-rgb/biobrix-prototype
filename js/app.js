// 1. تهيئة قاعدة البيانات المحلية (localStorage) عند فتح الموقع لأول مرة
function initDatabase() {
  if (!localStorage.getItem('biobrix_products')) {
    const defaultProducts = [
      {
        id: 'prod-1',
        name: 'BIOBRIX – Charbon écologique pour barbecue',
        shortDesc: 'Charbon naturel haute performance issu de la valorisation des noyaux de dattes et résidus d’olives.',
        fullDesc: 'Notre charbon écologique BIOBRIX offre une combustion longue durée, sans fumée nocive ni odeur chimique. Conçu en Algérie à partir de déchets agricoles locaux, il constitue l’alternative idéale et durable au charbon de bois traditionnel.',
        weight: '3 kg',
        price: 650,
        stock: 50,
        materials: 'Noyaux de dattes broyés, grignons d’olives, liant naturel.',
        image: 'images/product-charcoal.jpg'
      }
    ];
    localStorage.setItem('biobrix_products', JSON.stringify(defaultProducts));
  }

  if (!localStorage.getItem('biobrix_cart')) {
    localStorage.setItem('biobrix_cart', JSON.stringify([]));
  }

  if (!localStorage.getItem('biobrix_orders')) {
    localStorage.setItem('biobrix_orders', JSON.stringify([]));
  }
}

// 2. دوال جلب البيانات
function getProducts() {
  return JSON.parse(localStorage.getItem('biobrix_products')) || [];
}

function getCart() {
  return JSON.parse(localStorage.getItem('biobrix_cart')) || [];
}

function getOrders() {
  return JSON.parse(localStorage.getItem('biobrix_orders')) || [];
}

// 3. تحديث عداد السلة في الشريط العلوي
function updateCartBadge() {
  const cart = getCart();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const badges = document.querySelectorAll('.cart-badge');
  badges.forEach(badge => {
    badge.textContent = totalItems;
  });
}

// 4. إضافة منتج إلى السلة
function addToCart(productId, quantity = 1) {
  const products = getProducts();
  const product = products.find(p => p.id === productId);
  if (!product) return;

  let cart = getCart();
  const existingItem = cart.find(item => item.id === productId);

  if (existingItem) {
    existingItem.quantity += parseInt(quantity);
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      weight: product.weight,
      image: product.image,
      quantity: parseInt(quantity)
    });
  }

  localStorage.setItem('biobrix_cart', JSON.stringify(cart));
  updateCartBadge();
  alert('Produit ajouté au panier avec succès !');
}

// 5. قائمة الهاتف المتجاوبة
function setupMobileMenu() {
  const toggleBtn = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (toggleBtn && navLinks) {
    toggleBtn.addEventListener('click', () => {
      navLinks.classList.toggle('show');
    });
  }
}

// تشغيل التهيئة عند تحميل أي صفحة
document.addEventListener('DOMContentLoaded', () => {
  initDatabase();
  updateCartBadge();
  setupMobileMenu();
});

