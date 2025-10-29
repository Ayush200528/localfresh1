// My Orders functionality

document.addEventListener('DOMContentLoaded', function() {
    initializeOrders();
});

async function initializeOrders() {
    await checkAuthStatus();
    await loadUserOrders();
}

async function loadUserOrders() {
    try {
        const response = await api.getMyOrders();
        if (response.success) {
            displayOrders(response.data);
        } else {
            throw new Error('Failed to load orders');
        }
    } catch (error) {
        console.error('Error loading orders:', error);
        displayEmptyOrders('Failed to load orders. Please try again.');
    }
}

function displayOrders(orders) {
    const ordersContainer = document.getElementById('orders-container');
    const emptyOrders = document.getElementById('empty-orders');
    
    if (!orders || orders.length === 0) {
        displayEmptyOrders('You haven\'t placed any orders yet.');
        return;
    }
    
    if (emptyOrders) emptyOrders.style.display = 'none';
    if (ordersContainer) ordersContainer.style.display = 'block';
    
    let ordersHTML = '';
    
    orders.forEach(order => {
        const orderDate = new Date(order.createdAt).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
        
        const orderTime = new Date(order.createdAt).toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit'
        });
        
        ordersHTML += `
            <div class="order-card">
                <div class="order-header">
                    <div class="order-info">
                        <h3>Order #${order.orderId}</h3>
                        <p class="order-date">${orderDate} at ${orderTime}</p>
                    </div>
                    <div class="order-status-badge status-${order.status}">
                        ${formatOrderStatus(order.status)}
                    </div>
                </div>
                
                <div class="order-items-preview">
                    ${order.items.slice(0, 2).map(item => `
                        <span class="order-item-preview">${item.name} x ${item.quantity}</span>
                    `).join('')}
                    ${order.items.length > 2 ? `<span class="more-items">+${order.items.length - 2} more</span>` : ''}
                </div>
                
                <div class="order-footer">
                    <div class="order-total">
                        Total: ${formatCurrency(order.orderTotal.finalAmount)}
                    </div>
                    <div class="order-actions">
                        <a href="tracking.html?orderId=${order.orderId}" class="btn btn-outline">Track Order</a>
                        ${order.status === 'placed' || order.status === 'confirmed' ? 
                          `<button class="btn btn-outline btn-cancel" data-order-id="${order.orderId}">Cancel Order</button>` : ''}
                    </div>
                </div>
            </div>
        `;
    });
    
    const ordersList = document.getElementById('orders-list');
    if (ordersList) {
        ordersList.innerHTML = ordersHTML;
    }
    
    // Setup cancel order buttons
    setupCancelOrderButtons();
}

function displayEmptyOrders(message) {
    const ordersContainer = document.getElementById('orders-container');
    const emptyOrders = document.getElementById('empty-orders');
    
    if (ordersContainer) ordersContainer.style.display = 'none';
    if (emptyOrders) {
        emptyOrders.style.display = 'block';
        emptyOrders.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-clipboard-list"></i>
                <h3>No Orders Yet</h3>
                <p>${message}</p>
                <a href="menu.html" class="btn btn-primary">Start Ordering</a>
            </div>
        `;
    }
}

function formatOrderStatus(status) {
    const statusMap = {
        'placed': 'Order Placed',
        'confirmed': 'Confirmed',
        'preparing': 'Preparing',
        'out_for_delivery': 'Out for Delivery',
        'delivered': 'Delivered',
        'cancelled': 'Cancelled'
    };
    
    return statusMap[status] || status;
}

function setupCancelOrderButtons() {
    document.querySelectorAll('.btn-cancel').forEach(button => {
        button.addEventListener('click', function() {
            const orderId = this.getAttribute('data-order-id');
            cancelOrder(orderId);
        });
    });
}

async function cancelOrder(orderId) {
    if (!confirm('Are you sure you want to cancel this order?')) {
        return;
    }
    
    try {
        const response = await api.cancelOrder(orderId);
        if (response.success) {
            showNotification('Order cancelled successfully');
            // Reload orders
            loadUserOrders();
        }
    } catch (error) {
        showNotification('Failed to cancel order: ' + error.message);
    }
}