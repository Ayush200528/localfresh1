// Authentication functionality

document.addEventListener('DOMContentLoaded', function() {
    initializeAuth();
});

function initializeAuth() {
    setupAuthForms();
    checkRedirect();
}

function setupAuthForms() {
    // Login form
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            await handleLogin();
        });
    }
    
    // Register form
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            await handleRegister();
        });
    }
}

async function handleLogin() {
    const loginForm = document.getElementById('login-form');
    const submitBtn = loginForm.querySelector('.btn-auth');
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    // Show loading state
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
    submitBtn.disabled = true;
    
    try {
        const result = await api.login({ email, password });
        
        if (result.success) {
            showNotification('Login successful!');
            
            // Redirect to appropriate page
            setTimeout(() => {
                const urlParams = new URLSearchParams(window.location.search);
                const redirect = urlParams.get('redirect');
                
                if (redirect === 'checkout') {
                    window.location.href = 'checkout.html';
                } else {
                    window.location.href = 'index.html';
                }
            }, 1000);
        }
    } catch (error) {
        showNotification('Login failed: ' + error.message);
    } finally {
        // Reset button state
        submitBtn.innerHTML = 'Login';
        submitBtn.disabled = false;
    }
}

async function handleRegister() {
    const registerForm = document.getElementById('register-form');
    const submitBtn = registerForm.querySelector('.btn-auth');
    
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const phone = document.getElementById('register-phone').value;
    const password = document.getElementById('register-password').value;
    
    // Show loading state
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating Account...';
    submitBtn.disabled = true;
    
    try {
        const result = await api.register({ name, email, phone, password });
        
        if (result.success) {
            showNotification('Account created successfully!');
            
            // Auto-login after registration
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        }
    } catch (error) {
        showNotification('Registration failed: ' + error.message);
    } finally {
        // Reset button state
        submitBtn.innerHTML = 'Create Account';
        submitBtn.disabled = false;
    }
}

function checkRedirect() {
    // Check if user was redirected from checkout
    const urlParams = new URLSearchParams(window.location.search);
    const redirect = urlParams.get('redirect');
    
    if (redirect === 'checkout') {
        showNotification('Please login or register to continue with your order');
    }
}