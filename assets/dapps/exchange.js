let tokenAddr = 'TMwFHYXLJaRUPeW6421aqXL4ZEzPRFGkGT'
let bankAddr = 'TSEGf9jZCzLQMH2PTyF7f7NN3NfrbqHd5p'
let userAddr = ''

let token
let bank
let bankData

let userTrx = 0
let userTokens = 0

let lastModifiedBuy = 'trx'
let lastModifiedSell = 'token'

let validBuy = true
let validSell = true

let lastBuyRate = 69e6
let lastSellRate = 69e6

let firstEvent
let lastEvent
let lastCall = ''

// Main loop with address-change detection
async function interfaceLoop() {
    try {
        if (!customView && !defaultTronWeb) {if (userAddr == '') {userAddr = tronWeb.defaultAddress.base58} else if (tronWeb.defaultAddress.base58 != userAddr) { document.location.reload()}}

        lastCall = 'userTrx'
        userTrx = Number(await tronWeb.trx.getUnconfirmedBalance(userAddr)) / 1e6
   
        lastCall = 'userTokens'
        userTokens = Number(await token.methods.balanceOf(userAddr).call())

        // check allowance
        lastCall = 'bankAllowance'
        let bankAllowance = await token.methods.allowance(userAddr, bankAddr).call()
        if (Number(bankAllowance) > 100e18) {$('#approval').hide()} else {$('#approval').show()}

        lastCall = 'bankData'
        bankData = await bank.methods.bankData().call()
        
        // returns (bool closed, uint market, uint buy, uint sell, uint tronBal, uint tokenBal)
        $('.marketRate').text((bankData.market/1e18).toFixed(6))
        $('.ourBuyRate').text((bankData.buy/1e18).toFixed(6))
        $('.ourSellRate').text((bankData.sell/1e18).toFixed(6))
        $('.availableTrxBuy').text((bankData.tronBal/1e6).toFixed(2) + ' TRX')
        $('.availableUsdBuy').text(formatDollas(bankData.tokenBal))
        $('.availableTrxSell').text((bankData.tronBal/1e6).toFixed(2) + ' TRX')
        $('.availableUsdSell').text(formatDollas(bankData.tokenBal))

        if (lastModifiedBuy == 'trx') {updateBankBuy(0)} else {updateBankBuy(1)}
        if (lastModifiedSell == 'token') {updateBankSell(0)} else {updateBankSell(1)}

        $('#trxBalBuy').text((userTrx).toFixed(2) + ' TRX')
        $('.USDJBalBuy').text(formatDollas(userTokens))
        $('.trxBalSell').text((userTrx).toFixed(2) + ' TRX')
        $('.USDJBalSell').text(formatDollas(userTokens))

        setTimeout(interfaceLoop, 5000)
    } catch(error) { 
        console.log(lastCall + ' failed:')
        console.log(error)
        setTimeout(interfaceLoop, 5000)
    }
}

