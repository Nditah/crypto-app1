const electron = require('electron')
const path = require('path')
const axios = require('axios')
const ipc = electron.ipcRenderer
const BrowserWindow = electron.remote.BrowserWindow

var price = document.querySelector('h1')
var targetPrice = document.getElementById('targetPrice')
var targetPriceVal;

const notification = {
    title: 'BTC Alert',
    body: 'BTC just beat your target price!',
    icon: path.join(__dirname, '../assets/images/bitcoin.png')
}

function getBTC() {
    axios.get('https://min-api.cryptocompare.com/data/pricemulti?fsyms=BTC&tsyms=USD')
        .then(res => {
            const cryptos = res.data.BTC.USD
            price.innerHTML = '$' + cryptos.toLocaleString('en')

            // Notification:
            let myNotification;
            if (targetPrice.innerHTML != '' && targetPriceVal < res.data.BTC.USD) {
                myNotification = new window.Notification(notification.title, notification)
                console.log('BTC Alert')
            }

            myNotification.onclick = () => {
                console.log('clicked')
            }

        })
}

getBTC();
setInterval(getBTC, 10000);

const notifyBtn = document.getElementById('notifyBtn')

notifyBtn.addEventListener('click', function (event) {
    const modalPath = path.join('file://', __dirname, 'add.html')
    //let win = new BrowserWindow({ width: 400, height: 200 })
    let win = new BrowserWindow({
        frame: false,
        alwaysOnTop: true,
        transparent: false,
        width: 400,
        height: 200
    })
    win.on('close', function () { win = null })
    win.loadURL(modalPath)
    win.show()
})

ipc.on('targetPriceVal', function (event, arg) {
    targetPriceVal = Number(arg);
    targetPrice.innerHTML = '$' + targetPriceVal.toLocaleString('en')
})