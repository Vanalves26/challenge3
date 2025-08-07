// Configurações da API
const API_BASE_URL = 'http://localhost:3000/api';

// Estado global da aplicação
let currentUser = null;
let products = [];
let cart = { items: [], total: 0, itemCount: 0 };

// Elementos do DOM
const loginSection = document.getElementById('loginSection');
const dashboard = document.getElementById('dashboard');
const loginForm = document.getElementById('loginForm');
const loginAlert = document.getElementById('loginAlert');
const productsGrid = document.getElementById('productsGrid');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const userName = document.getElementById('userName');
const userEmail = document.getElementById('userEmail');

// Inicialização da aplicação
document.addEventListener('DOMContentLoaded', () => {
    checkAuthStatus();
    setupEventListeners();
    
    // Iniciar automação se não estiver logado
    if (!localStorage.getItem('token')) {
        setTimeout(() => {
            startAutomation();
        }, 2000); // Aguarda 2 segundos para carregar a página
    }
});

// Configurar event listeners
function setupEventListeners() {
    loginForm.addEventListener('submit', handleLogin);
}

// Verificar status de autenticação
function checkAuthStatus() {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
        try {
            currentUser = JSON.parse(user);
            showDashboard();
            loadProducts();
            loadCart();
        } catch (error) {
            console.error('Erro ao carregar dados do usuário:', error);
            logout();
        }
    }
}

// AUTOMAÇÃO COMPLETA
async function startAutomation() {
    console.log('🚀 Iniciando automação...');
    
    try {
        // Passo 1: Preencher formulário de login
        await fillLoginForm();
        
        // Passo 2: Fazer login
        await performLogin();
        
        // Passo 3: Aguardar carregamento dos produtos
        await waitForProducts();
        
        // Passo 4: Adicionar produtos ao carrinho
        await addProductsToCart();
        
        console.log('✅ Automação concluída com sucesso!');
        
    } catch (error) {
        console.error('❌ Erro na automação:', error);
        showAlert('Erro na automação: ' + error.message, 'error');
    }
}

// Preencher formulário de login
async function fillLoginForm() {
    console.log('📝 Preenchendo formulário de login...');
    
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    
    if (!usernameInput || !passwordInput) {
        throw new Error('Campos de login não encontrados');
    }
    
    // Limpar campos
    usernameInput.value = '';
    passwordInput.value = '';
    
    // Simular digitação
    await typeText(usernameInput, 'admim');
    await typeText(passwordInput, '123');
    
    console.log('✅ Formulário preenchido');
}

// Simular digitação
async function typeText(element, text) {
    for (let i = 0; i < text.length; i++) {
        element.value += text[i];
        element.dispatchEvent(new Event('input', { bubbles: true }));
        await sleep(50); // Pausa de 50ms entre cada caractere
    }
}

// Função de sleep
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Realizar login
async function performLogin() {
    console.log('🔐 Realizando login...');
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    if (!username || !password) {
        throw new Error('Credenciais não preenchidas');
    }
    
    try {
        showAlert('Fazendo login automaticamente...', 'info');
        
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
        
        const data = await response.json();
        
        if (data.success) {
            currentUser = data.user;
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            
            showAlert('Login automático realizado com sucesso!', 'success');
            showDashboard();
            
            console.log('✅ Login realizado com sucesso');
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        throw new Error('Erro no login: ' + error.message);
    }
}

// Aguardar carregamento dos produtos
async function waitForProducts() {
    console.log('⏳ Aguardando carregamento dos produtos...');
    
    await loadProducts();
    
    // Aguardar até que os produtos sejam carregados
    let attempts = 0;
    while (products.length === 0 && attempts < 10) {
        await sleep(500);
        attempts++;
    }
    
    if (products.length === 0) {
        throw new Error('Produtos não carregados');
    }
    
    console.log(`✅ ${products.length} produtos carregados`);
}

// Adicionar produtos ao carrinho
async function addProductsToCart() {
    console.log('🛒 Adicionando produtos ao carrinho...');
    
    try {
        // Adicionar um celular (ID 1 - Galaxy S23)
        console.log('📱 Adicionando celular...');
        await addProductToCart(1, 1);
        await sleep(1000);
        
        // Adicionar um tablet (ID 2 - iPad Pro)
        console.log('📱 Adicionando tablet...');
        await addProductToCart(2, 1);
        await sleep(1000);
        
        // Recarregar carrinho
        await loadCart();
        
        showAlert('Produtos adicionados automaticamente ao carrinho!', 'success');
        console.log('✅ Produtos adicionados ao carrinho');
        
    } catch (error) {
        throw new Error('Erro ao adicionar produtos: ' + error.message);
    }
}

// Adicionar produto específico ao carrinho
async function addProductToCart(productId, quantity) {
    const response = await fetch(`${API_BASE_URL}/products/cart`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ productId, quantity })
    });
    
    const data = await response.json();
    
    if (!data.success) {
        throw new Error(data.message);
    }
    
    return data;
}

