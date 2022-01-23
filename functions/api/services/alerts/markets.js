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
  const defis = res?.data && !res.data.error && res.data.filter(d => !filter_outs.includes(d?.id));
  res = await api.get('', {
    params: {
      module: 'coingecko',
      path: '/coins/markets',
      vs_currency: currency,
      order: 'market_cap_desc',
      per_page: 250,
      price_change_percentage: times.join(','),
      category: 'non-fungible-tokens-nft',
    },
  }).catch(error => { return { data: { error } }; });
  const nfts = res?.data && !res.data.error && res.data.filter(d => !filter_outs.includes(d?.id));
  res = await api.get('', {
    params: {
      module: 'coingecko',
      path: '/search/trending',
    },
  }).catch(error => { return { data: { error } }; });
  let trendings = res?.data && !res.data.error && res.data.coins;
  if (trendings?.length > 0) {
    res = await api.get('', {
      params: {
        module: 'coingecko',
        path: '/coins/markets',
        vs_currency: currency,
        order: 'market_cap_desc',
        per_page: 250,
        price_change_percentage: times.join(','),
        ids: trendings.map(c => c?.item?.id).join(','),
      },
    }).catch(error => { return { data: { error } }; });
    trendings = res?.data && !res.data.error ? trendings.map((t, i) => {
      return {
        ...t?.item,
        image: t?.thumb,
        rank: i + 1,
        ...res.data.find(d => d?.id === t?.id),
      };
    }) : trendings;
  }

  const top_gainers = _.orderBy(market_caps || [], ['price_change_percentage_24h_in_currency'], ['desc']);
  const top_losers = _.orderBy(market_caps || [], ['price_change_percentage_24h_in_currency'], ['asc']);
  const _market_caps = _.orderBy(market_caps?.filter(d => d?.market_cap_rank > 0 && d.market_cap_rank <= 100).map(d => {
    times.forEach(t => {
      d[`price_change_percentage_${t}_in_currency_abs`] = Math.abs(d[`price_change_percentage_${t}_in_currency`]);
    });
    return d;
  }) || [], ['price_change_percentage_24h_in_currency_abs', 'price_change_percentage_1h_in_currency_abs'], ['desc', 'desc']);
  const volume_per_market_caps = _.orderBy(market_caps?.filter(d => d?.total_volume && d.market_cap).map(d => {
    times.forEach(t => {
      d.volume_per_market_cap = d.total_volume / d.market_cap;
    });
    return d;
  }) || [], ['volume_per_market_cap'], ['desc']);
  const _defis = _.orderBy(defis?.map(d => {
    times.forEach(t => {
      d[`price_change_percentage_${t}_in_currency_abs`] = Math.abs(d[`price_change_percentage_${t}_in_currency`]);
    });
    return d;
  }) || [], ['market_cap_rank', 'price_change_percentage_24h_in_currency_abs', 'price_change_percentage_1h_in_currency_abs'], ['asc', 'desc', 'desc']);
  const _nfts = _.orderBy(nfts?.map(d => {
    times.forEach(t => {
      d[`price_change_percentage_${t}_in_currency_abs`] = Math.abs(d[`price_change_percentage_${t}_in_currency`]);
    });
    return d;
  }) || [], ['market_cap_rank', 'price_change_percentage_24h_in_currency_abs', 'price_change_percentage_1h_in_currency_abs'], ['asc', 'desc', 'desc']);
  const _trendings = _.orderBy(trendings?.filter(d => typeof d?.current_price === 'number').map(d => {
    times.forEach(t => {
      d[`price_change_percentage_${t}_in_currency_abs`] = Math.abs(d[`price_change_percentage_${t}_in_currency`]);
    });
    return d;
  }) || [], ['rank', 'price_change_percentage_24h_in_currency_abs', 'price_change_percentage_1h_in_currency_abs'], ['asc', 'de