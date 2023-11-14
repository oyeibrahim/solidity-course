import React from "react";
import { useEffect, useState } from "react";

// #################################################################
// Import from interact.js
// #################################################################
import {
  loadTokenTicker,
  loadEthBalance,
  loadTokenBalance,
  loadEthDepositBalance,
  loadTokenDepositBalance,
  loadTokenAllowance,
  loadSendEth,
  loadSendTokens,
  loadDepositEth,
  loadDepositTokens,
  loadApproveTokenSpending,
  loadWithdrawEth,
  loadWithdrawTokens,
  loadCreditEthBalance,
  loadCreditTokenBalance
} from "./util/interact.js";
// #################################################################


// #################################################################
// Alchemy base codes
// #################################################################
import {
  useWeb3React,
  UnsupportedChainIdError
} from "@web3-react/core";
import {
  NoEthereumProviderError,
  UserRejectedRequestError as UserRejectedRequestErrorInjected
} from "@web3-react/injected-connector";
import {
  URI_AVAILABLE,
  UserRejectedRequestError as UserRejectedRequestErrorWalletConnect
} from "@web3-react/walletconnect-connector";
import { UserRejectedRequestError as UserRejectedRequestErrorFrame } from "@web3-react/frame-connector";

import {
  injected,
  // network,
  walletconnect,
  // walletlink,
  // ledger,
  // trezor,
  // frame,
  // fortmatic,
  // portis,
  // squarelink,
  // torus,
  // authereum
} from "./connectors";
import { useEagerConnect, useInactiveListener } from "./hooks";

const connectorsByName = {
  Injected: injected,
  // Network: network,
  WalletConnect: walletconnect,
  // WalletLink: walletlink,
  // Ledger: ledger,
  // Trezor: trezor,
  // Frame: frame,
  // Fortmatic: fortmatic,
  // Portis: portis,
  // Squarelink: squarelink,
  // Torus: torus,
  // Authereum: authereum
};


function getErrorMessage(error) {

  if (error) {
    if (error instanceof NoEthereumProviderError) {
      return {
        status: "No BSC browser extension detected, install MetaMask on desktop or visit from a DApp browser on mobile.",
      };
    } else if (error instanceof UnsupportedChainIdError) {
      return {
        status: "You're connected to an unsupported network.",
      };
    } else if (
      error instanceof UserRejectedRequestErrorInjected ||
      error instanceof UserRejectedRequestErrorWalletConnect ||
      error instanceof UserRejectedRequestErrorFrame
    ) {
      return {
        status: "Please authorize this website to access your account.",
      };
    } else {
      return {
        status: "WalletConnect connection rejected by user.",
      };
    }
  } else {
    // console.error(error);
    return {
      status: "Welcome to the DApp for Frontend Bank Contract",
    };
  }
}
// #################################################################



