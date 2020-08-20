var tronWeb;
var currentAddr;
var bankContract;

window.onload = function() {
    if (!window.tronWeb) {
        const HttpProvider = TronWeb.providers.HttpProvider;
        const fullNode = new HttpProvider('https://api.trongrid.io');
        const solidityNode = new HttpProvider('https://api.trongrid.io');
        const eventServer = 'https://api.trongrid.io/';

        const tronWeb = new TronWeb(fullNode, solidityNode, eventServer,);
        window.tronWeb = tronWeb;
    }
    once();
};

async function once() {
    tronWeb = window.tronWeb;
    bankContract = await tronWeb.contract().at("TSEGf9jZCzLQMH2PTyF7f7NN3NfrbqHd5p");

    currentAddr = tronWeb.defaultAddress['base58'];
    console.log(currentAddr);
          
    setTimeout(function() {}, 2000);
    setInterval(function() {main();}, 2000);
}

function main() {
    _bankDetails();
    _checkPayback();
    _checkPaid();
}

function depositTRX() {
    var depositTrxAmount = $('#trx-deposit').val();
    bankContract.depositTrx().send({callValue: depositTrxAmount * 1e6}).then(result => {
        console.log(result)
        $('#tx-readout').text(depositTrxAmount + "TRX has been deposited to the bank.")
        document.getElementById("tx-readout").className = "text-success"; 
    }).catch((err) => {
        console.log(err)
    });
}

function depositUSDJ() {
    var depositAmount = $('#token-deposit').val();
    bankContract.deposit(tronWeb.toHex(Math.floor(depositAmount * 1e18))).send().then(result => {
        console.log(result)
        $('#tx-readout').text("$" + depositAmount + " has been deposited to the bank.")
        document.getElementById("tx-readout").className = "text-success";
    }).catch((err) => {
        console.log(err)
    });
}

function withdrawTRX() {
    var withdrawTrxAmount = $('#trx-withdraw').val();
    bankContract.withdraw(tronWeb.toHex(Math.floor(withdrawTrxAmount * 1e6))).send().then(result => {
        console.log(result)
        $('#tx-readout').text(withdrawTrxAmount + "TRX has been withdrawn from the bank.")
        document.getElementById("tx-readout").className = "text-danger";
    }).catch((err) => {
        console.log(err)
    });
}

function withdrawUSDJ() {
    var withdrawAmount = $('#token-withdraw').val();
    bankContract.withdrawTokens(tronWeb.toHex(Math.floor(withdrawAmount * 1e18))).send().then(result => {
        console.log(result)
        $('#tx-readout').text("$" + withdrawAmount + " has been withdrawn from the bank.")
        document.getElementById("tx-readout").className = "text-danger";
    }).catch((err) => {
        console.log(err)
    });
}

function toggleBank() {
    bankContract.toggleBank().send().then(result => {
        console.log(result)
        $('#tx-readout').text(result)
        document.getElementById("tx-readout").className = "text-white";
    }).catch((err) => {
        console.log(err)
    });
}

// What the admin is owed
function _checkPayback() {
    bankContract.payback().call().then(result => {
        var owedAmount = (result / 1e18).toFixed(2);
        $("#liquidityContributed").text('$' + owedAmount);
        document.getElementById("liquidityContributed").className = "text-success";
    }).catch((err) => {
        console.log(err)
    });
}

// What's been paid to the admin
function _checkPaid() {
    bankContract.paid().call().then(result => {
        var paidAmount = (result / 1e18).toFixed(2);
        $("#returnsPaid").text('$' + paidAmount);
        document.getElementById("returnsPaid").className = "text-danger";
    }).catch((err) => {
        console.log(err)
    });
}

function _bankDetails() {
    bankContract.bankData().call().then(result => {
        var trxBalance = result.tronBal/1e6;
        var tknBalance = result.tokenBal/1e18;
        var bankStatus = result.closed;
        if (bankStatus = "false") {
            $("#operationStatus").text("Open");
            document.getElementById("operationStatus").className = "text-success";
        } else {
            $("#operationStatus").text("Closed");
            document.getElementById("operationStatus").className = "text-danger";
        }
        $("#trx-balance").text(trxBalance.toFixed(0));
        $("#tkn-balance").text(tknBalance.toFixed(2));
    }).catch((err) => {
        console.log(err)
    });
    
    // Fee percentage
    bankContract.feePercentage().call().then(result => {
        $(".fee-percentage").text(result + '% per Trade');
        document.getElementsByClassName("fee-percentage").className = "text-white";
    }).catch((err) => {
        console.log(err)
    })
    
    var totalOwed = $("#liquidityContributed").val();
    var totalPaid = $("#returnsPaid").val();
    var remaining = totalOwed - totalPaid / 1e18;
    $("#remaining").text('You are owed' + remaining)
}