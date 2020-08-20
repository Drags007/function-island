async function run() {
    var abi = [{"constant":true,"inputs":[{"name":"_user","type":"address"}],"name":"dividendsOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_tokens","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_receivers","type":"address[]"},{"name":"_amounts","type":"uint256[]"}],"name":"bulkTransfer","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_tokens","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_tokens","type":"uint256"}],"name":"unstake","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_user","type":"address"}],"name":"isWhitelisted","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_tokens","type":"uint256"},{"name":"_data","type":"bytes"}],"name":"transferAndCall","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_tokens","type":"uint256"}],"name":"burn","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_user","type":"address"}],"name":"allInfoFor","outputs":[{"name":"totalTokenSupply","type":"uint256"},{"name":"totalTokensStaked","type":"uint256"},{"name":"userBalance","type":"uint256"},{"name":"userStaked","type":"uint256"},{"name":"userDividends","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_user","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalStaked","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_tokens","type":"uint256"}],"name":"distribute","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_tokens","type":"uint256"}],"name":"stake","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_tokens","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_user","type":"address"}],"name":"stakedOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_user","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"collect","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_user","type":"address"},{"name":"_status","type":"bool"}],"name":"whitelist","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"tokens","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"tokens","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"user","type":"address"},{"indexed":false,"name":"status","type":"bool"}],"name":"Whitelist","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":false,"name":"tokens","type":"uint256"}],"name":"Stake","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":false,"name":"tokens","type":"uint256"}],"name":"Unstake","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":false,"name":"tokens","type":"uint256"}],"name":"Collect","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"tokens","type":"uint256"}],"name":"Burn","type":"event"}];
    var address = 'TW3jVdNaxSr8ajjs6AAZkAvW1cRipeyXuv';
    var FNB = await tronWeb.contract().at(address);

    function init() {

        setInterval(()=>{update()},3000)

        $('#freezeToggle .nav-link').click(function () {
            $('#freezeToggle .nav-link').removeClass('active');
            $(this).addClass('active');
            var toggle = $(this).attr('toggle');
            $('.freeze, .unfreeze').hide();
            $('.' + toggle).show();
        });

        $('#transfer').click(async function (event) {
            event.preventDefault();
            var amount = parseInt($('#transferAmount').val());
            let value = amount.toString() + "000000";
            var to = $('#transferReceiver').val();
            if (amount > 0 && to.length == 34) {
                try {
                    await FNB.transfer(to, value).send();
                } catch (err) {
                    console.error(err)
                }
            }
        });

        $('#freeze').click(async function (event) {
            event.preventDefault();
            var amount = parseInt($('#freezeAmount').val());
            let value = amount.toString() + "000000";
            console.log(value)
            if (amount > 0) {
                try {
                    await FNB.stake(value).send();
                } catch (err) {
                    console.error(err)
                }
            }
        });

        $('#unfreeze').click(async function (event) {
            event.preventDefault();
            var amount = parseInt($('#unfreezeAmount').val());
            let value = amount.toString() + "000000";
            console.log(value)
            if (amount > 0) {
                try {
                    await FNB.unstake(value).send();
                } catch (err) {
                    console.error(err)
                }
            }
        });

        $('#withdraw').click(function () {
            FNB.collect().send(function (error, hash) {
                if (!error) {
                    console.log(hash);
                } else {
                    console.log(error);
                }
            });
        });

        setTimeout(update, 500);
    }

    function update() {
        var account = tronWeb.defaultAddress !== undefined && tronWeb.defaultAddress.base58 !== undefined ? tronWeb.defaultAddress.base58 : null;
        FNB.allInfoFor(account).call(function (error, info) {
            if (!error) {
                console.log(info);
                $('#totalSupply').text(formatNumber(parseFloat(info.totalTokenSupply / 1e6), 5));
                $('#totalFrozen').text(formatNumber(parseFloat(info.totalTokensStaked / 1e6), 5));
                $('.myTokens').text(formatNumber(parseFloat(info.userBalance / 1e6), 5));
                $('.myFrozen').text(formatNumber(parseFloat(info.userStaked / 1e6), 5));
                $('#myDividends').text(formatNumber(parseFloat(info.userDividends / 1e6), 5));
                $('#withdrawAmount').text(formatNumber(parseFloat(info.userDividends / 1e6), 5));
            } else {
                console.log(error);
            }
        });
    }

    function log10(val) {return Math.log(val) / Math.log(10);}

    function formatNumber(n, maxDecimals) {
        var zeroes = Math.floor(log10(Math.abs(n)));
        var postfix = '';
        if (zeroes >= 9) {
            postfix = 'B';
            n /= 1e9;
            zeroes -= 9;
        } else if (zeroes >= 6) {
            postfix = 'M';
            n /= 1e6;
            zeroes -= 6;
        }

        zeroes = Math.min(maxDecimals, maxDecimals - zeroes);
        return (n.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: Math.max(zeroes, 0)}) + postfix);
    }
    $(document).ready(init);
}

let waitForTronWeb=function(){if(window.tronWeb===undefined){setTimeout(waitForTronWeb,500);} else {run();}}
waitForTronWeb();