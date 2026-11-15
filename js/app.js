// دالة إضافة المنتج إلى السلة
function addToCart(id, name, price) {
    let cart = JSON.parse(localStorage.getItem('biobrix_cart')) || [];
    
    // البحث عما إذا كان المنتج موجوداً مسبقاً
    let existingItem = cart.find(item => item.id === id);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ id: id, name: name, price: price, quantity: 1 });
    }
    
    localStorage.setItem('biobrix_cart', JSON.stringify(cart));
    updateCartCount();
    alert('✅ Produit ajouté au panier avec succès !');
}

// تحديث عداد السلة في الشريط العلوي
function updateCartCount() {
    let cart = JSON.parse(localStorage.getItem('biobrix_cart')) || [];
    let totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    let countElement = document.getElementById('cart-count');
    if (countElement) {
        countElement.innerText = totalCount;
    }
}

// عرض محتويات السلة في صفحة cart.html
function displayCart() {
    let cart = JSON.parse(localStorage.getItem('biobrix_cart')) || [];
    let container = document.getElementById('cart-items');
    let totalContainer = document.getElementById('cart-total');
    
    if (!container) return;
    
    if (cart.length === 0) {
        container.innerHTML = '<p>Votre panier est vide.</p>';
        if (totalContainer) totalContainer.innerText = '0';
        return;
    }
    
    let html = '<table style="width:100%; border-collapse: collapse; margin-bottom: 20px;">';
    html += '<tr style="border-bottom: 2px solid #ddd; text-align: left;"><th>Produit</th><th>Prix</th><th>Quantité</th><th>Total</th></tr>';
    
    let total = 0;
    cart.forEach((item, index) => {
        let itemTotal = item.price * item.quantity;
        total += itemTotal;
        html += `<tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 10px 0;">${item.name}</td>
            <td>${item.price} DA</td>
            <td>${item.quantity}</td>
            <td>${itemTotal} DA</td>
            <td><button onclick="removeItem(${index})" style="background:#ff4d4d; color:white; border:none; padding:5px 10px; border-radius:4px; cursor:pointer;">Supprimer</button></td>
        </tr>`;
    });
    html += '</table>';
    container.innerHTML = html;
    if (totalContainer) totalContainer.innerText = total;
}

// حذف منتج من السلة
function removeItem(index) {
    let cart = JSON.parse(localStorage.getItem('biobrix_cart')) || [];
    cart.splice(index, 1);
    localStorage.setItem('biobrix_cart', JSON.stringify(cart));
    displayCart();
    updateCartCount();
}

// تنفيذ الوظائف عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    displayCart();

    // معالجة نموذج إتمام الطلب (Checkout)
    let checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', (e) => {
            e.preventDefault();
            let name = document.getElementById('customer-name').value;
            let phone = document.getElementById('customer-phone').value;
            let wilaya = document.getElementById('customer-wilaya').value;
            let address = document.getElementById('customer-address').value;
            let payment = document.getElementById('payment-method').value;
            
            let order = {
                name, phone, wilaya, address, payment,
                date: new Date().toLocaleString(),
                items: JSON.parse(localStorage.getItem('biobrix_cart')) || []
            };

            let orders = JSON.parse(localStorage.getItem('biobrix_orders')) || [];
            orders.push(order);
            localStorage.setItem('biobrix_orders', JSON.stringify(orders));
            localStorage.removeItem('biobrix_cart');

            alert('🎉 Commande validée avec succès ! Merci de votre confiance.');
            window.location.href = 'index.html';
        });
    }

    // عرض الطلبات في لوحة الإدارة (Admin)
    let ordersList = document.getElementById('orders-list');
    if (ordersList) {
        let orders = JSON.parse(localStorage.getItem('biobrix_orders')) || [];
        if (orders.length === 0) {
            ordersList.innerHTML = '<p>Aucune commande enregistrée pour le moment.</p>';
        } else {
            let html = '';
            orders.forEach((ord, i) => {
                html += `<div class="card" style="margin-bottom: 15px;">
                    <h3>Commande #${i+1} - ${ord.name}</h3>
                    <p><strong>Téléphone :</strong> ${ord.phone}</p>
                    <p><strong>Wilaya :</strong> ${ord.wilaya}</p>
                    <p><strong>Adresse :</strong> ${ord.address}</p>
                    <p><strong>Paiement :</strong> ${ord.payment}</p>
                    <p><strong>Date :</strong> ${ord.date}</p>
                </div>`;
            });
            ordersList.innerHTML = html;
        }
    }
});

