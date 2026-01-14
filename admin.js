const API_URL = 'http://localhost:3000/api';

// 1. Variáveis globais para guardar as instâncias dos gráficos
let sentimentChartInstance = null;
let stockChartInstance = null;

async function initAdmin() {
    try {
        // Busca os dados do Dashboard
        const res = await fetch(`${API_URL}/admin/dashboard`);
        const stats = await res.json();
        
        renderSentimentChart(stats);
        renderStockChart(stats.productSalesPotential);
        
        // Busca a lista completa de produtos para a tabela de estoque
        const prodRes = await fetch(`${API_URL}/products`);
        const products = await prodRes.json();
        renderInventory(products);
    } catch (err) {
        console.error("Erro ao carregar dashboard:", err);
    }
}

function renderSentimentChart(stats) {
    const ctx = document.getElementById('sentimentChart').getContext('2d');
    
    // 2. VERIFICAÇÃO E DESTRUIÇÃO: Se já existe um gráfico, destrua-o
    if (sentimentChartInstance) {
        sentimentChartInstance.destroy();
    }

    // 3. Cria o novo gráfico e salva na variável global
    sentimentChartInstance = new Chart(ctx, {
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
    
    // Filtramos apenas os 10 primeiros para o gráfico não ficar gigante
    const topProducts = products.slice(0, 10);

    // 2. VERIFICAÇÃO E DESTRUIÇÃO: Se já existe um gráfico, destrua-o
    if (stockChartInstance) {
        stockChartInstance.destroy();
    }

    // 3. Cria o novo gráfico e salva na variável global
    stockChartInstance = new Chart(ctx, {
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
                <button onclick="updateStock(${p.id}, 1)">+1</button>
                <button onclick="updateStock(${p.id}, -1)">-1</button>
            </div>
        </div>
    `).join('');
}

async function updateStock(id, qty) {
    try {
        const res = await fetch(`${API_URL}/admin/stock`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, quantity: qty })
        });

        if (res.ok) {
            // Recarrega tudo para atualizar gráficos e lista
            initAdmin(); 
        } else {
            alert("Erro ao atualizar estoque");
        }
    } catch (err) {
        console.error(err);
    }
}

// Inicia o dashboard
initAdmin();