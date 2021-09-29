// import module for http request
const axios = require('axios');
// import module for date time
const moment = require('moment');
// import lodash
const _ = require('lodash');
// import config
const config = require('config-yml');
// import currency
const { currency, currency_symbol } = require('../../utils/object/currency');
// import utils
const { number_format } = require('../../utils');

const times = ['1h','24h','7d','30d'];
const filter_outs = ['tether','usd-coin','binance-usd','dai','frax','true-usd','compound-usd-coin','paxos-standard','neutrino','huobi-btc','usdd','compound-ether','cdai','fei-usd','tether-eurt','flex-usd','alchemix-usd','gemini-dollar','husd','liquity-usd','iron-bank-euro','usdx','nusd','terrausd','seth2','celo-dollar','ageur','compound-basic-attention-token','usdk','musd','celo-euro','seth','instadapp-eth','compound-uniswap','compound-0x','sbtc','compound-chainlink-token','e-money-eur','spiceusd','compound-wrapped-btc','tbtc','seur','veusd','compound-maker','compound-sushi'];

module.exports = async () => {
  const now = moment();
  const { website } = { ...config };
  const { coinhippo } = { ...config?.api?.endpoints };
  const api = axios.create({ baseURL: coinhippo });
  let alerted, res;
  res = await api.get('', {
    params: {
      module: 'coingecko',
      path: '/coins/markets',
      vs_currency: currency,
      order: 'market_cap_desc',
      per_page: 250,
      price_change_percentage: times.join(','),
    },
  }).catch(error => { return { data: { error } }; });
  const market_caps = res?.data && !res.data.error && res.data.filter(d => !filter_outs.includes(d?.id));
  res = await api.get('', {
    params: {
      module: 'coingecko',
      path: '/coins/markets',
      vs_currency: currency,
      order: 'market_cap_desc',
      per_page: 250,
      price_change_percentage: times.join(','),
      category: 'decentralized-finance-defi',
    },
  }).catch(error => { return { data: { error } }; });
  const defis = res?.data && !res.data.error && res.data.filter(d => !filter_outs.includes(d?.id)