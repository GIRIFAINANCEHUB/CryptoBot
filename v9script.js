let balance=10000,pnl=0,botOn=false,masterSwitch=false,price=30000;
let historyList=[];
const priceChartCtx=document.getElementById("priceChart").getContext("2d");
const portfolioChartCtx=document.getElementById("portfolioChart").getContext("2d");
const indicatorChartCtx=document.getElementById("indicatorChart").getContext("2d");
const orderbookList=document.getElementById("orderbookList");
const analyticsChartCtx=document.getElementById("analyticsChart").getContext("2d");

const priceChart=new Chart(priceChartCtx,{type:'line',data:{labels:[],datasets:[{label:'BTC Price',data:[],borderColor:'#ffd700',tension:0.2}]},options:{responsive:true,animation:false}});
const portfolioChart=new Chart(portfolioChartCtx,{type:'line',data:{labels:[],datasets:[{label:'Portfolio Value',data:[],borderColor:'#00ffff',tension:0.2}]},options:{responsive:true,animation:false}});
const indicatorChart=new Chart(indicatorChartCtx,{type:'line',data:{labels:[],datasets:[{label:'RSI',data:[],borderColor:'#ff0000',tension:0.2},{label:'EMA',data:[],borderColor:'#00ff00',tension:0.2},{label:'MACD',data:[],borderColor:'#0000ff',tension:0.2} ]},options:{responsive:true,animation:false}});
const analyticsChart=new Chart(analyticsChartCtx,{type:'line',data:{labels:[],datasets:[{label:'PnL',data:[],borderColor:'#ff00ff',tension:0.2}]},options:{responsive:true,animation:false}});

function showSection(id){document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));document.getElementById(id).classList.add('active');}
function toggleMasterSwitch(){masterSwitch=document.getElementById("masterSwitch").checked;if(masterSwitch){botOn=false;document.getElementById("botSwitch").checked=false;addHistory("Master Switch ON → All trades closed");pnl=0;updatePortfolio();}}
function buy(){executeTrade("long");}
function sell(){executeTrade("short");}
function executeTrade(type){if(masterSwitch)return;const leverage=Number(document.getElementById("leverage").value);let change=type==="long"?50*leverage:-30*leverage;pnl+=change;addHistory(`${type.toUpperCase()} executed, PnL ${change>=0?'+':'-'}$${Math.abs(change)}`);updatePortfolio();}
function toggleBot(){botOn=document.getElementById("botSwitch").checked;}
function updatePortfolio(){
    document.getElementById("pnl").innerText=pnl;
    document.getElementById("pnl2").innerText=pnl;
    document.getElementById("balance").innerText=balance+pnl;
    document.getElementById("balance2").innerText=balance+pnl;
    const percent=((pnl/balance)*100).toFixed(2);
    document.getElementById("gainloss").innerText=percent+"%";
    portfolioChart.data.labels.push(new Date().toLocaleTimeString());
    portfolioChart.data.datasets[0].data.push(balance+pnl);
    if(portfolioChart.data.labels.length>20){portfolioChart.data.labels.shift();portfolioChart.data.datasets[0].data.shift();}
    portfolioChart.update();

    analyticsChart.data.labels.push(new Date().toLocaleTimeString());
    analyticsChart.data.datasets[0].data.push(pnl);
    if(analyticsChart.data.labels.length>20){analyticsChart.data.labels.shift();analyticsChart.data.datasets[0].data.shift();}
    analyticsChart.update();
}
function addHistory(text){const li=document.createElement("li");li.innerText=`[${new Date().toLocaleTimeString()}] ${text}`;document.getElementById("historyList").appendChild(li);}
function changeExchange(){let ex=document.getElementById("exchangeSelect").value;addHistory(`Exchange switched to ${ex}`);}
function toggleDarkMode(){document.body.classList.toggle("darkmode");}
function calculateRisk(){
    let entry=Number(document.getElementById("entryPrice").value);
    let leverage=Number(document.getElementById("calcLeverage").value);
    let balance=Number(document.getElementById("calcBalance").value);
    let liquidationPrice=entry*(1 - 1/leverage);
    let maxRisk=balance/leverage;
    document.getElementById("calcResult").innerText=
        `Liquidation Price: $${liquidationPrice.toFixed(2)} | Max Risk: $${maxRisk.toFixed(2)}`;
}

// Simulation + Indicators + Order Book + Auto Bot
setInterval(()=>{
    let delta=(Math.random()-0.5)*200; price+=delta;
    document.getElementById("price").innerText="$"+Math.round(price);
    priceChart.data.labels.push(new Date().toLocaleTimeString()); priceChart.data.datasets[0].data.push(price);
    if(priceChart.data.labels.length>20){priceChart.data.labels.shift();priceChart.data.datasets[0].data.shift();} priceChart.update();

    const rsi=(Math.random()*100).toFixed(2);
    const ema=(price-100+Math.random()*200).toFixed(2);
    const macd=(Math.random()*20-10).toFixed(2);
    document.getElementById("rsi").innerText=rsi;
    document.getElementById("ema").innerText=ema;
    document.getElementById("macd").innerText=macd;
    document.getElementById("bollinger").innerText=`Upper: ${(price+100).toFixed(2)} | Lower: ${(price-100).toFixed(2)}`;
    document.getElementById("vwap").innerText=(price-50+Math.random()*100).toFixed(2);

    indicatorChart.data.labels.push(new Date().toLocaleTimeString());
    indicatorChart.data.datasets[0].data.push(rsi);
    indicatorChart.data.datasets[1].data.push(ema);
    indicatorChart.data.datasets[2].data.push(macd);
    if(indicatorChart.data.labels.length>20){indicatorChart.data.labels.shift();indicatorChart.data.datasets.forEach(d=>d.data.shift());}
    indicatorChart.update();

    // Order book simulation
    orderbookList.innerHTML="";
    for(let i=0;i<5;i++){orderbookList.innerHTML+=`<li>Bid ${i+1}: $${Math.round(price-50+i*10)} / Ask ${i+1}: $${Math.round(price+50+i*10)}</li>`;}

    if(botOn && !masterSwitch){
        let strategy=document.getElementById("strategy").value;
        let tradeType=document.getElementById("tradeType").value;
        if(Math.random()>0.7){executeTrade(tradeType);}
    }

},1000);
