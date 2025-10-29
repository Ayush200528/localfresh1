// Main JavaScript file for LocalBite website

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Initialize Application
function initializeApp() {
    setupMobileMenu();
    updateCartCount();
    setupAddToCartButtons();
    setupContactForm();
    
    // Check if user is logged in
    checkAuthStatus();
    
    // Load menu items from backend for homepage
    loadFeaturedDishes();
}

// Mobile Menu Toggle
function setupMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu when clicking on links
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
}

// Update Cart Count in Header
function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        const cart = getCart();
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}

// Get Cart from localStorage
function getCart() {
    return JSON.parse(localStorage.getItem('localbite_cart')) || [];
}

// Save Cart to localStorage
function saveCart(cart) {
    localStorage.setItem('localbite_cart', JSON.stringify(cart));
}

// Setup Add to Cart Buttons
function setupAddToCartButtons() {
    document.querySelectorAll('.btn-add-cart').forEach(button => {
        button.addEventListener('click', function() {
            const dish = this.getAttribute('data-dish');
            const price = parseInt(this.getAttribute('data-price'));
            const id = this.getAttribute('data-id');
            
            addToCart(dish, price, id);
            
            // Show confirmation
            showNotification(`${dish} added to cart!`);
        });
    });
}

// Add Item to Cart
function addToCart(dish, price, id) {
    const cart = getCart();
    const existingItem = cart.find(item => item.id === id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: id,
            dish: dish,
            price: price,
            quantity: 1
        });
    }
    
    saveCart(cart);
    updateCartCount();
}

// Show Notification
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #4CAF50;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (notification.parentNode) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Check authentication status
async function checkAuthStatus() {
    try {
        const profile = await api.getProfile();
        if (profile.success) {
            showUserStatus(profile.user);
        }
    } catch (error) {
        // User not logged in, show login buttons
        showLoginButtons();
    }
}

function showUserStatus(user) {
    const loginBtn = document.querySelector('.login-btn');
    if (loginBtn) {
        loginBtn.innerHTML = `<i class="fas fa-user"></i> ${user.name.split(' ')[0]}`;
        loginBtn.href = '#';
        loginBtn.onclick = showUserMenu;
    }
}

function showLoginButtons() {
    const loginBtn = document.querySelector('.login-btn');
    if (loginBtn) {
        loginBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Login';
        loginBtn.href = 'login.html';
        loginBtn.onclick = null;
    }
}

function showUserMenu() {
    // Remove existing menu if any
    const existingMenu = document.querySelector('.user-menu');
    if (existingMenu) {
        existingMenu.remove();
    }

    // Create user dropdown menu
    const userMenu = document.createElement('div');
    userMenu.className = 'user-menu';
    userMenu.innerHTML = `
        <div class="user-menu-content">
            <a href="profile.html">My Profile</a>
            <a href="orders.html">My Orders</a>
            <a href="#" id="logout-btn">Logout</a>
        </div>
    `;
    
    userMenu.style.cssText = `
        position: absolute;
        top: 100%;
        right: 0;
        background: white;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        border-radius: 8px;
        padding: 0.5rem 0;
        min-width: 150px;
        z-index: 1000;
    `;
    
    const loginBtn = document.querySelector('.login-btn');
    loginBtn.style.position = 'relative';
    loginBtn.appendChild(userMenu);
    
    document.getElementById('logout-btn').addEventListener('click', logout);
    
    // Close menu when clicking outside
    document.addEventListener('click', function closeMenu(e) {
        if (!loginBtn.contains(e.target)) {
            userMenu.remove();
            document.removeEventListener('click', closeMenu);
        }
    });
}

async function logout() {
    api.removeToken();
    localStorage.removeItem('localbite_cart');
    window.location.href = 'index.html';
}

// Load featured dishes for homepage
async function loadFeaturedDishes() {
    try {
        const response = await api.getMenuItems();
        if (response.success) {
            updateFeaturedDishes(response.data);
        }
    } catch (error) {
        console.error('Failed to load featured dishes:', error);
        // Fallback to local data
        updateFeaturedDishes(getFallbackMenuItems());
    }
}

function updateFeaturedDishes(menuItems) {
    const featuredGrid = document.getElementById('featured-dishes');
    if (!featuredGrid) return;
    
    // Get popular items or first 3 items
    const popularItems = menuItems.filter(item => item.popular).slice(0, 3);
    const featuredItems = popularItems.length > 0 ? popularItems : menuItems.slice(0, 3);
    
    let featuredHTML = '';
    featuredItems.forEach(item => {
        featuredHTML += `
            <div class="dish-card">
                <img src="${item.image}" alt="${item.name}" onerror="this.src='images/placeholder-food.jpg'">
                <h3>${item.name}</h3>
                <p>${item.description}</p>
                <div class="price">${formatCurrency(item.price)}</div>
                <button class="btn-add-cart" data-dish="${item.name}" data-price="${item.price}" data-id="${item._id || item.id}">
                    Add to Cart
                </button>
            </div>
        `;
    });
    
    featuredGrid.innerHTML = featuredHTML;
    
    // Re-setup add to cart buttons
    setupAddToCartButtons();
}

// Setup Contact Form
function setupContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            // Simulate form submission
            showNotification('Message sent successfully! We\'ll get back to you soon.');
            this.reset();
        });
    }
}

// Utility function for fallback menu items
function getFallbackMenuItems() {
    return [
        {
            id: "1",
            name: "Misal Pav",
            description: "Spicy sprout curry topped with farsan & onion",
            price: 80,
            category: "snacks",
            image: "images/misal-pav.jpg",
            popular: true
        },
        {
            id: "2", 
            name: "Vada Pav",
            description: "Fried potato dumpling in pav with chutneys",
            price: 35,
            category: "snacks",
            image: "images/vada-pav.jpg",
            popular: true
        },
        {
            id: "3",
            name: "Pav Bhaji",
            description: "Butter-toasted pav with spicy mashed vegetables",
            price: 100,
            category: "snacks",
            image: "images/pav-bhaji.jpg",
            popular: true
        }
    ];
}

// Add notification styles to head
const notificationStyles = `
.notification-content {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.notification-content i {
    font-size: 1.2rem;
}
`;

// Inject styles if not already present
if (!document.querySelector('#notification-styles')) {
    const styleSheet = document.createElement('style');
    styleSheet.id = 'notification-styles';
    styleSheet.textContent = notificationStyles;
    document.head.appendChild(styleSheet);
}