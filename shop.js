const API_URL = 'http://localhost:3000/api';
let cart = JSON.parse(localStorage.getItem('arkisanteCart')) || [];
let products = [];

async function init() {
    try {
        const res = await fetch(`${API_URL}/products`);
        products = await res.json();
        renderProducts();
        updateCartUI();
    } catch (err) {
        console.error("Error loading products", err);
    }
}

function renderProducts() {
    const grid = document.getElementById('product-grid');
    grid.innerHTML = products.map(p => `
        <div class="product-card">
            <img src="${p.image}" onclick="window.location.href='product-details.html?id=${p.id}'" alt="${p.name}">
            <h3>${p.name}</h3>
            <p>${p.description}</p>
            <span class="price">R$ ${p.price.toLocaleString('pt-BR')}</span>
            <small>Estoque: ${p.stock}</small>
            <button class="btn-learn-more" style="width:100%; margin-top:10px;" 
                onclick="addToCart(${p.id})" ${p.stock === 0 ? 'disabled' : ''}>
                ${p.stock === 0 ? 'Esgotado' : 'Adicionar'}
            </button>
        </div>
    `).join('');
}

function addToCart(id) {
    const product = products.find(p => p.id === id);
    
    // Constraint: Only 1 "project" type allowed
    if (product.category === 'project') {
        const hasProject = cart.some(item => {
            const original = products.find(p => p.id === item.id);
            return original.category === 'project';
        });
        if (hasProject) {
            alert("Você só pode selecionar UM projeto estrutural por vez.");
            return;
        }
    }

    // Check stock locally first
    const cartItem = cart.find(i => i.id === id);
    const currentQty = cartItem ? cartItem.quantity : 0;
    
    if (currentQty + 1 > product.stock) {
        alert("Estoque insuficiente.");
        return;
    }

    if (cartItem) {
        cartItem.quantity++;
    } else {
        cart.push({ id: id, quantity: 1, name: product.name, price: product.price });
    }

    saveCart();
    updateCartUI();
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    saveCart();
    updateCartUI();
}

function saveCart() {
    localStorage.setItem('arkisanteCart', JSON.stringify(cart));
}

function updateCartUI() {
    const container = document.getElementById('cart-items');
    const totalEl = document.getElementById('cart-total-price');
    
    let total = 0;
    
    container.innerHTML = cart.map(item => {
        total += item.price * item.quantity;
        return `
        <div class="cart-item">
            <span>${item.quantity}x ${item.name}</span>
            <button class="remove-btn" onclick="removeFromCart(${item.id})">x</button>
        </div>`;
    }).join('');

    totalEl.innerText = total.toLocaleString('pt-BR');
}

document.getElementById('checkout-btn').addEventListener('click', async () => {
    if (cart.length === 0) return alert("Carrinho vazio!");
    
    const res = await fetch(`${API_URL}/purchase`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cart })
    });

    const data = await res.json();
    if (data.success) {
        alert("Compra realizada com sucesso! Redirecionando para pagamento...");
        cart = [];
        saveCart();
        updateCartUI();
        init(); // Refresh stock display
    } else {
        alert("Erro na compra: " + data.message);
    }
});

init();