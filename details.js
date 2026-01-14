const API_URL = 'http://localhost:3000/api';
const params = new URLSearchParams(window.location.search);
const productId = params.get('id');
let currentRating = 0;

async function loadDetails() {
    try {
        const res = await fetch(`${API_URL}/products/${productId}`);
        if (!res.ok) throw new Error('Produto não encontrado');
        
        const product = await res.json();
        renderProductLayout(product);
        renderReviews(product.reviews);
        setupStarRating(); // Inicializa lógica das estrelas
    } catch (err) {
        // Se houver erro ou produto não existir
        const container = document.getElementById('product-detail-view');
        if (container) container.innerHTML = "<h1>Produto não encontrado</h1>";
    }
}

function renderProductLayout(product) {
    const container = document.getElementById('product-detail-view');
    
    container.innerHTML = `
        <div class="details-wrapper">
            <div class="details-info">
                <h1>${product.name}</h1>
                <span class="price-large">R$ ${product.price.toLocaleString('pt-BR')}</span>
                <p class="description-large">${product.description}</p>
                <p>Categoria: <b>${product.category.toUpperCase()}</b></p>
                <p>Estoque disponível: <b>${product.stock}</b></p>
                
                <br>
                <button class="btn-add-cart" style="max-width: 300px;" 
                    onclick="addToCartFromDetails(${product.id}, '${product.category}', '${product.name}', ${product.price}, ${product.stock})" 
                    ${product.stock === 0 ? 'disabled' : ''}>
                    <span class="material-symbols-outlined">shopping_cart</span>
                    ${product.stock === 0 ? 'Esgotado' : 'Adicionar ao Carrinho'}
                </button>
            </div>

            <div class="details-img-container">
                <img src="${product.image}" alt="${product.name}" style="margin-top: 3rem">
            </div>
        </div>
    `;
}

function setupStarRating() {
    // --- CORREÇÃO: Evita duplicar as estrelas se já existirem ---
    if (document.querySelector('.star-rating-container')) {
        return;
    }

    const form = document.getElementById('review-form');
    const select = document.getElementById('review-rating');
    
    // Esconde o select original se ele existir
    if (select) select.style.display = 'none';

    // Cria container das estrelas
    const starsContainer = document.createElement('div');
    starsContainer.className = 'star-rating-container';
    starsContainer.innerHTML = `
        <span class="material-symbols-outlined star-icon" data-value="1">star</span>
        <span class="material-symbols-outlined star-icon" data-value="2">star</span>
        <span class="material-symbols-outlined star-icon" data-value="3">star</span>
        <span class="material-symbols-outlined star-icon" data-value="4">star</span>
        <span class="material-symbols-outlined star-icon" data-value="5">star</span>
    `;

    // Insere as estrelas antes da caixa de texto
    const textarea = document.getElementById('review-comment');
    if (form && textarea) {
        form.insertBefore(starsContainer, textarea);
    }

    // Adiciona interatividade
    const stars = starsContainer.querySelectorAll('.star-icon');

    stars.forEach(star => {
        // Hover
        star.addEventListener('mouseover', function() {
            const value = this.getAttribute('data-value');
            highlightStars(stars, value);
        });

        // Click
        star.addEventListener('click', function() {
            currentRating = this.getAttribute('data-value');
            if (select) select.value = currentRating;
        });
    });

    // Quando mouse sai, volta para a nota selecionada
    starsContainer.addEventListener('mouseleave', function() {
        highlightStars(stars, currentRating);
    });
}

function highlightStars(stars, value) {
    stars.forEach(star => {
        const starVal = star.getAttribute('data-value');
        if (starVal <= value) {
            star.classList.add('filled');
            star.textContent = 'star'; 
        } else {
            star.classList.remove('filled');
            star.textContent = 'star_border'; 
        }
    });
}

function renderReviews(reviews) {
    const list = document.getElementById('reviews-list');
    if (!reviews || reviews.length === 0) {
        list.innerHTML = "<p style='color:#777; font-style:italic;'>Seja o primeiro a avaliar este projeto.</p>";
        return;
    }
    
    list.innerHTML = reviews.map(r => `
        <div style="background:#f9f9f9; padding:15px; margin-bottom:15px; border-radius:8px; border-left: 4px solid #a1772d;">
            <div style="color: #a1772d; margin-bottom:5px;">
                ${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}
            </div>
            <p style="font-family: var(--textFamily); color: #333;">${r.comment}</p>
        </div>
    `).join('');
}

// Lógica de Adicionar ao Carrinho vinda da página de detalhes
function addToCartFromDetails(id, category, name, price, stock) {
    let cart = JSON.parse(localStorage.getItem('arkisanteCart')) || [];
    
    // Regra: Apenas 1 projeto estrutural
    if (category === 'project') {
         const cartHasProject = cart.some(i => i.name.includes('Projeto') || i.category === 'project');
         if(cartHasProject) {
             alert("Você só pode selecionar UM projeto estrutural por vez.");
             return;
         }
    }

    const cartItem = cart.find(i => i.id === id);
    const currentQty = cartItem ? cartItem.quantity : 0;

    if (currentQty + 1 > stock) {
        alert("Estoque insuficiente.");
        return;
    }

    if (cartItem) {
        cartItem.quantity++;
    } else {
        cart.push({ id, quantity: 1, name, price, category }); 
    }

    localStorage.setItem('arkisanteCart', JSON.stringify(cart));
    alert("Produto adicionado ao carrinho!");
}

// Enviar Avaliação
document.getElementById('review-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    if(currentRating === 0) {
        alert("Por favor, selecione uma nota de 1 a 5 estrelas.");
        return;
    }
    
    const comment = document.getElementById('review-comment').value;

    try {
        const res = await fetch(`${API_URL}/review/${productId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ rating: currentRating, comment })
        });

        if(res.ok) {
            document.getElementById('review-comment').value = '';
            
            // Reseta visualmente as estrelas
            currentRating = 0; 
            const stars = document.querySelectorAll('.star-icon');
            highlightStars(stars, 0); 
            
            // Recarrega os reviews (isso chamará loadDetails novamente, mas nossa proteção vai impedir a duplicação)
            loadDetails(); 
        } else {
            alert("Erro ao enviar avaliação.");
        }
    } catch(err) {
        console.error(err);
    }
});

// Inicia
loadDetails();