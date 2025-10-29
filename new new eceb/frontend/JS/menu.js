// Menu page functionality

document.addEventListener('DOMContentLoaded', function() {
    loadMenuItems();
    setupFilters();
});

async function loadMenuItems() {
    try {
        const response = await api.getMenuItems();
        if (response.success) {
            displayMenuItems(response.data);
        } else {
            throw new Error('Failed to load menu');
        }
    } catch (error) {
        console.error('Error loading menu items:', error);
        // Fallback to hardcoded menu items
        displayMenuItems(getFallbackMenuItems());
    }
}

function displayMenuItems(menuItems) {
    const menuGrid = document.getElementById('menu-grid');
    
    if (!menuGrid) return;
    
    let menuHTML = '';
    
    menuItems.forEach(item => {
        menuHTML += `
            <div class="dish-card menu-item" data-category="${item.category}">
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
    
    menuGrid.innerHTML = menuHTML;
    
    // Re-setup add to cart buttons for the new items
    setupAddToCartButtons();
}

function setupFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Filter menu items
            const filter = this.getAttribute('data-filter');
            filterMenuItems(filter);
        });
    });
}

function filterMenuItems(filter) {
    const menuItems = document.querySelectorAll('.menu-item');
    let visibleCount = 0;
    
    menuItems.forEach(item => {
        if (filter === 'all' || item.getAttribute('data-category') === filter) {
            item.style.display = 'block';
            visibleCount++;
        } else {
            item.style.display = 'none';
        }
    });
    
    // Show message if no items in category
    const menuGrid = document.getElementById('menu-grid');
    let noItemsMessage = menuGrid.querySelector('.no-items-message');
    
    if (visibleCount === 0) {
        if (!noItemsMessage) {
            noItemsMessage = document.createElement('div');
            noItemsMessage.className = 'no-items-message';
            noItemsMessage.innerHTML = `
                <div style="text-align: center; padding: 2rem; color: #666;">
                    <i class="fas fa-utensils" style="font-size: 3rem; margin-bottom: 1rem;"></i>
                    <h3>No items found in this category</h3>
                    <p>Try selecting a different category</p>
                </div>
            `;
            menuGrid.appendChild(noItemsMessage);
        }
    } else if (noItemsMessage) {
        noItemsMessage.remove();
    }
}

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
        },
        {
            id: "4",
            name: "Pithla Bhakri",
            description: "Gram flour curry with jowar bhakri",
            price: 120,
            category: "meals",
            image: "images/pithla-bhakri.jpg"
        },
        {
            id: "5",
            name: "Modak",
            description: "Sweet steamed dumpling with coconut filling",
            price: 70,
            category: "desserts",
            image: "images/modak.jpg"
        },
        {
            id: "6",
            name: "Solkadhi",
            description: "Refreshing kokum-coconut drink",
            price: 40,
            category: "drinks",
            image: "images/solkadhi.jpg"
        }
    ];
}