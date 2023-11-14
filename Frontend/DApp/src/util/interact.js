// #################################################################
// GET Functions
// #################################################################

//load Token Ticker
export const loadTokenTicker = async (wrkContract) => {
    const result = await wrkContract.methods.symbol().call();
    return result;
};

//load ETH Balance
export const loadEthBalance = async (library, account) => {
    const result = await library.eth.getBalance(account);
    return library.utils.fromWei(result, 'ether');
};

//load Token Balance
export const loadTokenBalance = async (library, wrkContract, account) => {
    const result = await wrkContract.methods.balanceOf(account).call();
    return library.utils.fromWei(result, 'ether');
};

//load Eth Deposit Balance
export const loadEthDepositBalance = async (library, bankContract, account) => {
    const result = await bankContract.methods.ETHbalance(account).call();
    return library.utils.fromWei(result, 'ether');
};

//load Token Deposit Balance
export const loadTokenDepositBalance = async (library, bankContract, account) => {
    const result = await bankContract.methods.TokenBalance(account).call();
    return library.utils.fromWei(result, 'ether');
};

//load Token Allowance
export const loadTokenAllowance = async (library, wrkContract, account, bankContractAddress) => {
    const balance = await wrkContract.methods.allowance(account, bankContractAddress).call();
    return library.utils.fromWei(balance, 'ether')
};
// #################################################################






// #################################################################
// SET Functions
// #################################################################

// load Send Eth
export const loadSendEth = async (library, senderAddress, recipientAddress, amountEth) => {
    if (!amountEth || amountEth <= 0) {
        return {
            status: "Please enter a valid amount to transfer.",
        };
    }

    // Set up transaction parameters
    const transactionParameters = {
        from: senderAddress,
        to: recipientAddress,
        value: library.utils.toHex(library.utils.toWei(String(amountEth), 'ether'))
    };

    // Sign and send the transaction
    try {
        const txHash = await library.eth.sendTransaction(transactionParameters);
        return {
            status: (
                `✅ Transfer Successful. Tx Hash - ${txHash.transactionHash}`
            ),
            smUpdate: (`Smart Contract Updated ${txHash.transactionHash}`)
        };
    } catch (error) {
        return {
            status: error.message,
        };
    }
};



//load Send Tokens
export const loadSendTokens = async (library, senderAddress, wrkContractAddress, wrkContract, recipientAddress, amountToken) => {

    if (amountToken.toString().trim() === "" || amountToken <= 0) {
        return {
            status: "Please enter a valid amount to transfer.",
        };
    }

    //set up transaction parameters
    const transactionParameters = {
        to: wrkContractAddress,
        from: senderAddress,
        data: wrkContract.methods.transfer(recipientAddress, library.utils.toWei(String(amountToken), 'ether')).encodeABI(),
    };

    // sign the transaction
    try {
        const txHash = await library.eth.sendTransaction(transactionParameters);
        return {
            status: (
                `✅ Transfer Successful. Tx Hash - ${txHash.transactionHash}`
            ),
            smUpdate: (`Smart Contract Updated ${txHash.transactionHash}`)
        };
    } catch (error) {
        return {
            status: error.message,
        };
    }
};



// load Deposit Eth
export const loadDepositEth = async (library, bankContractAddress, bankContract, account, amountEth) => {

    if (amountEth.toString().trim() === "" || amountEth <= 0) {
        return {
            status: "Please enter a valid ETH amount to deposit.",
        };
    }

    //set up transaction parameters
    const transactionParameters = {
        to: bankContractAddress,
        from: account,
        value: library.utils.toHex(library.utils.toWei(String(amountEth), 'ether')),
        data: bankContract.methods.depositETH().encodeABI(),
    };

    // sign the transaction
    try {
        const txHash = await library.eth.sendTransaction(transactionParameters);
        return {
            status: (
                `✅ You have successfully Deposited ETH. Tx Hash - ${txHash.transactionHash}`
            ),
            smUpdate: (`Smart Contract Updated ${txHash.transactionHash}`)
        };
    } catch (error) {
        return {
            status: error.message,
        };
    }
};



// load Deposit Tokens
export const loadDepositTokens = async (library, bankContractAddress, bankContract, account, amountToken) => {

    if (amountToken.toString().trim() === "" || amountToken <= 0) {
        return {
            status: "Please enter a valid Token amount to deposit.",
        };
    }

    //set up transaction parameters
    const transactionParameters = {
        to: bankContractAddress,
        from: account,
        data: bankContract.methods.depositToken(library.utils.toWei(String(amountToken), 'ether')).encodeABI(),
    };

    // sign the transaction
    try {
        const txHash = await library.eth.sendTransaction(transactionParameters);
        return {
            status: (
                `✅ You have successfully Deposited Token. Tx Hash - ${txHash.transactionHash}`
            ),
            smUpdate: (`Smart Contract Updated ${txHash.transactionHash}`)
        };
    } catch (error) {
        return {
            status: error.message,
        };
    }
};



