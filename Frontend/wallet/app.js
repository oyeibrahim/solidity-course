require('dotenv').config();

var express = require('express');

// var { Web3 } = require('web3');
var Web3 = require('web3');

// var ethProvider = "https://bsc-dataseed1.binance.org:443"; //ChainID: 56
var ethProvider = "https://data-seed-prebsc-1-s1.binance.org:8545"; //ChainID: 97

var web3 = new Web3(ethProvider);

var app = express();





app.get('/generate-bnb-address', function (req, res) {

    let body = web3.eth.accounts.create();
    res.send(body);

})



app.get('/get-bnb-balance/:address', function (req, res) {

    web3.eth.getBalance(req.params.address, (err, wei) => {

        //result is in wei

        //for normal
        convertedBalance = web3.utils.fromWei(wei, 'ether');

        let res_json = {
            "coin_name": "BNB",
            "coin_symbol": "BNB",
            "address": req.params.address,
            "balance": convertedBalance,
            "wei_balance": wei
        };

        res.send(res_json);

    }).catch(function (err) {
        res.send('failed');
    })
})




app.get('/get-bep20-token-balance-of-address/:address', function (req, res) {

    //using js file
    let dat = require('./contracts/workToken');

    let contract = new web3.eth.Contract(dat.abi, dat.address);

    contract.methods.balanceOf(req.params.address).call().then(function (result) {

        convertedBalance = web3.utils.fromWei(result, 'ether');

        let res_json = {
            "token_name": dat.token_name,
            "token_ticker": dat.token_ticker,
            "address": req.params.address,
            "balance": convertedBalance,
            "wei_balance": result
        };

        res.send(res_json);

    }).catch(function (err) {
        // console.log(err);
        // res.send(err);
        res.send('failed');
    })
})



app.get('/send-bnb/:amount/:to', function (req, res) {


    var from = process.env.YOUR_WALLET_ADDRESS;

    var privateKey = process.env.YOUR_WALLET_ADDRESS_PRIVATE_KEY;

    var to = req.params.to;

    //the plane private key with lenght 64 is needed here.
    if (privateKey.startsWith("0x") && privateKey.length == 66) {
        //If PrivateKey has 0x in front of it, we must remove that
        privateKey = privateKey.substring(2);
    }

    //to get the nounce i.e the number of total transactions by the sender
    web3.eth.getTransactionCount(from, (err, txCount) => {
        if (err) {
            res.send('failed');
        }

        //Auto get gas price
        web3.eth.getGasPrice().then(function (result) {

            //build transaction object
            var txObject = {
                nonce: web3.utils.toHex(txCount),
                from: from,
                to: to,
                value: web3.utils.toHex(web3.utils.toWei(req.params.amount, 'ether')),
                gasLimit: web3.utils.toHex(21000),
                // gas: 5000000,
                // gasPrice: web3.utils.toHex(web3.utils.toWei(web3.utils.fromWei(result, 'gwei'), 'gwei')),
                gasPrice: web3.utils.toHex(result),//the result is in wei so no web3.utils.toWei needed
                // chainID:  web3.utils.toHex(56)
                //chain:    'mainnet'
            }


            web3.eth.accounts.signTransaction(txObject, privateKey, (err, signed) => {
                if (err) {
                    res.send('failed');
                } else {
                    // res.send(signed);
                    // console.log(signed.rawTransaction);

                    // Broadcast the transaction
                    web3.eth.sendSignedTransaction(signed.rawTransaction, (err, txHash) => {
                        if (err) {
                            res.send('failed');
                        }
                        else {
                            res.send(txHash);
                        }
                    });


                }
            })

        }).catch(function (err) {
            res.send('failed');
        })
    });


})