function addCommas(x) {return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
function getTrxBuy(amount) {return (Math.floor((Number(bankData.buy) * amount)/1e18*1e2)/1e2).toFixed(2)}
function getTokenBuy(amount) {return Math.ceil(Math.floor((amount*1e18)/Number(bankData.buy)*1e2)/1e2)}
function getTrxSell(amount) {return (Math.floor((amount*1e18)/Number(bankData.sell)*1e2)/1e2).toFixed(2)}
function getTokenSell(amount) {return (Math.floor((Number(bankData.sell) * amount)/1e18*1e2)/1e2).toFixed(2)}

function checkValidBuy(amount) {
    validBuy = true
    if (isNaN(amount)) {
        $('#buyTokensBtn').text('INVALID NUMBER')
        validBuy = false
    }
    if (amount < 100) {
        $('#buyTokensBtn').text('100 TRX MINIMUM')
        validBuy = false
    }
    if (amount > userTrx) {
        $('#buyTokensBtn').text('INSUFFICIENT FUNDS')
        document.getElementById("buyTokensBtn").className = "btn btn-block btn-lg btn-dark roundedCorners text-warning"; 
        validBuy = false
    }
    
    let received = getTrxBuy(amount)
    if ((received * 1e18) > Number(bankData.tokenBal)) {
        $('#buyTokensBtn').text('EXCHANGE BALANCE TOO LOW')
        document.getElementById("buyTokensBtn").className = "btn btn-block btn-lg btn-dark roundedCorners text-danger"; 
        validBuy = false
    }
    
    if (!validBuy) {
        $('#buyTokensBtn').css("opacity", ".5")
    } else {
        $('#buyTokensBtn').text('BUY USDJ')
        document.getElementById("buyTokensBtn").className = "btn btn-block btn-lg btn-success roundedCorners text-white"; 
        $('#buyTokensBtn').css("opacity", "1")
    }
}

function checkValidSell(amount) {
    validSell = true
    if (isNaN(amount)) {
        $('#sellTokensBtn').text('INVALID NUMBER')
        validSell = false
    }
    if (amount < 2) {
        $('#sellTokensBtn').text('2 USDJ MINIMUM')
        validSell = false
    }
    if (amount > userTokens) {
        $('#sellTokensBtn').text('INSUFFICIENT FUNDS')
        document.getElementById("sellTokensBtn").className = "btn btn-block btn-lg btn-danger roundedCorners text-white"; 
        $('.USDJBalSell').css('color', '#ff3912')
        validSell = false
    } else {
        $('.USDJBalSell').css('color', '#00c700')
    }
    let received = getTrxSell(amount)
    if ((received * 1e6) > Number(bankData.tronBal)) {
        $('#sellTokensBtn').text('EXCHANGE BALANCE TOO LOW')
        document.getElementById("sellTokensBtn").className = "btn btn-block btn-lg btn-danger roundedCorners text-white"; 
        $('.availableTrxSell').css('color', '#ff3912')
        validSell = false
    } else {
        $('.availableTrxSell').css('color', '#00c700')
    }
    if (!validSell) {
        $('#sellTokensBtn').css("opacity", ".5")
    } else {
        $('#sellTokensBtn').text('SELL USDJ')
        document.getElementById("sellTokensBtn").className = "btn btn-block btn-lg btn-danger roundedCorners text-white"; 
        $('#sellTokensBtn').css("opacity", "1")
    }
}

function updateBankBuy(inp) {
    if (inp == 0) {
        // trx field modified
        let amount = Number($('#bankBuyTrx').val())
        checkValidBuy(amount)
        if (!isNaN(amount)) {
            $('#bankBuyUSDJ').val(getTrxBuy(amount))
            lastModifiedBuy = 'trx'
        }
    } else {
        // usdt field modified
        let amount = Number($('#bankBuyUSDJ').val())
        let trx = getTokenBuy(amount)
        checkValidBuy(trx)
        if (!isNaN(amount)) {
            $('#bankBuyTrx').val(trx)
            lastModifiedBuy = 'token'
        }
    }
}

function updateBankSell(inp) {
    if (inp == 0) {
        // usdt field modified
        let amount = Number($('#bankSellUSDJ').val())
        checkValidSell(amount)
        if (!isNaN(amount)) {
            $('#bankSellTrx').val(getTrxSell(amount))
            lastModifiedSell = 'token'
        }
    } else {
        // trx field modified
        let amount = Number($('#bankSellTrx').val())
        let tokens = getTokenSell(amount)
        checkValidSell(tokens)
        if (!isNaN(amount)) {
            $('#bankSellUSDJ').val(tokens)
            lastModifiedSell = 'trx'
        }
    }
}

// let tronlink load
window.addEventListener('load', async function() {setTimeout(setup, 2000) })

let tronWebNotFoundEvent = false
let defaultTronWeb = false
let customView = false

async function setup () {
    if (typeof (window.tronWeb) === 'undefined') {
        window.tronWeb = await new TronWeb({
            fullHost: 'https://api.trongrid.io',
            eventServer: 'https://api.trongrid.io',
            solidityNode: 'https://api.trongrid.io',
            privateKey: 'a59ddaaeb8a488fb77dc905b9ffa7387d42b457d68730854ea0f09b2269934e4'
        })
        defaultTronWeb = true
        dataLayer.push({'event': 'tronWebNotFound', 'ec': 'tronWeb', 'ea': 'Not Found', 'el': '(not set)'})
    }

    token = await tronWeb.contract().at(tokenAddr)
    bank = await tronWeb.contract().at(bankAddr)
    await interfaceLoop()
}

function approveBank() {
    if (customView || defaultTronWeb) {return}
    let amount = tronWeb.toHex(2**255)
    token.approve(bankAddr, amount).send()
}

function bankBuy() {
    if (customView || defaultTronWeb) {return}
    if (validBuy) {
        let amount = Number($('#bankBuyTrx').val())
        console.log(amount * 1e6)
        bank.methods.buyTokens().send({callValue: Math.floor(amount * 1e6), feeLimit: 10e6})
        dataLayer.push({'event': 'bankBuy', 'ec': 'Buy USDJ', 'ea': amount, 'el': '(not set)'})
    }
}

function bankSell() {
    if (customView || defaultTronWeb) {return}
    if (validSell) {
        let amount = Number($('#bankSellUSDJ').val())
        bank.methods.sellTokens(tronWeb.toHex(Math.floor(amount * 1e18))).send({feeLimit: 10e6})
        dataLayer.push({'event': 'bankSell', 'ec': 'Sell USDJ', 'ea': amount, 'el': '(not set)'})
    }
}

function formatDollas(amount) {
    if (amount < 0) {return '-$' + addCommas((Math.abs(amount)/1e18).toFixed(2))}
    return '$' + addCommas((amount/1e18).toFixed(2))
}