import { InjectedConnector } from "@web3-react/injected-connector";
import { NetworkConnector } from "@web3-react/network-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { WalletLinkConnector } from "@web3-react/walletlink-connector";
import { LedgerConnector } from "@web3-react/ledger-connector";
import { TrezorConnector } from "@web3-react/trezor-connector";
import { FrameConnector } from "@web3-react/frame-connector";
import { FortmaticConnector } from "@web3-react/fortmatic-connector";
import { PortisConnector } from "@web3-react/portis-connector";
import { SquarelinkConnector } from "@web3-react/squarelink-connector";
import { TorusConnector } from "@web3-react/torus-connector";
import { AuthereumConnector } from "@web3-react/authereum-connector";

const POLLING_INTERVAL = 12000;
const RPC_URLS = {
  56: "https://bsc-dataseed.binance.org/",//mainnet
  97: "https://data-seed-prebsc-1-s1.binance.org:8545/"//testnet
};

export const injected = new InjectedConnector({
  supportedChainIds: [56, 97]
  // supportedChainIds: [56]
});

export const network = new NetworkConnector({
  urls: { 56: RPC_URLS[56], 97: RPC_URLS[97] },
  // urls: { 56: RPC_URLS[56] },
  defaultChainId: 97,//TODO change the default
  pollingInterval: POLLING_INTERVAL
});

export const walletconnect = new WalletConnectConnector({
  rpc: { 97: RPC_URLS[97] },//TODO chain to mainnet
  // rpc: { 56: RPC_URLS[56] },
  bridge: "https://bridge.walletconnect.org",
  qrcode: true,
  pollingInterval: POLLING_INTERVAL
});

export const walletlink = new WalletLinkConnector({
  url: RPC_URLS[56],//TODO chain to mainnet
  appName: "web3-react example"
});

export const ledger = new LedgerConnector({
  chainId: 56,//TODO chain to mainnet
  url: RPC_URLS[56],//TODO chain to mainnet
  pollingInterval: POLLING_INTERVAL
});

export const trezor = new TrezorConnector({
  chainId: 56,//TODO chain to mainnet
  url: RPC_URLS[56],//TODO chain to mainnet
  pollingInterval: POLLING_INTERVAL,
  manifestEmail: "dummy@abc.xyz",
  manifestAppUrl: "https://8rg3h.csb.app/"
});

export const frame = new FrameConnector({ supportedChainIds: [1] });

export const fortmatic = new FortmaticConnector({
  apiKey: "pk_live_F95FEECB1BE324B5",
  chainId: 1 //TODO chain to mainnet
});

export const portis = new PortisConnector({
  dAppId: "211b48db-e8cc-4b68-82ad-bf781727ea9e",
  networks: [1, 100]
});

export const squarelink = new SquarelinkConnector({
  clientId: "5f2a2233db82b06b24f9",
  networks: [1, 100]
});

export const torus = new TorusConnector({ chainId: 56 });

export const authereum = new AuthereumConnector({ chainId: 56 });
