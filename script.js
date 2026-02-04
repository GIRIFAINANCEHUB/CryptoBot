let balance = 10000;
let pnl = 0;
let botOn = false;

function showSection(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

function buy() {
  pnl += 50;
  updatePortfolio();
  addHistory("BUY trade executed");
}

function sell() {
  pnl -= 30;
  updatePortfolio();
  addHistory("SELL trade executed");
}

function toggleBot() {
  botOn = !botOn;
  document.getElementById("botStatus").innerText = botOn ? "ON" : "OFF";
}

function updatePortfolio() {
  document.getElementById("pnl").innerText = pnl;
  document.getElementById("balance").innerText = balance + pnl;
}

function addHistory(text) {
  const li = document.createElement("li");
  li.innerText = text;
  document.getElementById("historyList").appendChild(li);
}
