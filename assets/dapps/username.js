var tronWeb;
var currentAddr;
var userdbContract;

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
    userdbContract = await tronWeb.contract().at("TZ27Uae32vbz1WshKygJU37dPPrvtVPAr4");

    currentAddr = tronWeb.defaultAddress['base58'];
    console.log(currentAddr);
          
    setTimeout(function() {}, 2000);
    setInterval(function() {main();}, 2000);
}

function main() {
    getLoggedInUsername();
}

function getLoggedInUsername() {
    userdbContract.getNameByAddress(currentAddr).call().then(result => {
        console.log(result)
        $('.arcTag').text(result.name)
        document.getElementsByClassName("arcTag").className = "text-white";
    }).catch((err) => {
        console.log(err)
    });
}

function registerName() {
    var newUsername = $("#newUsername").val();
    var txValue = 10000000;
    userdbContract.registerName(newUsername).send( {callValue: txValue} ).then(result => {
        console.log(result)
        $('#tx-readout').text(result)
        document.getElementById("tx-readout").className = "text-white";
    }).catch((err) => {
        console.log(err)
    });
}

function checkAvailability() {
    var name_string = $("#newUsername").val();
    userdbContract.isAvailable(name_string).call().then(result => {
        var textTrickOperator = result.toString();
        console.log(result)
        console.log(textTrickOperator)
        
        if (textTrickOperator == "true") {
            document.getElementById("availableStatus").className = "text-success";
            document.getElementById("registerButtonArea").style.display = "block";
        } else {
            document.getElementById("availableStatus").className = "text-danger";
            document.getElementById("registerButtonArea").style.display = "none";
        }
        $('#availableStatus').text(result)
    }).catch((err) => {
        console.log(err)
    });
}

function getArctag() {
    var address_string = $("#addressToCheck").val();
    userdbContract.getNameByAddress(address_string).call().then(result => {
        console.log(result)
        $('#checkedAddressTag').text(result.name)
        document.getElementById("arctagResults").style.display = "block";
        document.getElementById("checkedAddressTag").className = "text-white";
    }).catch((err) => {
        console.log(err)
    });
}

function getAddress() {
    var tag_string = $("#tagToCheck").val();
    userdbContract.getAddressByName(tag_string).call().then(result => {
        console.log(result)
        $('#checkedTagAddress').text(result)
        document.getElementById("addressResults").style.display = "block";
        document.getElementById("checkedTagAddress").className = "text-white";
    }).catch((err) => {
        console.log(err)
    });
}