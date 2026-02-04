// === Variables ===
let balance = 10000;
let pnl = 0;
let botOn = false;
let masterSwitch = false;
let price = 30000;
let historyList = [];

const priceChartCtx = document.getElementById("priceChart").getContext("2d");
const portfolioChartCtx = document.getElementById("portfolioChart").getContext("2d");

// === Chart.js Setup ===
const priceChart = new Chart(priceChartCtx, {
    type: 'line',
    data: { labels: [], datasets: [{ label: 'BTC Price', data: [], borderColor: '#ffd700', tension: 0.2 }] },
    options: { responsive: true, animation: false }
});

const portfolioChart = new Chart(portfolioChartCtx, {
    type: 'line',
    data: { labels: [], datasets: [{ label: 'Portfolio Value', data: [], borderColor: '#00ffff', tension: 0.2 }] },
    options: { responsive: true, animation: false }
});

// === Section Navigation ===
function showSection(id) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(id).classList.add('active');
}

// === Master Switch ===
function toggleMasterSwitch() {
    masterSwitch = document.getElementById("masterSwitch").checked;
    if(masterSwitch) {
        botOn = false;
        document.getElementById("botSwitch").checked = false;
        addHistory("Master Switch ON → All trades closed");
        pnl = 0;
        updatePortfolio();
    }
}

// === Manual Trade ===
function buy() { executeTrade("long"); }
function sell() { executeTrade("short"); }

function executeTrade(type) {
    if(masterSwitch) return;
    const leverage = Number(document.getElementById("leverage").value);
    let change = type==="long"?50*leverage:-30*leverage;
    pnl += change;
    addHistory(`${type.toUpperCase()} executed, PnL ${change>=0?'+':'-'}$${Math.abs(change)}`);
    updatePortfolio();
}

// === Auto Bot ===
function toggleBot() {
    botOn = document.getElementById("botSwitch").checked;
}

// === Update Portfolio ===
function updatePortfolio() {
    document.getElementById("pnl").innerText = pnl;
    document.getElementById("pnl2").innerText = pnl;
    document.getElementById("balance").innerText = balance + pnl;
    document.getElementById("balance2").innerText = balance + pnl;
    const percent = ((pnl/balance)*100).toFixed(2);
    document.getElementById("gainloss").innerText = percent + "%";

    portfolioChart.data.labels.push(new Date().toLocaleTimeString());
    portfolioChart.data.datasets[0].data.push(balance+pnl);
    if(portfolioChart.data.labels.length>20){
        portfolioChart.data.labels.shift();
        portfolioChart.data.datasets[0].data.shift();
    }
    portfolioChart.update();
}

// === Trade History ===
function addHistory(text) {
    const li = document.createElement("li");
    li.innerText = `[${new Date().toLocaleTimeString()}] ${text}`;
    document.getElementById("historyList").appendChild(li);
}

// === Exchange Mapping ===
function changeExchange(){
    let ex = document.getElementById("exchangeSelect").value;
    addHistory(`Exchange switched to ${ex}`);
}

// === Dark Mode ===
function toggleDarkMode() { document.body.classList.toggle("darkmode"); }

// === Simulate Live BTC Price + Auto Bot ===
setInterval(() => {
    let delta = (Math.random()-0.5)*200;
    price += delta;
    document.getElementById("price").innerText = "$"+Math.round(price);

    priceChart.data.labels.push(new Date().toLocaleTimeString());
    priceChart.data.datasets[0].data.push(price);
    if(priceChart.data.labels.length>20){
        priceChart.data.labels.shift();
        priceChart.data.datasets[0].data.shift();
    }
    priceChart.update();

    // Indicators Simulation
    document.getElementById("rsi").innerText = (Math.random()*100).toFixed(2);
    document.getElementById("ema").innerText = (price-100+Math.random()*200).toFixed(2);
    document.getElementById("macd").innerText = (Math.random()*20-10).toFixed(2);

    // Auto Bot Logic
    if(botOn && !masterSwitch){
        let strategy = document.getElementById("strategy").value;
        let tradeType = document.getElementById("tradeType").value;
        if(Math.random()>0.7){ executeTrade(tradeType); }
    }

}, 1000);
