// Order tracking functionality

document.addEventListener('DOMContentLoaded', function() {
    initializeTracking();
});

function initializeTracking() {
    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get('orderId');
    
    if (orderId) {
        displayOrderTracking(orderId);
    } else {
        // Demo order tracking
        displayDemoTracking();
    }
}

function displayDemoTracking() {
    // Demo order data
    const demoOrder = {
        orderId: 'LB2025001',
        status: 'out_for_delivery',
        deliveryAddress: {
            name: 'John Doe',
            address: '123, Sector 15, Vashi, Navi Mumbai',
            phone: '+91 98765 43210'
        },
        items: [
            { name: 'Misal Pav', quantity: 2, price: 80 },
            { name: 'Vada Pav', quantity: 1, price: 35 },
            { name: 'Poha', quantity: 1, price: 60 }
        ],
        statusHistory: [
            { status: 'placed', timestamp: new Date(Date.now() - 30 * 60000), note: 'Order placed successfully' },
            { status: 'confirmed', timestamp: new Date(Date.now() - 25 * 60000), note: 'Order confirmed' },
            { status: 'preparing', timestamp: new Date(Date.now() - 20 * 60000), note: 'Chef started preparing your order' },
            { status: 'out_for_delivery', timestamp: new Date(Date.now() - 5 * 60000), note: 'Order out for delivery' }
        ],
        estimatedDelivery: new Date(Date.now() + 15 * 60000)
    };
    
    updateTrackingUI(demoOrder);
}

async function displayOrderTracking(orderId) {
    try {
        const response = await api.getOrder(orderId);
        if (response.success) {
            updateTrackingUI(response.data);
        } else {
            throw new Error('Order not found');
        }
    } catch (error) {
        console.error('Error loading order:', error);
        showNotification('Could not load order details. Showing demo tracking.');
        displayDemoTracking();
    }
}

function updateTrackingUI(order) {
    // Update order info
    document.getElementById('order-id').textContent = `Order #${order.orderId}`;
    document.getElementById('customer-name').textContent = order.deliveryAddress.name;
    document.getElementById('delivery-address').textContent = order.deliveryAddress.address;
    document.getElementById('customer-phone').textContent = order.deliveryAddress.phone;
    
    // Update estimated delivery
    const estimatedDelivery = order.estimatedDelivery ? 
        new Date(order.estimatedDelivery).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) :
        '45 minutes';
    document.getElementById('order-status').textContent = `Estimated Delivery: ${estimatedDelivery}`;
    
    // Update progress steps
    updateProgressSteps(order.status, order.statusHistory);
    
    // Update order items
    updateOrderItems(order.items, order.orderTotal);
}

function updateProgressSteps(currentStatus, statusHistory) {
    const progressContainer = document.getElementById('tracking-progress');
    
    const steps = [
        { status: 'placed', icon: 'fa-shopping-cart', title: 'Order Placed', description: 'We\'ve received your order' },
        { status: 'confirmed', icon: 'fa-check-circle', title: 'Confirmed', description: 'Order confirmed and payment received' },
        { status: 'preparing', icon: 'fa-utensils', title: 'Preparing', description: 'Our chef is cooking your food' },
        { status: 'out_for_delivery', icon: 'fa-motorcycle', title: 'Out for Delivery', description: 'Your order is on the way' },
        { status: 'delivered', icon: 'fa-home', title: 'Delivered', description: 'Order delivered successfully' }
    ];
    
    let progressHTML = '';
    
    steps.forEach((step, index) => {
        const stepHistory = statusHistory.find(sh => sh.status === step.status);
        const isCompleted = steps.findIndex(s => s.status === currentStatus) >= index;
        const isCurrent = step.status === currentStatus;
        
        progressHTML += `
            <div class="progress-step ${isCompleted ? 'active completed' : ''} ${isCurrent ? 'active' : ''}">
                <div class="step-icon">
                    <i class="fas ${isCompleted ? 'fa-check' : step.icon}"></i>
                </div>
                <div class="step-content">
                    <h4>${step.title}</h4>
                    <p>${step.description}</p>
                    ${stepHistory ? `<span class="step-time">${new Date(stepHistory.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>` : ''}
                </div>
            </div>
        `;
    });
    
    progressContainer.innerHTML = progressHTML;
}

function updateOrderItems(items, orderTotal) {
    const itemsContainer = document.getElementById('tracking-order-items');
    
    let itemsHTML = '';
    let subtotal = 0;
    
    items.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        
        itemsHTML += `
            <div class="order-item">
                <span>${item.name} x ${item.quantity}</span>
                <span>${formatCurrency(itemTotal)}</span>
            </div>
        `;
    });
    
    const deliveryFee = orderTotal?.deliveryFee || 30;
    const tax = orderTotal?.tax || subtotal * 0.05;
    const total = orderTotal?.finalAmount || (subtotal + deliveryFee + tax);
    
    itemsHTML += `
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
    
    itemsContainer.innerHTML = itemsHTML;
}