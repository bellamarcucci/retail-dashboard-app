const API_URL = 'http://localhost:3000/api';
const params = new URLSearchParams(window.location.search);
const productId = params.get('id');

async function loadDetails() {
    const res = await fetch(`${API_URL}/products/${productId}`);
    if (!res.ok) return document.body.innerHTML = "<h1>Produto não encontrado</h1>";
    
    const product = await res.json();
    
    document.getElementById('product-detail-view').innerHTML = `
        <div class="shop-layout">
            <img src="${product.image}" style="width:100%; border-radius:15px; max-height:400px; object-fit:cover;">
            <div>
                <h1 style="font-family: var(--titleFamily)">${product.name}</h1>
                <h2 style="color:#a1772d">R$ ${product.price.toLocaleString('pt-BR')}</h2>
                <p style="font-family: var(--textFamily); margin: 20px 0;">${product.description}</p>
                <p>Categoria: <b>${product.category.toUpperCase()}</b></p>
                <p>Estoque disponível: ${product.stock}</p>
            </div>
        </div>
    `;

    renderReviews(product.reviews);
}

function renderReviews(reviews) {
    const list = document.getElementById('reviews-list');
    if (reviews.length === 0) {
        list.innerHTML = "<p>Sem avaliações ainda.</p>";
        return;
    }
    
    list.innerHTML = reviews.map(r => `
        <div style="background:#f0f0f0; padding:10px; margin-bottom:10px; border-radius:5px;">
            <strong>${'★'.repeat(r.rating)}</strong>
            <p>${r.comment}</p>
        </div>
    `).join('');
}

document.getElementById('review-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const rating = document.getElementById('review-rating').value;
    const comment = document.getElementById('review-comment').value;

    await fetch(`${API_URL}/review/${productId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating, comment })
    });

    document.getElementById('review-comment').value = '';
    loadDetails(); // Reload to see new review
});

loadDetails();