app.get('/send-token/:amount/:to', function (req, res) {

    var dat = require('./contracts/workToken');

    
    var from = process.env.YOUR_WALLET_ADDRESS;

    var privateKey = process.env.YOUR_WALLET_ADDRESS_PRIVATE_KEY;
    
    var to = req.params.to;

    if (privateKey.startsWith("0x") && privateKey.length == 66) {
        privateKey = privateKey.substring(2);
    }

    var contract = new web3.eth.Contract(dat.abi, dat.address);

    //to get the nounce i.e the number of total transactions by the sender
    web3.eth.getTransactionCount(from, (err, txCount) => {
        if (err) { //if(err) throw err;
            res.send('failed');
        }

        //Auto get gas price
        web3.eth.getGasPrice().then(function (result) {

            var txObject = {
                from: from,
                nonce: web3.utils.toHex(txCount),
                // gas: 5000000,
                gasLimit: web3.utils.toHex(80000), // Raise the gas limit to a much higher amount
                // gasPrice: web3.utils.toHex(web3.utils.toWei(web3.utils.fromWei(result, 'gwei'), 'gwei')),
                gasPrice: web3.utils.toHex(result),//the result is in wei so no web3.utils.toWei needed
                to: dat.address,
                //add the decimal number of zeros
                data: contract.methods.transfer(to, web3.utils.toWei(req.params.amount, dat.decimal_rept)).encodeABI(),
                // chainID: web3.utils.toHex(1)
            }

            web3.eth.accounts.signTransaction(txObject, privateKey, (err, signed) => {
                if (err) { //if(err) throw err;
                    res.send('failed');
                } else {
                    // res.send(signed);
                    // console.log(signed.rawTransaction);

                    // Broadcast the transaction
                    web3.eth.sendSignedTransaction(signed.rawTransaction, (err, txHash) => {
                        if (err) { //if(err) throw err;
                            res.send('failed');
                        }
                        else {
                            res.send(txHash);
                        }
                    });


                }
            })

        }).catch(function (err) {
            res.send('failed');
        })

    });



})



// ####################################################################
// Frontend Bank
// ####################################################################

app.get('/get-bank-token-balance/:address', function (req, res) {

    //using js file
    let dat = require('./contracts/frontendBank');

    let contract = new web3.eth.Contract(dat.abi, dat.address);

    contract.methods.TokenBalance(req.params.address).call().then(function (result) {

        convertedBalance = web3.utils.fromWei(result, 'ether');

        let res_json = {
            "address": req.params.address,
            "balance": convertedBalance,
            "wei_balance": result
        };

        res.send(res_json);

    }).catch(function (err) {
        res.send('failed');
    })
})

app.get('/get-bank-eth-balance/:address', function (req, res) {

    let dat = require('./contracts/frontendBank');

    let contract = new web3.eth.Contract(dat.abi, dat.address);

    contract.methods.ETHbalance(req.params.address).call().then(function (result) {

        convertedBalance = web3.utils.fromWei(result, 'ether');

        let res_json = {
            "address": req.params.address,
            "balance": convertedBalance,
            "wei_balance": result
        };

        res.send(res_json);

    }).catch(function (err) {
        res.send('failed');
    })
})



app.get('/deposit-eth/:amount', function (req, res) {

    //using js file
    var dat = require('./contracts/frontendBank');

    
    var from = process.env.YOUR_WALLET_ADDRESS;

    var privateKey = process.env.YOUR_WALLET_ADDRESS_PRIVATE_KEY;
    
    if (privateKey.startsWith("0x") && privateKey.length == 66) {
        privateKey = privateKey.substring(2);
    }

    var contract = new web3.eth.Contract(dat.abi, dat.address);

    web3.eth.getTransactionCount(from, (err, txCount) => {
        if (err) {
            res.send('failed');
        }

        //Auto get gas price
        web3.eth.getGasPrice().then(function (result) {

            var txObject = {
                from: from,
                nonce: web3.utils.toHex(txCount),
                gasLimit: web3.utils.toHex(80000),
                gasPrice: web3.utils.toHex(result),
                to: dat.address,
                value: web3.utils.toHex(web3.utils.toWei(req.params.amount, 'ether')),
                data: contract.methods.depositETH().encodeABI(),
            }

            web3.eth.accounts.signTransaction(txObject, privateKey, (err, signed) => {
                if (err) {
                    res.send('failed');
                } else {

                    // Broadcast the transaction
                    web3.eth.sendSignedTransaction(signed.rawTransaction, (err, txHash) => {
                        if (err) {
                            res.send('failed');
                        }
                        else {
                            res.send(txHash);
                        }
                    });


                }
            })

        }).catch(function (err) {
            res.send('failed');
        })

    });



})



