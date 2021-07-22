
// import module for http request
const axios = require('axios');
// import ethers.js
const { providers, utils } = require('ethers');
// import config
const config = require('config-yml');
// import utils
const { number_format } = require('../../utils');
// data
const { chains } = require('../../data');

module.exports = async () => {
  const { coinhippo } = { ...config?.api?.endpoints };
  const { gas_gwei_threshold } = { ...config?.alerts };
  const api = axios.create({ baseURL: coinhippo });
  const ethereum = chains?.mainnet?.evm?.find(c => c?.id === 'ethereum');
  const { rpcUrls } = { ...ethereum?.provider_params?.[0] };
  let alerted;
  if (rpcUrls?.length > 0) {