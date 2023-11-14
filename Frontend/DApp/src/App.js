import AppEngine from './AppEngine'
import { Web3ReactProvider } from "@web3-react/core";

var Web3 = require("web3");

function getLibrary(provider) {
  const library = new Web3(provider);
  library.pollingInterval = 8000;
  return library;
}


function App() {
  return (
    <Web3ReactProvider
      getLibrary={getLibrary}
    >
      <AppEngine></AppEngine>
    </Web3ReactProvider>
  );
}

export default App;