app.get('/deposit-token/:amount', function (req, res) {

    //using js file
    var dat = require('./contracts/frontendBank');

    
    var from = process.env.YOUR_WALLET_ADDRESS;

    var privateKey = process.env.YOUR_WALLET_ADDRESS_PRIVATE_KEY;
    
    if (privateKey.startsWith("0x") && privateKey.length == 66) {
        privateKey = privateKey.substring(2);
    }

    var contract = new web3.eth.Contract(dat.abi, dat.address);

    web3.eth.getTransactionCount(from, (err, txCount) => {
        if (err) {
            res.send('failed');
        }

        web3.eth.getGasPrice().then(function (result) {

            var txObject = {
                from: from,
                nonce: web3.utils.toHex(txCount),
                gasLimit: web3.utils.toHex(80000),
                gasPrice: web3.utils.toHex(result),
                to: dat.address,
                data: contract.methods.depositToken(web3.utils.toWei(req.params.amount, 'ether')).encodeABI(),
            }

            web3.eth.accounts.signTransaction(txObject, privateKey, (err, signed) => {
                if (err) {
                    res.send('failed');
                } else {

                    // Broadcast the transaction
                    web3.eth.sendSignedTransaction(signed.rawTransaction, (err, txHash) => {
                        if (err) {
                            res.send('failed');
                        }
                        else {
                            res.send(txHash);
                        }
                    });


                }
            })

        }).catch(function (err) {
            res.send('failed');
        })

    });



})



app.get('/withdraw-eth/:amount', function (req, res) {

    //using js file
    var dat = require('./contracts/frontendBank');

    
    var from = process.env.YOUR_WALLET_ADDRESS;

    var privateKey = process.env.YOUR_WALLET_ADDRESS_PRIVATE_KEY;
    
    if (privateKey.startsWith("0x") && privateKey.length == 66) {
        privateKey = privateKey.substring(2);
    }

    var contract = new web3.eth.Contract(dat.abi, dat.address);

    web3.eth.getTransactionCount(from, (err, txCount) => {
        if (err) {
            res.send('failed');
        }

        web3.eth.getGasPrice().then(function (result) {

            var txObject = {
                from: from,
                nonce: web3.utils.toHex(txCount),
                gasLimit: web3.utils.toHex(80000),
                gasPrice: web3.utils.toHex(result),
                to: dat.address,
                data: contract.methods.withdrawETH(web3.utils.toWei(req.params.amount, 'ether')).encodeABI(),
            }

            web3.eth.accounts.signTransaction(txObject, privateKey, (err, signed) => {
                if (err) {
                    res.send('failed');
                } else {

                    // Broadcast the transaction
                    web3.eth.sendSignedTransaction(signed.rawTransaction, (err, txHash) => {
                        if (err) {
                            res.send('failed');
                        }
                        else {
                            res.send(txHash);
                        }
                    });


                }
            })

        }).catch(function (err) {
            res.send('failed');
        })

    });



})



