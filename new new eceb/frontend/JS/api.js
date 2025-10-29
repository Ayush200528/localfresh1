// API service for LocalBite backend

const API_BASE_URL = 'http://localhost:5000/api';

class LocalBiteAPI {
    constructor() {
        this.token = localStorage.getItem('localbite_token');
    }

    // Set authentication token
    setToken(token) {
        this.token = token;
        localStorage.setItem('localbite_token', token);
    }

    // Remove token (logout)
    removeToken() {
        this.token = null;
        localStorage.removeItem('localbite_token');
    }

    // Generic request method
    async request(endpoint, options = {}) {
        const url = `${API_BASE_URL}${endpoint}`;
        
        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
            ...options
        };

        if (this.token) {
            config.headers.Authorization = `Bearer ${this.token}`;
        }

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Request failed');
            }

            return data;
        } catch (error) {
            console.error('API Request failed:', error);
            throw error;
        }
    }

    // Auth endpoints
    async register(userData) {
        return this.request('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData)
        });
    }

    async login(credentials) {
        const data = await this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials)
        });
        
        if (data.success && data.token) {
            this.setToken(data.token);
        }
        
        return data;
    }

    async getProfile() {
        return this.request('/auth/profile');
    }

    async updateProfile(profileData) {
        return this.request('/auth/profile', {
            method: 'PUT',
            body: JSON.stringify(profileData)
        });
    }

    // Menu endpoints
    async getMenuItems(filters = {}) {
        const queryParams = new URLSearchParams(filters).toString();
        return this.request(`/menu?${queryParams}`);
    }

    async getMenuItem(id) {
        return this.request(`/menu/${id}`);
    }

    async getMenuByCategory(category) {
        return this.request(`/menu/category/${category}`);
    }

    async getPopularItems() {
        return this.request('/menu/featured/popular');
    }

    // Order endpoints
    async createOrder(orderData) {
        return this.request('/orders', {
            method: 'POST',
            body: JSON.stringify(orderData)
        });
    }

    async getMyOrders() {
        return this.request('/orders/my-orders');
    }

    async getOrder(id) {
        return this.request(`/orders/${id}`);
    }

    async cancelOrder(id) {
        return this.request(`/orders/${id}/cancel`, {
            method: 'PATCH'
        });
    }

    // Payment endpoints
    async createPaymentOrder(orderData) {
        return this.request('/payments/create-order', {
            method: 'POST',
            body: JSON.stringify(orderData)
        });
    }

    async verifyPayment(paymentData) {
        return this.request('/payments/verify-payment', {
            method: 'POST',
            body: JSON.stringify(paymentData)
        });
    }

    async getPaymentStatus(orderId) {
        return this.request(`/payments/status/${orderId}`);
    }
}

// Create global API instance
const api = new LocalBiteAPI();

// Utility function to format currency
function formatCurrency(amount) {
    return '₹' + amount.toLocaleString('en-IN');
}