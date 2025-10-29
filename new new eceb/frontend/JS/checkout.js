// Checkout page functionality

document.addEventListener('DOMContentLoaded', function() {
    initializeCheckout();
});

async function initializeCheckout() {
    const orderSummary = displayOrderSummary();
    
    // If cart is empty, redirect to menu
    const cart = getCart();
    if (cart.length === 0) {
        showNotification('Your cart is empty! Adding some items first.');
        setTimeout(() => {
            window.location.href = 'menu.html';
        }, 2000);
        return;
    }
    
    setupCheckoutForm();
    setupPaymentMethods();
    
    // Check if user is logged in and prefill data
    try {
        const profile = await api.getProfile();
        if (profile.success) {
            prefillUserData(profile.user);
        }
    } catch (error) {
        console.log('User not logged in, will need to register during checkout');
    }
}

function prefillUserData(user) {
    document.getElementById('name').value = user.name || '';
    document.getElementById('phone').value = user.phone || '';
    
    if (user.address) {
        const addressParts = [];
        if (user.address.street) addressParts.push(user.address.street);
        if (user.address.area) addressParts.push(user.address.area);
        if (user.address.city) addressParts.push(user.address.city);
        
        document.getElementById('address').value = addressParts.join(', ');
        
        if (user.address.area) {
            document.getElementById('area').value = user.address.area.toLowerCase();
        }
    }
}

function setupCheckoutForm() {
    const placeOrderBtn = document.getElementById('place-order-btn');
    const deliveryForm = document.getElementById('delivery-form');
    
    if (placeOrderBtn && deliveryForm) {
        placeOrderBtn.addEventListener('click', async function(e) {
            e.preventDefault();
            
            if (!deliveryForm.checkValidity()) {
                deliveryForm.reportValidity();
                return;
            }
            
            const formData = new FormData(deliveryForm);
            const orderData = Object.fromEntries(formData);
            const paymentMethod = document.querySelector('input[name="payment"]:checked').value;
            
            // Show loading state
            placeOrderBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Placing Order...';
            placeOrderBtn.disabled = true;
            
            try {
                // Create order with backend
                const cart = getCart();
                const orderSummary = displayOrderSummary();
                
                const orderPayload = {
                    items: cart.map(item => ({
                        menuItemId: item.id,
                        name: item.dish,
                        quantity: item.quantity
                    })),
                    deliveryAddress: {
                        name: orderData.name,
                        phone: orderData.phone,
                        address: orderData.address,
                        area: orderData.area,
                        landmark: orderData.landmark || ''
                    },
                    paymentMethod: paymentMethod,
                    specialInstructions: orderData.instructions || ''
                };
                
                const orderResponse = await api.createOrder(orderPayload);
                
                if (orderResponse.success) {
                    showNotification('Order placed successfully!');
                    
                    // Clear cart and redirect to tracking
                    clearCart();
                    
                    setTimeout(() => {
                        window.location.href = `tracking.html?orderId=${orderResponse.data.orderId}`;
                    }, 1500);
                }
            } catch (error) {
                showNotification('Failed to place order: ' + error.message);
                console.error('Order creation failed:', error);
            } finally {
                // Reset button state
                placeOrderBtn.innerHTML = 'Place Order';
                placeOrderBtn.disabled = false;
            }
        });
    }
}

function setupPaymentMethods() {
    const paymentOptions = document.querySelectorAll('.payment-option input');
    
    paymentOptions.forEach(option => {
        option.addEventListener('change', function() {
            console.log('Payment method changed to:', this.value);
        });
    });
}

// Handle UPI payment (simplified version)
async function handleUPIPayment(order) {
    try {
        // For demo purposes, we'll simulate UPI payment
        showNotification('Redirecting to UPI payment...');
        
        // Simulate payment processing
        setTimeout(() => {
            showNotification('Payment successful!');
            clearCart();
            window.location.href = `tracking.html?orderId=${order.orderId}`;
        }, 2000);
        
    } catch (error) {
        showNotification('Payment failed: ' + error.message);
    }
}