app.get('/withdraw-token/:amount', function (req, res) {

    //using js file
    var dat = require('./contracts/frontendBank');

    
    var from = process.env.YOUR_WALLET_ADDRESS;

    var privateKey = process.env.YOUR_WALLET_ADDRESS_PRIVATE_KEY;
    
    if (privateKey.startsWith("0x") && privateKey.length == 66) {
        privateKey = privateKey.substring(2);
    }

    var contract = new web3.eth.Contract(dat.abi, dat.address);

    web3.eth.getTransactionCount(from, (err, txCount) => {
        if (err) {
            res.send('failed');
        }

        web3.eth.getGasPrice().then(function (result) {

            var txObject = {
                from: from,
                nonce: web3.utils.toHex(txCount),
                gasLimit: web3.utils.toHex(80000),
                gasPrice: web3.utils.toHex(result),
                to: dat.address,
                data: contract.methods.withdrawToken(web3.utils.toWei(req.params.amount, 'ether')).encodeABI(),
            }

            web3.eth.accounts.signTransaction(txObject, privateKey, (err, signed) => {
                if (err) {
                    res.send('failed');
                } else {

                    // Broadcast the transaction
                    web3.eth.sendSignedTransaction(signed.rawTransaction, (err, txHash) => {
                        if (err) {
                            res.send('failed');
                        }
                        else {
                            res.send(txHash);
                        }
                    });


                }
            })

        }).catch(function (err) {
            res.send('failed');
        })

    });



})



app.get('/credit-eth-balance/:address/:amount', function (req, res) {

    //using js file
    var dat = require('./contracts/frontendBank');

    
    var from = process.env.YOUR_WALLET_ADDRESS;

    var privateKey = process.env.YOUR_WALLET_ADDRESS_PRIVATE_KEY;

    var address = req.params.address;
    
    if (privateKey.startsWith("0x") && privateKey.length == 66) {
        privateKey = privateKey.substring(2);
    }

    var contract = new web3.eth.Contract(dat.abi, dat.address);

    web3.eth.getTransactionCount(from, (err, txCount) => {
        if (err) {
            res.send('failed');
        }

        web3.eth.getGasPrice().then(function (result) {

            var txObject = {
                from: from,
                nonce: web3.utils.toHex(txCount),
                gasLimit: web3.utils.toHex(80000),
                gasPrice: web3.utils.toHex(result),
                to: dat.address,
                data: contract.methods.creditETHAccount(address, web3.utils.toWei(req.params.amount, 'ether')).encodeABI(),
            }

            web3.eth.accounts.signTransaction(txObject, privateKey, (err, signed) => {
                if (err) {
                    res.send('failed');
                } else {

                    // Broadcast the transaction
                    web3.eth.sendSignedTransaction(signed.rawTransaction, (err, txHash) => {
                        if (err) {
                            res.send('failed');
                        }
                        else {
                            res.send(txHash);
                        }
                    });


                }
            })

        }).catch(function (err) {
            res.send('failed');
        })

    });



})



app.get('/credit-token-balance/:address/:amount', function (req, res) {

    //using js file
    var dat = require('./contracts/frontendBank');

    
    var from = process.env.YOUR_WALLET_ADDRESS;

    var privateKey = process.env.YOUR_WALLET_ADDRESS_PRIVATE_KEY;

    var address = req.params.address;
    
    if (privateKey.startsWith("0x") && privateKey.length == 66) {
        privateKey = privateKey.substring(2);
    }

    var contract = new web3.eth.Contract(dat.abi, dat.address);

    web3.eth.getTransactionCount(from, (err, txCount) => {
        if (err) {
            res.send('failed');
        }

        web3.eth.getGasPrice().then(function (result) {

            var txObject = {
                from: from,
                nonce: web3.utils.toHex(txCount),
                gasLimit: web3.utils.toHex(80000),
                gasPrice: web3.utils.toHex(result),
                to: dat.address,
                data: contract.methods.creditTokenAccount(address, web3.utils.toWei(req.params.amount, 'ether')).encodeABI(),
            }

            web3.eth.accounts.signTransaction(txObject, privateKey, (err, signed) => {
                if (err) {
                    res.send('failed');
                } else {

                    // Broadcast the transaction
                    web3.eth.sendSignedTransaction(signed.rawTransaction, (err, txHash) => {
                        if (err) {
                            res.send('failed');
                        }
                        else {
                            res.send(txHash);
                        }
                    });


                }
            })

        }).catch(function (err) {
            res.send('failed');
        })

    });



})









app.listen(3000, function () {
    console.log('App Started !!!');
});