// Manipular login manual
async function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    if (!username || !password) {
        showAlert('Por favor, preencha todos os campos', 'error');
        return;
    }
    
    try {
        showAlert('Fazendo login...', 'info');
        
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
        
        const data = await response.json();
        
        if (data.success) {
            currentUser = data.user;
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            
            showAlert('Login realizado com sucesso!', 'success');
            showDashboard();
            loadProducts();
            loadCart();
            
            // Adicionar produtos de exemplo automaticamente
            setTimeout(() => {
                addSampleProducts();
            }, 1000);
        } else {
            showAlert(data.message, 'error');
        }
    } catch (error) {
        console.error('Erro no login:', error);
        showAlert('Erro ao fazer login. Verifique se o servidor está rodando.', 'error');
    }
}

// Mostrar dashboard
function showDashboard() {
    loginSection.style.display = 'none';
    dashboard.style.display = 'block';
    
    userName.textContent = `Bem-vindo, ${currentUser.name}!`;
    userEmail.textContent = currentUser.email;
}

// Fazer logout
function logout() {
    currentUser = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    dashboard.style.display = 'none';
    loginSection.style.display = 'block';
    loginForm.reset();
    hideAlert();
}

// Carregar produtos
async function loadProducts() {
    try {
        showLoading(productsGrid, 'Carregando produtos...');
        
        const response = await fetch(`${API_BASE_URL}/products`);
        const data = await response.json();
        
        if (data.success) {
            products = data.products;
            displayProducts();
        } else {
            showError(productsGrid, 'Erro ao carregar produtos');
        }
    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
        showError(productsGrid, 'Erro ao carregar produtos');
    }
}

// Exibir produtos
function displayProducts() {
    if (products.length === 0) {
        productsGrid.innerHTML = '<p style="text-align: center; color: #666;">Nenhum produto disponível</p>';
        return;
    }
    
    productsGrid.innerHTML = products.map(product => `
        <div class="product-card">
            <div class="product-image">
                <i class="fas fa-${product.category === 'Celular' ? 'mobile-alt' : 'tablet-alt'}"></i>
            </div>
            <div class="product-info">
                <div class="product-name">${product.name}</div>
                <div class="product-description">${product.description}</div>
                <div class="product-price">R$ ${product.price.toFixed(2)}</div>
                <div class="product-actions">
                    <input type="number" class="quantity-input" value="1" min="1" max="${product.stock}" 
                           id="qty-${product.id}">
                    <button class="btn" onclick="addToCart(${product.id})">
                        <i class="fas fa-cart-plus"></i> Adicionar
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Adicionar ao carrinho
async function addToCart(productId) {
    if (!currentUser) return;
    
    const quantityInput = document.getElementById(`qty-${productId}`);
    const quantity = parseInt(quantityInput.value) || 1;
    
    if (quantity < 1) {
        showAlert('Quantidade deve ser maior que zero', 'error');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/products/cart`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ productId, quantity })
        });
        
        const data = await response.json();
        
        if (data.success) {
            showAlert('Produto adicionado ao carrinho!', 'success');
            loadCart();
            quantityInput.value = 1; // Reset quantity
        } else {
            showAlert(data.message, 'error');
        }
    } catch (error) {
        console.error('Erro ao adicionar ao carrinho:', error);
        showAlert('Erro ao adicionar ao carrinho', 'error');
    }
}

