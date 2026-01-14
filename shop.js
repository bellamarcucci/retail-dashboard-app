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
        // Fallback visual para teste caso server esteja off
        document.getElementById('product-grid').innerHTML = '<p>Conecte o servidor para ver os produtos.</p>';
    }
}

function renderProducts() {
    const grid = document.getElementById('product-grid');
    
    grid.innerHTML = products.map(p => `
        <div class="product-card">
            <img src="${p.image}" onclick="window.location.href='product-details.html?id=${p.id}'" alt="${p.name}">
            <div class="card-content">
                <h3>${p.name}</h3>
                <span class="price">R$ ${p.price.toLocaleString('pt-BR')}</span>
                <p class="desc">${p.description}</p>
                
                <button class="btn-add-cart" 
                    onclick="addToCart(${p.id})" ${p.stock === 0 ? 'disabled' : ''}>
                    <span class="material-symbols-outlined">shopping_cart</span>
                    ${p.stock === 0 ? 'Esgotado' : 'Adicionar'}
                </button>
            </div>
        </div>
    `).join('');
}

function addToCart(id) {
    const product = products.find(p => p.id === id);
    
    // Regra: Apenas 1 projeto estrutural
    if (product.category === 'project') {
        const hasProject = cart.some(item => {
            const original = products.find(p => p.id === item.id);
            return original && original.category === 'project';
        });
        if (hasProject) {
            alert("Você só pode selecionar UM projeto estrutural por vez.");
            return;
        }
    }

    // Verifica estoque localmente antes de adicionar
    const cartItem = cart.find(i => i.id === id);
    const currentQty = cartItem ? cartItem.quantity : 0;
    
    if (currentQty + 1 > product.stock) {
        alert("Estoque insuficiente para adicionar mais itens.");
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
    
    if(!container) return; // Proteção caso esteja em outra página

    let total = 0;
    
    if (cart.length === 0) {
        container.innerHTML = "<p style='text-align:center; color:#999; margin:10px 0;'>Seu carrinho está vazio.</p>";
    } else {
        container.innerHTML = cart.map(item => {
            total += item.price * item.quantity;
            return `
            <div class="cart-item">
                <div>
                    <strong>${item.name}</strong><br>
                    <small>${item.quantity}x R$ ${item.price.toLocaleString('pt-BR')}</small>
                </div>
                <button class="remove-btn" onclick="removeFromCart(${item.id})">✕</button>
            </div>`;
        }).join('');
    }

    if(totalEl) totalEl.innerText = total.toLocaleString('pt-BR');
}

// Event Listener para Checkout
const checkoutBtn = document.getElementById('checkout-btn');
if(checkoutBtn) {
    checkoutBtn.addEventListener('click', async () => {
        if (cart.length === 0) return alert("Carrinho vazio!");
        
        const res = await fetch(`${API_URL}/purchase`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cart })
        });

        const data = await res.json();
        if (data.success) {
            alert("Compra realizada com sucesso!");
            cart = [];
            saveCart();
            updateCartUI();
            init(); // Recarrega produtos para atualizar estoque visual
        } else {
            alert("Erro na compra: " + data.message);
        }
    });
}

init();