//load Approve Token Spending
export const loadApproveTokenSpending = async (
    library, wrkContract, wrkContractAddress, bankContractAddress, account, amountToken
) => {

    if (amountToken.toString().trim() === "" || amountToken <= 0) {
        return {
            status: "Please enter a valid Token amount to approve.",
        };
    }

    //set up transaction parameters
    const transactionParameters = {
        to: wrkContractAddress,
        from: account,
        data: wrkContract.methods.approve(bankContractAddress, library.utils.toWei(String(amountToken), 'ether')).encodeABI(),
    };

    // sign the transaction
    try {
        const txHash = await library.eth.sendTransaction(transactionParameters);
        return {
            status: (
                `✅ Approve Successful. Tx Hash - ${txHash.transactionHash}`
            ),
            smUpdate: (`Smart Contract Updated ${txHash.transactionHash}`)
        };
    } catch (error) {
        return {
            status: error.message,
        };
    }
};



//load Withdraw Eth
export const loadWithdrawEth = async (library, bankContractAddress, bankContract, account, amountEth) => {

    if (amountEth.toString().trim() === "" || amountEth <= 0) {
        return {
            status: "Please enter a valid ETH amount to withdraw.",
        };
    }

    //set up transaction parameters
    const transactionParameters = {
        to: bankContractAddress,
        from: account,
        data: bankContract.methods.withdrawETH(library.utils.toWei(String(amountEth), 'ether')).encodeABI(),
    };

    // sign the transaction
    try {
        const txHash = await library.eth.sendTransaction(transactionParameters);
        return {
            status: (
                `✅ ETH Withdrawal Successful. Tx Hash - ${txHash.transactionHash}`
            ),
            smUpdate: (`Smart Contract Updated ${txHash.transactionHash}`)
        };
    } catch (error) {
        return {
            status: error.message,
        };
    }
};



//load Withdraw Tokens
export const loadWithdrawTokens = async (library, bankContractAddress, bankContract, account, amountToken) => {

    if (amountToken.toString().trim() === "" || amountToken <= 0) {
        return {
            status: "Please enter a valid Token amount to withdraw.",
        };
    }

    //set up transaction parameters
    const transactionParameters = {
        to: bankContractAddress,
        from: account,
        data: bankContract.methods.withdrawToken(library.utils.toWei(String(amountToken), 'ether')).encodeABI(),
    };

    // sign the transaction
    try {
        const txHash = await library.eth.sendTransaction(transactionParameters);
        return {
            status: (
                `✅ Token Withdrawal Successful. Tx Hash - ${txHash.transactionHash}`
            ),
            smUpdate: (`Smart Contract Updated ${txHash.transactionHash}`)
        };
    } catch (error) {
        return {
            status: error.message,
        };
    }
};



//load Credit Eth Balance
export const loadCreditEthBalance = async (library, bankContractAddress, bankContract, account, accountToCredit, amountEth) => {

    if (amountEth.toString().trim() === "" || amountEth <= 0) {
        return {
            status: "Please enter a valid ETH amount to credit.",
        };
    }

    //set up transaction parameters
    const transactionParameters = {
        to: bankContractAddress,
        from: account,
        data: bankContract.methods.creditETHAccount(accountToCredit, library.utils.toWei(String(amountEth), 'ether')).encodeABI(),
    };

    // sign the transaction
    try {
        const txHash = await library.eth.sendTransaction(transactionParameters);
        return {
            status: (
                `✅ Account Credited with ETH Successfully. Tx Hash - ${txHash.transactionHash}`
            ),
            smUpdate: (`Smart Contract Updated ${txHash.transactionHash}`)
        };
    } catch (error) {
        return {
            status: error.message,
        };
    }
};



//load Credit Token Balance
export const loadCreditTokenBalance = async (library, bankContractAddress, bankContract, account, accountToCredit, amountToken) => {

    if (amountToken.toString().trim() === "" || amountToken <= 0) {
        return {
            status: "Please enter a valid Token amount to withdraw.",
        };
    }

    //set up transaction parameters
    const transactionParameters = {
        to: bankContractAddress,
        from: account,
        data: bankContract.methods.creditTokenAccount(accountToCredit, library.utils.toWei(String(amountToken), 'ether')).encodeABI(),
    };

    // sign the transaction
    try {
        const txHash = await library.eth.sendTransaction(transactionParameters);
        return {
            status: (
                `✅ Account Credited with Token Successfully. Tx Hash - ${txHash.transactionHash}`
            ),
            smUpdate: (`Smart Contract Updated ${txHash.transactionHash}`)
        };
    } catch (error) {
        return {
            status: error.message,
        };
    }
};

