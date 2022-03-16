const backendUrlConstant = process.env.REACT_APP_CHAINACCOUNT_API || "http://localhost:4001";

const ETHAddressBank = "0x03F04fDa3B6E6FA1783A5EDB810155e5F4dD5461";
const DECIMALS = 2;

const ganacheUrl = "http://localhost:7545";
const contractAddressOnGanache = "0x471184AE3a9632a3a65d846f961b3a4b8A9e416A";
const contractAddressOnRinkeby = "0x511103EE939859971B00F240c7865e1885EbC825";
const alchemyRinkebyUrl =
  "https://eth-rinkeby.alchemyapi.io/v2/7eJSSFxEImk4KkiEgIqx92i5r29HLEUK";

const providerUrl = process.env.REACT_APP_ALCHEMY_RINKEBY_URL || ganacheUrl;

chainAccountContractAddress = process.env.REACT_APP_CONTRACT_ADDRESS_ON_RINKEBY || contractAddressOnGanache;

const wssBackendUrl = process.env.REACT_APP_WSS_URI || "ws://localhost:4001";

module.exports = {
  backendUrlConstant,
  chainAccountContractAddress,
  providerUrl,
  ETHAddressBank,
  DECIMALS,
  wssBackendUrl,
};