const AppEngine = () => {

  // #################################################################
  // Alchemy base codes
  // #################################################################
  const context = useWeb3React();
  const {
    connector,
    library,
    chainId,
    account,
    activate,
    deactivate,
    active,
    error
  } = context;

  // handle logic to recognize the connector currently being activated
  const [activatingConnector, setActivatingConnector] = useState();
  useEffect(() => {
    if (activatingConnector && activatingConnector === connector) {
      setActivatingConnector(undefined);
    }
  }, [activatingConnector, connector]);

  // handle logic to eagerly connect to the injected ethereum provider, if it exists and has granted access already
  const triedEager = useEagerConnect();

  // handle logic to connect in reaction to certain events on the injected ethereum provider, if it exists
  useInactiveListener(!triedEager || !!activatingConnector);
  // #################################################################







  // ############################################################################
  // Contract Intance, State variables, Function implementations and useEFfects
  // ############################################################################

  const WRK_CONTRACT_ABI = require("./contracts/wrk-contract-abi.json");
  const WRK_CONTRACT_ADDRESS = "0xD9C3016ed1f387335ff2fE4FcAF04122F168D15d";

  const BANK_CONTRACT_ABI = require("./contracts/bank-contract-abi.json");
  const BANK_CONTRACT_ADDRESS = "0x72CA9c6be9a1803b8c7CF3511B1953A474147Fae";





  //state variables
  const [status, setStatus] = useState("Welcome to the DApp for Frontend Bank Contract");

  //for tracking smart contract update
  const [smUpdate, setSmUpdate] = useState("");
  const [spinner, setSpinner] = useState(false);

  const [tokenTicker, setTokenTicker] = useState("");
  const [ethBalance, setEthBalance] = useState(0);
  const [tokenBalance, setTokenBalance] = useState(0);
  const [ethDepositBalance, setEthDepositBalance] = useState(0);
  const [tokenDepositBalance, setTokenDepositBalance] = useState(0);
  const [sendEthAddress, setSendEthAddress] = useState("");
  const [sendEthAmount, setSendEthAmount] = useState("");
  const [sendTokenAddress, setSendTokenAddress] = useState("");
  const [sendTokenAmount, setSendTokenAmount] = useState("");
  const [depositEthAmount, setDepositEthAmount] = useState("");
  const [depositTokenAmount, setDepositTokenAmount] = useState("");
  const [tokenAllowance, setTokenAllowance] = useState("");
  const [withdrawEthAmount, setWithdrawEthAmount] = useState("");
  const [withdrawTokenAmount, setWithdrawTokenAmount] = useState("");
  const [creditEthAddress, setCreditEthAddress] = useState("");
  const [creditEthAmount, setCreditEthAmount] = useState("");
  const [creditTokenAddress, setCreditTokenAddress] = useState("");
  const [creditTokenAmount, setCreditTokenAmount] = useState("");


  //connection dependent calls in conditional useEffect
  useEffect(() => {

    if (library) {

      /**
       * NOW library is the web3 instance
       * account is Connected User Address
       * NOW WRK_CONTRACT is the WORK token contract instance
       */

      // Initialise WRK contract
      var WRK_CONTRACT = new library.eth.Contract(
        WRK_CONTRACT_ABI,
        WRK_CONTRACT_ADDRESS
      );

      async function fetchTokenTicker() {
        const result = await loadTokenTicker(WRK_CONTRACT);
        setTokenTicker(result);
      }

      fetchTokenTicker();

    }

    if (error) {
      const { status } = getErrorMessage(error);
      setStatus(status);
    }

  }, [library, chainId]);


  // wallet dependent calls in conditional useEffect
  useEffect(() => {

    if (library && account) {

      /**
       * NOW library is the web3 instance
       * account is Connected User Address
       * NOW BANK_CONTRACT is the Bank contract instance
       * NOW WRK_CONTRACT is the WORK token contract instance
       */

      // Initialise Bank contract
      var BANK_CONTRACT = new library.eth.Contract(
        BANK_CONTRACT_ABI,
        BANK_CONTRACT_ADDRESS
      );
      // Initialise WRK contract
      var WRK_CONTRACT = new library.eth.Contract(
        WRK_CONTRACT_ABI,
        WRK_CONTRACT_ADDRESS
      );


      async function fetchEthBalance() {
        const result = await loadEthBalance(library, account);
        setEthBalance(parseFloat(result));
      }

      async function fetchTokenBalance() {
        const result = await loadTokenBalance(library, WRK_CONTRACT, account);
        setTokenBalance(parseFloat(result));
      }

      async function fetchEthDepositBalance() {
        const result = await loadEthDepositBalance(library, BANK_CONTRACT, account);
        setEthDepositBalance(parseFloat(result));
      }

      async function fetchTokenDepositBalance() {
        const result = await loadTokenDepositBalance(library, BANK_CONTRACT, account);
        setTokenDepositBalance(parseFloat(result));
      }

      async function fetchTokenAllowance() {
        const result = await loadTokenAllowance(library, WRK_CONTRACT, account, BANK_CONTRACT_ADDRESS);
        setTokenAllowance(parseFloat(result));
      }



      fetchEthBalance();
      fetchTokenBalance();
      fetchEthDepositBalance();
      fetchTokenDepositBalance();
      fetchTokenAllowance();


      if (error) {
        const { status } = getErrorMessage(error);
        setStatus(status);
      }
    }

  }, [library, account, chainId, smUpdate])



  // error dependent calls in conditional useEffect
  useEffect(() => {

    const { status } = getErrorMessage(error);
    setStatus(status);

  }, [error]);
  // #################################################################



  // #################################################################
  // Alchemy walletConnect base code
  // #################################################################
  // log the walletconnect URI
  React.useEffect(() => {
    const logURI = uri => {
      // console.log("WalletConnect URI", uri);
      console.log("WalletConnect URI Available");
    };
    walletconnect.on(URI_AVAILABLE, logURI);

    return () => {
      walletconnect.off(URI_AVAILABLE, logURI);
    };
  }, []);
  // #################################################################






  // #################################################################
  // Connect wallet buttons back code
  // #################################################################
  const metamaskConnectPressed = async () => { //TODO: implement
    setActivatingConnector(connectorsByName["Injected"]);
    activate(connectorsByName["Injected"]);
    // modalCloseButtonRef.current.click();
  };

  const walletconnectConnectPressed = async () => { //TODO: implement
    setActivatingConnector(connectorsByName["WalletConnect"]);
    activate(connectorsByName["WalletConnect"]);
    // modalCloseButtonRef.current.click();
  };

  const disconnectWalletPressed = async () => { //TODO: implement
    if (active || error) {
      if (connector !== walletconnect) {//Logging out Metamask
        deactivate();
      } else {//Logging out WalletConnect
        connector.close();
      }
    }
  };
  // #################################################################





  // #################################################################
  // SET buttons function implementation
  // #################################################################

  var notConnectedText = "You are not connected to the Blockchain, Please click the Connect Button";

  const onSendEthPressed = async () => {
    setSpinner(true)
    if (active && library && account) {

      const { status, smUpdate } = await loadSendEth(library, account, sendEthAddress, sendEthAmount);
      setStatus(status);
      setSmUpdate(smUpdate);
      setSendEthAmount(0);

      setSpinner(false)
    } else {
      setStatus(notConnectedText);
      setSpinner(false)
    }

  };
  const onSendTokenPressed = async () => {
    setSpinner(true)
    if (active && library && account) {

      var WRK_CONTRACT = new library.eth.Contract(
        WRK_CONTRACT_ABI,
        WRK_CONTRACT_ADDRESS
      );

      const { status, smUpdate } = await loadSendTokens(library, account, WRK_CONTRACT_ADDRESS, WRK_CONTRACT, sendTokenAddress, sendTokenAmount);
      setStatus(status);
      setSmUpdate(smUpdate);
      setSendTokenAmount(0);

      setSpinner(false)
    } else {
      setStatus(notConnectedText);
      setSpinner(false)
    }

  };
  const onDepositEthPressed = async () => {
    setSpinner(true)
    if (active && library && account) {

      var BANK_CONTRACT = new library.eth.Contract(
        BANK_CONTRACT_ABI,
        BANK_CONTRACT_ADDRESS
      );

      const { status, smUpdate } = await loadDepositEth(library, BANK_CONTRACT_ADDRESS, BANK_CONTRACT, account, depositEthAmount);
      setStatus(status);
      setSmUpdate(smUpdate);
      setDepositEthAmount(0);

      setSpinner(false)
    } else {
      setStatus(notConnectedText);
      setSpinner(false)
    }

  };

  const onDepositTokensPressed = async () => {
    setSpinner(true)
    if (active && library && account) {

      var BANK_CONTRACT = new library.eth.Contract(
        BANK_CONTRACT_ABI,
        BANK_CONTRACT_ADDRESS
      );

      const { status, smUpdate } = await loadDepositTokens(library, BANK_CONTRACT_ADDRESS, BANK_CONTRACT, account, depositTokenAmount);
      setStatus(status);
      setSmUpdate(smUpdate);
      setDepositTokenAmount(0);

      setSpinner(false)
    } else {
      setStatus(notConnectedText);
      setSpinner(false)
    }

  };

  const onApproveTokenSpendingPressed = async () => {
    setSpinner(true)
    if (active && library && account) {

      var WRK_CONTRACT = new library.eth.Contract(
        WRK_CONTRACT_ABI,
        WRK_CONTRACT_ADDRESS
      );

      const { status, smUpdate } = await loadApproveTokenSpending(library, WRK_CONTRACT, WRK_CONTRACT_ADDRESS, BANK_CONTRACT_ADDRESS, account, depositTokenAmount);
      setStatus(status);
      setSmUpdate(smUpdate);
      setTokenAllowance(parseFloat(depositTokenAmount));

      setSpinner(false)
    } else {
      setStatus(notConnectedText);
      setSpinner(false)
    }

  };

  const onWithdrawEthPressed = async () => {
    setSpinner(true)
    if (active && library && account) {

      var BANK_CONTRACT = new library.eth.Contract(
        BANK_CONTRACT_ABI,
        BANK_CONTRACT_ADDRESS
      );

      const { status, smUpdate } = await loadWithdrawEth(library, BANK_CONTRACT_ADDRESS, BANK_CONTRACT, account, withdrawEthAmount);
      setStatus(status);
      setSmUpdate(smUpdate);
      setWithdrawEthAmount(0);

      setSpinner(false)
    } else {
      setStatus(notConnectedText);
      setSpinner(false)
    }

  };
  const onWithdrawTokensPressed = async () => {
    setSpinner(true)
    if (active && library && account) {

      var BANK_CONTRACT = new library.eth.Contract(
        BANK_CONTRACT_ABI,
        BANK_CONTRACT_ADDRESS
      );

      const { status, smUpdate } = await loadWithdrawTokens(library, BANK_CONTRACT_ADDRESS, BANK_CONTRACT, account, withdrawTokenAmount);
      setStatus(status);
      setSmUpdate(smUpdate);
      setWithdrawTokenAmount(0);

      setSpinner(false)
    } else {
      setStatus(notConnectedText);
      setSpinner(false)
    }

  };


  const onCreditEthBalancePressed = async () => {
    setSpinner(true)
    if (active && library && account) {

      var BANK_CONTRACT = new library.eth.Contract(
        BANK_CONTRACT_ABI,
        BANK_CONTRACT_ADDRESS
      );

      const { status, smUpdate } = await loadCreditEthBalance(library, BANK_CONTRACT_ADDRESS, BANK_CONTRACT, account, creditEthAddress, creditEthAmount);
      setStatus(status);
      setSmUpdate(smUpdate);
      setCreditEthAmount(0);

      setSpinner(false)
    } else {
      setStatus(notConnectedText);
      setSpinner(false)
    }

  };
  const onCreditTokenBalancePressed = async () => {
    setSpinner(true)
    if (active && library && account) {

      var BANK_CONTRACT = new library.eth.Contract(
        BANK_CONTRACT_ABI,
        BANK_CONTRACT_ADDRESS
      );

      const { status, smUpdate } = await loadCreditTokenBalance(library, BANK_CONTRACT_ADDRESS, BANK_CONTRACT, account, creditTokenAddress, creditTokenAmount);
      setStatus(status);
      setSmUpdate(smUpdate);
      setCreditTokenAmount(0);

      setSpinner(false)
    } else {
      setStatus(notConnectedText);
      setSpinner(false)
    }

  };
  // #################################################################



  //the UI of our component
  return (

    <>




      <div className="container mt-5">
        <h2>Frontend Bank Dashboard</h2>
        <hr />
        {/* Wallet Connection */}
        <div className="row mb-3">
          <div className="col">

            {(!active) && (
              <>
                <button
                  id="MetaMaskButton"
                  onClick={metamaskConnectPressed}
                  className="btn btn-primary">
                  Connect Metamask Wallet
                </button>
                &nbsp;
                <button
                  id="WalletConnect"
                  onClick={walletconnectConnectPressed}
                  className="btn btn-primary">
                  Connect WalletConnect Wallet
                </button>
              </>
            )}

            {(active) && (
              <button
                id="logoutButton"
                onClick={disconnectWalletPressed}
                className="btn btn-secondary">
                Logout
              </button>
            )}
          </div>

          {(active && account && connector) &&
            <div className="col">
              <span id="connectedAccount" className="text-success font-weight-bold">Connected: {account}</span>
              <img
                id="walletImage"
                src={connector !== walletconnect ? "images/metamask.png" : "images/walletconnect.png"}
                alt=""
                style={{ height: '30px' }}
              />
            </div>
          }

        </div>


        <hr />

        {/* Status and Error Messages */}
        <div id="messageBox" className="alert"> <span className="font-weight-bold">Status:</span> {status}</div>


        <hr />


        {/* Balance Displays */}
        <div className="row mb-3">

          <div className="col">
            <label>Eth Balance:</label>
            <p id="ethBalance">{ethBalance} BNB</p>
          </div>

          <div className="col">
            <label>Token Balance:</label>
            <p id="tokenBalance">{tokenBalance} {tokenTicker}</p>
          </div>

          <div className="col">
            <label>Eth Deposit Balance:</label>
            <p id="ethDepositBalance">{ethDepositBalance} BNB</p>
          </div>

          <div className="col">
            <label>Token Deposit Balance:</label>
            <p id="tokenDepositBalance">{tokenDepositBalance} {tokenTicker}</p>
          </div>

        </div>


        <hr />


        {/* Action Forms */}
        <div className="row mb-3">
          <div className="col">

            <input type="text"
              className="form-control mb-2"
              placeholder="Address"
              onChange={(e) => setSendEthAddress(e.target.value)}
              value={sendEthAddress}
            />

            <input type="text"
              className="form-control mb-2"
              placeholder="Amount in ETH"
              onChange={(e) => setSendEthAmount(e.target.value)}
              value={sendEthAmount}
            />

            <button className="btn btn-primary"
              onClick={onSendEthPressed}
              disabled={spinner}
            >
              Send ETH
            </button>

          </div>

          <div className="col">

            <input type="text"
              className="form-control mb-2"
              placeholder="Address"
              onChange={(e) => setSendTokenAddress(e.target.value)}
              value={sendTokenAddress}
            />

            <input type="text"
              className="form-control mb-2"
              placeholder="Amount in Tokens"
              onChange={(e) => setSendTokenAmount(e.target.value)}
              value={sendTokenAmount}
            />

            <button className="btn btn-primary"
              onClick={onSendTokenPressed}
              disabled={spinner}
            >
              Send Tokens
            </button>

          </div>
        </div>


        <hr />


        <div className="row mb-3">

          <div className="col">

            <input type="text"
              className="form-control mb-2"
              placeholder="Amount in ETH to Deposit"
              onChange={(e) => setDepositEthAmount(e.target.value)}
              value={depositEthAmount}
            />

            <button className="btn btn-primary"
              onClick={onDepositEthPressed}
              disabled={spinner}
            >
              Deposit ETH
            </button>

          </div>

          <div className="col">

            <input type="text"
              className="form-control mb-2"
              placeholder="Amount in Tokens to Deposit"
              onChange={(e) => setDepositTokenAmount(e.target.value)}
              value={depositTokenAmount}
            />

            {(depositTokenAmount > 0 && tokenAllowance < depositTokenAmount) &&
              <button className="btn btn-primary mb-3 mb-md-0 mr-2"
                onClick={onApproveTokenSpendingPressed}
                disabled={spinner}
              >
                Approve Tokens For Deposit
              </button>
            }

            <button className="btn btn-primary"
              onClick={onDepositTokensPressed}
              disabled={spinner}
            >
              Deposit Tokens
            </button>

          </div>

        </div>


        <hr />


        <div className="row mb-3">

          <div className="col">

            <input type="text"
              className="form-control mb-2"
              placeholder="Amount of ETH to Withdraw"
              onChange={(e) => setWithdrawEthAmount(e.target.value)}
              value={withdrawEthAmount}
            />

            <button className="btn btn-warning"
              onClick={onWithdrawEthPressed}
              disabled={spinner}
            >
              Withdraw ETH
            </button>

          </div>

          <div className="col">

            <input type="text"
              className="form-control mb-2"
              placeholder="Amount of Tokens to Withdraw"
              onChange={(e) => setWithdrawTokenAmount(e.target.value)}
              value={withdrawTokenAmount}
            />

            <button className="btn btn-warning"
              onClick={onWithdrawTokensPressed}
              disabled={spinner}
            >
              Withdraw Tokens
            </button>

          </div>

        </div>


        <hr />


        <div className="row mb-3">

          <div className="col">

            <input type="text"
              className="form-control mb-2"
              placeholder="Address"
              onChange={(e) => setCreditEthAddress(e.target.value)}
              value={creditEthAddress}
            />

            <input type="text"
              className="form-control mb-2"
              placeholder="Amount in ETH"
              onChange={(e) => setCreditEthAmount(e.target.value)}
              value={creditEthAmount}
            />

            <button className="btn btn-secondary"
              onClick={onCreditEthBalancePressed}
              disabled={spinner}
            >
              Credit ETH Balance
            </button>

          </div>

          <div className="col">

            <input type="text"
              className="form-control mb-2"
              placeholder="Address"
              onChange={(e) => setCreditTokenAddress(e.target.value)}
              value={creditTokenAddress}
            />

            <input type="text"
              className="form-control mb-2"
              placeholder="Amount in Tokens"
              onChange={(e) => setCreditTokenAmount(e.target.value)}
              value={creditTokenAmount}
            />

            <button className="btn btn-secondary"
              onClick={onCreditTokenBalancePressed}
              disabled={spinner}
            >
              Credit Token Balance
            </button>

          </div>

        </div>


      </div>





    </>

  );
};

export default AppEngine;
