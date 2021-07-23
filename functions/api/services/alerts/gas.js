
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
    const provider = new providers.FallbackProvider(rpcUrls.map(url => new providers.JsonRpcProvider(url)));
    try {
      const value = Number(utils.formatUnits(await provider.getGasPrice(), 'gwei'));
      if (value && value <= gas_gwei_threshold) {
        const twitter = [], telegram = [];
        twitter.push(`The ⛽ #ETH Gas Price (${number_format(value, '0,0')} Gwei) is ${value <= gas_gwei_threshold * 2 / 3 ? 'very low' : 'not high'}.\nMaybe it's time to #DeFi or #NFTs. 😁👍\n\n #EtherGas #Ethereum #Cryptocurrency`);
        telegram.push(`The ⛽ ETH Gas Price (<pre>${number_format(value, '0,0')} Gwei</pre>) is ${value <= gas_gwei_threshold * 2 / 3 ? 'very low' : 'not high'}.\nMaybe it's time to DeFi or NFTs. 😁👍`);
        if (twitter.length > 0 || telegram.length > 0) {
          const { socials } = { ...config };
          await api.post('', {
            module: 'broadcast',
            twitter: {
              messages: twitter,
              key: socials?.twitter?.api_key,
            },
            telegram: {
              messages: telegram,
              key: socials?.telegram?.key,
              parameters: {
                web_preview: true,
              },
            },
          }).catch(error => { return { data: { error } }; });
          alerted = true;
        }
      }
    } catch (error) {}
  }
  return alerted;
};