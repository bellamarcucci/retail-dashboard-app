// DADOS MOCKADOS (Mesmos do shop.js para manter consistência)
const mockProducts = [
    { "id": 1, "name": "Projeto Clínica Pequena", "stock": 10, "reviews": [{rating: 5, comment: "Excellent service!"}, {rating: 4, comment: "Good"}] },
    { "id": 2, "name": "Projeto Clínica Média", "stock": 8, "reviews": [{rating: 5, comment: "Amazing"}] },
    { "id": 3, "name": "Projeto Clínica Grande", "stock": 5, "reviews": [] },
    { "id": 4, "name": "Projeto Hospitalar Médio", "stock": 3, "reviews": [{rating: 2, comment: "Bad experience"}] },
    { "id": 5, "name": "Projeto Hospitalar Grande", "stock": 2, "reviews": [{rating: 5, comment: "Great"}] },
    { "id": 6, "name": "Consultoria RDC-50", "stock": 50, "reviews": [] },
    { "id": 7, "name": "Design de Interiores 3D", "stock": 50, "reviews": [{rating: 5, comment: "Loved it"}] },
    // ... adicione os outros itens se desejar ver todos na lista
];

async function initAdmin() {
    // Em vez de fetch, processamos os dados locais
    const stats = processDashboardData(mockProducts);
    
    renderSentimentChart(stats);
    renderStockChart(mockProducts); // Passamos os produtos direto
    renderInventory(mockProducts);
}

// Simula a lógica que o servidor faria
function processDashboardData(products) {
    const keywords = {
        positive: /great|good|excellent|amazing|love|loved/i,
        negative: /bad|poor|broken|disappoint|hate/i
    };

    let positiveReviews = 0;
    let negativeReviews = 0;

    products.forEach(p => {
        p.reviews.forEach(r => {
            if (keywords.positive.test(r.comment)) positiveReviews++;
            if (keywords.negative.test(r.comment)) negativeReviews++;
        });
    });

    return { positiveReviews, negativeReviews };
}

function renderSentimentChart(stats) {
    const ctx = document.getElementById('sentimentChart').getContext('2d');
    
    // Destruir gráfico anterior se existir (para evitar sobreposição ao recarregar)
    if (window.mySentimentChart) window.mySentimentChart.destroy();

    window.mySentimentChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Positivo', 'Negativo'],
            datasets: [{
                data: [stats.positiveReviews, stats.negativeReviews],
                backgroundColor: ['#4CAF50', '#F44336']
            }]
        }
    });
}

function renderStockChart(products) {
    const ctx = document.getElementById('stockChart').getContext('2d');
    
    // Filtramos apenas os 5 primeiros para o gráfico não ficar gigante
    const topProducts = products.slice(0, 5);

    if (window.myStockChart) window.myStockChart.destroy();

    window.myStockChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: topProducts.map(p => p.name),
            datasets: [{
                label: 'Estoque Atual',
                data: topProducts.map(p => p.stock),
                backgroundColor: '#00152E'
            }]
        },
        options: { 
            responsive: true,
            scales: { y: { beginAtZero: true } } 
        }
    });
}

function renderInventory(products) {
    const container = document.getElementById('inventory-list');
    container.innerHTML = products.map(p => `
        <div class="inventory-item">
            <span>${p.name} (ID: ${p.id})</span>
            <div class="stock-control">
                <span id="stock-val-${p.id}">Atual: ${p.stock}</span>
                <button onclick="simulateUpdateStock(${p.id}, 1)">+1</button>
                <button onclick="simulateUpdateStock(${p.id}, 10)">+10</button>
            </div>
        </div>
    `).join('');
}

// Função simulada para atualizar o HTML visualmente (já que não temos banco de dados)
function simulateUpdateStock(id, qty) {
    const product = mockProducts.find(p => p.id === id);
    if (product) {
        product.stock += qty;
        // Atualiza o texto na tela
        document.getElementById(`stock-val-${id}`).innerText = `Atual: ${product.stock}`;
        // Atualiza o gráfico
        renderStockChart(mockProducts);
        alert(`Estoque de "${product.name}" atualizado para ${product.stock}`);
    }
}

// Inicia o dashboard
initAdmin();