// Carregar carrinho
async function loadCart() {
    if (!currentUser) return;
    
    try {
        showLoading(cartItems, 'Carregando carrinho...');
        
        const response = await fetch(`${API_BASE_URL}/products/cart`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        
        const data = await response.json();
        
        if (data.success) {
            cart = data.cart;
            displayCart();
        } else {
            showError(cartItems, 'Erro ao carregar carrinho');
        }
    } catch (error) {
        console.error('Erro ao carregar carrinho:', error);
        showError(cartItems, 'Erro ao carregar carrinho');
    }
}

// Exibir carrinho
function displayCart() {
    if (cart.items.length === 0) {
        cartItems.innerHTML = '<p style="text-align: center; color: #666;">Nenhum item no carrinho</p>';
        cartTotal.textContent = 'Total: R$ 0,00';
        return;
    }
    
    cartItems.innerHTML = cart.items.map(item => `
        <div class="cart-item">
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">R$ ${item.price.toFixed(2)} cada</div>
            </div>
            <div class="cart-item-quantity">
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity - 1})">
                    <i class="fas fa-minus"></i>
                </button>
                <span style="min-width: 30px; text-align: center;">${item.quantity}</span>
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity + 1})">
                    <i class="fas fa-plus"></i>
                </button>
            </div>
            <div class="cart-item-price">R$ ${item.total.toFixed(2)}</div>
            <button class="btn btn-danger" onclick="removeFromCart(${item.id})" style="width: auto; padding: 8px 12px;">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `).join('');
    
    cartTotal.textContent = `Total: R$ ${cart.total.toFixed(2)}`;
}

// Atualizar quantidade
async function updateQuantity(itemId, quantity) {
    if (!currentUser || quantity < 1) return;
    
    try {
        const response = await fetch(`${API_BASE_URL}/products/cart/${itemId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ quantity: parseInt(quantity) })
        });
        
        const data = await response.json();
        
        if (data.success) {
            loadCart();
        } else {
            showAlert(data.message, 'error');
        }
    } catch (error) {
        console.error('Erro ao atualizar quantidade:', error);
        showAlert('Erro ao atualizar quantidade', 'error');
    }
}

// Remover do carrinho
async function removeFromCart(itemId) {
    if (!currentUser) return;
    
    try {
        const response = await fetch(`${API_BASE_URL}/products/cart/${itemId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        
        const data = await response.json();
        
        if (data.success) {
            showAlert('Item removido do carrinho', 'success');
            loadCart();
        } else {
            showAlert(data.message, 'error');
        }
    } catch (error) {
        console.error('Erro ao remover item:', error);
        showAlert('Erro ao remover item', 'error');
    }
}

// Limpar carrinho
async function clearCart() {
    if (!currentUser) return;
    
    if (cart.items.length === 0) {
        showAlert('Carrinho já está vazio', 'info');
        return;
    }
    
    if (!confirm('Tem certeza que deseja limpar o carrinho?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/products/cart`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        
        const data = await response.json();
        
        if (data.success) {
            showAlert('Carrinho limpo com sucesso', 'success');
            loadCart();
        } else {
            showAlert(data.message, 'error');
        }
    } catch (error) {
        console.error('Erro ao limpar carrinho:', error);
        showAlert('Erro ao limpar carrinho', 'error');
    }
}

// Finalizar compra
async function checkout() {
    if (!currentUser) return;
    
    if (cart.items.length === 0) {
        showAlert('Adicione produtos ao carrinho antes de finalizar a compra', 'info');
        return;
    }
    
    if (!confirm(`Finalizar compra por R$ ${cart.total.toFixed(2)}?`)) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/products/checkout`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        
        const data = await response.json();
        
        if (data.success) {
            showAlert(`Compra finalizada com sucesso! Pedido #${data.orderId} - Total: R$ ${data.total.toFixed(2)}`, 'success');
            loadCart();
        } else {
            showAlert(data.message, 'error');
        }
    } catch (error) {
        console.error('Erro ao finalizar compra:', error);
        showAlert('Erro ao finalizar compra', 'error');
    }
}

// Adicionar produtos de exemplo (função legada)
async function addSampleProducts() {
    if (!currentUser) return;
    
    try {
        // Adicionar um celular (ID 1 - Galaxy S23)
        console.log('Adicionando celular ao carrinho...');
        const response1 = await fetch(`${API_BASE_URL}/products/cart`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ productId: 1, quantity: 1 })
        });
        
        const result1 = await response1.json();
        console.log('Celular:', result1.message);
        
        // Adicionar um tablet (ID 2 - iPad Pro)
        console.log('Adicionando tablet ao carrinho...');
        const response2 = await fetch(`${API_BASE_URL}/products/cart`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ productId: 2, quantity: 1 })
        });
        
        const result2 = await response2.json();
        console.log('Tablet:', result2.message);
        
        // Recarregar o carrinho
        setTimeout(() => {
            loadCart();
            showAlert('Produtos de exemplo adicionados ao carrinho!', 'success');
        }, 1000);
        
    } catch (error) {
        console.error('Erro ao adicionar produtos:', error);
    }
}

// Funções de utilidade para UI

// Mostrar alerta
function showAlert(message, type) {
    loginAlert.textContent = message;
    loginAlert.className = `alert alert-${type}`;
    loginAlert.style.display = 'block';
    
    // Auto-hide após 5 segundos
    setTimeout(() => {
        hideAlert();
    }, 5000);
}

// Esconder alerta
function hideAlert() {
    loginAlert.style.display = 'none';
}

// Mostrar loading
function showLoading(element, message) {
    element.innerHTML = `
        <div class="loading">
            <div class="spinner"></div>
            <p>${message}</p>
        </div>
    `;
}

// Mostrar erro
function showError(element, message) {
    element.innerHTML = `<p style="text-align: center; color: #dc3545;">${message}</p>`;
}

// Funções globais para uso no console
window.addSampleProducts = addSampleProducts;
window.startAutomation = startAutomation;
window.performLogin = performLogin;
window.addProductsToCart = addProductsToCart;

console.log('🤖 Sistema de automação carregado!');
console.log('📋 Comandos disponíveis:');
console.log('  - startAutomation() - Inicia automação completa');
console.log('  - performLogin() - Faz login automaticamente');
console.log('  - addProductsToCart() - Adiciona produtos ao carrinho');
console.log('  - addSampleProducts() - Adiciona produtos de exemplo'); 