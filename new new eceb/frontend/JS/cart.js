// Cart functionality for LocalBite

document.addEventListener('DOMContentLoaded', function() {
    initializeCart();
});

function initializeCart() {
    displayCartItems();
    setupCartEventListeners();
    updateCartSummary();
}

function displayCartItems() {
    const cartItemsContainer = document.getElementById('cart-items');
    const emptyCart = document.getElementById('empty-cart');
    const cartSummary = document.getElementById('cart-summary');
    const checkoutBtn = document.getElementById('checkout-btn');
    
    const cart = getCart();
    
    if (cart.length === 0) {
        if (emptyCart) emptyCart.style.display = 'block';
        if (cartSummary) cartSummary.style.display = 'none';
        if (checkoutBtn) checkoutBtn.style.display = 'none';
        return;
    }
    
    if (emptyCart) emptyCart.style.display = 'none';
    if (cartSummary) cartSummary.style.display = 'block';
    if (checkoutBtn) checkoutBtn.style.display = 'block';
    
    let cartHTML = '';
    
    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        cartHTML += `
            <div class="cart-item" data-index="${index}">
                <div class="item-details">
                    <div class="item-info">
                        <h4>${item.dish}</h4>
                        <p>${formatCurrency(item.price)} each</p>
                    </div>
                </div>
                <div class="quantity-controls">
                    <button class="quantity-btn decrease" data-index="${index}">
                        <i class="fas fa-minus"></i>
                    </button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn increase" data-index="${index}">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
                <div class="item-total">${formatCurrency(itemTotal)}</div>
                <button class="remove-item" data-index="${index}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
    });
    
    if (cartItemsContainer) {
        cartItemsContainer.innerHTML = cartHTML;
    }
}

function setupCartEventListeners() {
    // Decrease quantity
    document.addEventListener('click', function(e) {
        if (e.target.closest('.decrease')) {
            const index = e.target.closest('.decrease').getAttribute('data-index');
            updateQuantity(index, -1);
        }
    });
    
    // Increase quantity
    document.addEventListener('click', function(e) {
        if (e.target.closest('.increase')) {
            const index = e.target.closest('.increase').getAttribute('data-index');
            updateQuantity(index, 1);
        }
    });
    
    // Remove item
    document.addEventListener('click', function(e) {
        if (e.target.closest('.remove-item')) {
            const index = e.target.closest('.remove-item').getAttribute('data-index');
            removeFromCart(index);
        }
    });
}

function updateQuantity(index, change) {
    const cart = getCart();
    const item = cart[index];
    
    item.quantity += change;
    
    if (item.quantity <= 0) {
        removeFromCart(index);
        return;
    }
    
    saveCart(cart);
    displayCartItems();
    updateCartSummary();
    updateCartCount();
}

function removeFromCart(index) {
    const cart = getCart();
    const removedItem = cart[index];
    cart.splice(index, 1);
    saveCart(cart);
    displayCartItems();
    updateCartSummary();
    updateCartCount();
    
    showNotification(`${removedItem.dish} removed from cart`);
    
    if (cart.length === 0) {
        showNotification('Cart is now empty');
    }
}

function updateCartSummary() {
    const cart = getCart();
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryFee = 30;
    const tax = subtotal * 0.05;
    const total = subtotal + deliveryFee + tax;
    
    const subtotalElement = document.getElementById('subtotal');
    const taxElement = document.getElementById('tax');
    const totalElement = document.getElementById('total');
    
    if (subtotalElement) subtotalElement.textContent = formatCurrency(subtotal);
    if (taxElement) taxElement.textContent = formatCurrency(tax);
    if (totalElement) totalElement.textContent = formatCurrency(total);
}

// For checkout page
function displayOrderSummary() {
    const orderItemsContainer = document.getElementById('order-items');
    const cart = getCart();
    
    if (!orderItemsContainer || cart.length === 0) return;
    
    let orderHTML = '';
    let subtotal = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        
        orderHTML += `
            <div class="order-item">
                <span>${item.dish} x ${item.quantity}</span>
                <span>${formatCurrency(itemTotal)}</span>
            </div>
        `;
    });
    
    const deliveryFee = 30;
    const tax = subtotal * 0.05;
    const total = subtotal + deliveryFee + tax;
    
    orderHTML += `
        <div class="order-item">
            <span>Subtotal</span>
            <span>${formatCurrency(subtotal)}</span>
        </div>
        <div class="order-item">
            <span>Delivery Fee</span>
            <span>${formatCurrency(deliveryFee)}</span>
        </div>
        <div class="order-item">
            <span>Tax (5%)</span>
            <span>${formatCurrency(tax)}</span>
        </div>
        <div class="order-item total">
            <span>Total</span>
            <span>${formatCurrency(total)}</span>
        </div>
    `;
    
    orderItemsContainer.innerHTML = orderHTML;
    
    // Update summary details
    const orderSubtotal = document.getElementById('order-subtotal');
    const orderTax = document.getElementById('order-tax');
    const orderTotal = document.getElementById('order-total');
    
    if (orderSubtotal) orderSubtotal.textContent = formatCurrency(subtotal);
    if (orderTax) orderTax.textContent = formatCurrency(tax);
    if (orderTotal) orderTotal.textContent = formatCurrency(total);
    
    return { subtotal, deliveryFee, tax, total };
}

// Clear cart
function clearCart() {
    localStorage.removeItem('localbite_cart');
    updateCartCount();
}