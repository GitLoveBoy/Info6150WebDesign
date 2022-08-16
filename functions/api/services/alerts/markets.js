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
  }) || [], ['rank', 'price_change_percentage_24h_in_currency_abs', 'price_change_percentage_1h_in_currency_abs'], ['asc', 'desc', 'desc']);
  const aths = _market_caps.filter(d => now.diff(moment(d?.ath_date), 'hours', true) <= 1);
  const atls = _market_caps.filter(d => now.diff(moment(d?.atl_date), 'hours', true) <= 1);

  const twitter = [], telegram = [];
  if (Number(now.minutes()) === 0) {
    if (Number(now.hours()) % 4 === 0) {
      const data = market_caps.find(d => d.id === 'bitcoin');
      if (data) {
        const { id, symbol, name, current_price, price_change_percentage_24h_in_currency } = { ...data };
        twitter.push(`Today's 👑🟠 #${name} price is ${currency_symbol}${number_format(current_price, `0,0${current_price >= 100 ? '' : current_price >= 1 ? '.00' : '.00000000'}`)} ${number_format(price_change_percentage_24h_in_currency / 100, '+0,0.00%')} from yesterday.\n${website}/token/${id}\n\n$${symbol?.toUpperCase()} #Cryptocurrency`);
        telegram.push(`Today's 👑🟠 <a href="${website}/token/${id}">${symbol ? symbol.toUpperCase() : name}</a> price <b>${currency_symbol}${number_format(current_price, `0,0${current_price >= 100 ? '' : current_price >= 1 ? '.00' : '.00000000'}`)}</b> <pre>${number_format(price_change_percentage_24h_in_currency / 100, '+0,0.00%')}</pre>`);
      }
    }
    else if (aths.length > 0 || atls.length > 0) {
      if (aths.length > 0) {
        const data = _.slice(aths, 0, 3).map(d => {
          return {
            ...d,
            value: _.max([d.ath, d.current_price, d.high_24h].filter(v => typeof v === 'number')),
          };
        });
        let twitter_message = '', telegram_message = '';
        data.forEach((d, i) => {
          const { id, symbol, name, value } = { ...d };
          twitter_message += `${i > 0 ? '\n' : ''}${symbol ? `$${symbol.toUpperCase()}` : name} hits a new ATH at ${currency_symbol}${number_format(value, `0,0${value >= 100 ? '' : value >= 1 ? '.00' : '.00000000'}`)}. 🚀🌙`;
          telegram_message += `${i === 0 ? '🛸🌙 ALL TIME HIGH' : ''}\n`;
          telegram_message += `<a href="${website}/token/${id}">${symbol ? symbol.toUpperCase() : name}</a> <pre>${currency_symbol}${number_format(value, `0,0${value >= 100 ? '' : value >= 1 ? '.00' : '.00000000'}`)}</pre>`;
        });
        twitter_message += data.length === 1 ? data.map(d => `\n${website}/token/${d.id}`) : '';
        twitter_message += `\n\n${data.map(d => `${d.name ? `#${d.name.split(' ').filter(c => c).join('')}` : ''}`).join(' ')} #Cryptocurrency`;
        twitter.push(twitter_message);
        telegram.push(telegram_message);
      }
      else {
        const data = _.slice(atls, 0, 3).map(d => {
          return {
            ...d,
            value: _.max([d.atl, d.current_price, d.low_24h].filter(v => typeof v === 'number')),
          };
        });
        let twitter_message = '', telegram_message = '';
        data.forEach((d, i) => {
          const { id, symbol, name, value } = { ...d };
          twitter_message += `${i > 0 ? '\n' : ''}${symbol ? `$${symbol.toUpperCase()}` : name} made a new ATL at ${currency_symbol}${number_format(value, `0,0${value >= 100 ? '' : value >= 1 ? '.00' : '.00000000'}`)}. 😢🚨`;
          telegram_message += `${i === 0 ? '🧸 ALL TIME LOW' : ''}\n`;
          telegram_message += `<a href="${website}/token/${id}">${symbol ? symbol.toUpperCase() : name}</a> <pre>${currency_symbol}${number_format(value, `0,0${value >= 100 ? '' : value >= 1 ? '.00' : '.00000000'}`)}</pre>`;
        });
        twitter_message += data.length === 1 ? data.map(d => `\n${website}/token/${d.id}`) : '';
        twitter_message += `\n\n${data.map(d => `${d.name ? `#${d.name.split(' ').filter(c => c).join('')}` : ''}`).join(' ')} #Cryptocurrency`;
        twitter.push(twitter_message);
        telegram.push(telegram_message);
      }
    }
    else {
      const i = Math.floor(Math.random() * 7);
      if (i < 1) {
        const data = _.slice(_market_caps.filter(d => d.price_change_percentage_24h_in_currency_abs >= 5), 0, 3);
        if (data.length > 0) {
          let twitter_message = '', telegram_message = '';
          data.forEach((d, i) => {
            const { id, symbol, name, current_price, price_change_percentage_24h_in_currency } = { ...d };
            twitter_message += `${i === 0 ? `Let's check on the Top${data.length > 1 ? ` ${data.length}` : ''} % Changes 🌪` : ''}\n`;
            twitter_message += `${symbol ? `$${symbol.toUpperCase()}` : name} ${currency_symbol}${number_format(current_price, `0,0${current_price >= 100 ? '' : current_price >= 1 ? '.00' : '.00000000'}`)} ${number_format(price_change_percentage_24h_in_currency / 100, '+0,0.00%')}`;
            telegram_message += `${i === 0 ? `<a href="${website}/tokens">🌪 High % Change</a>` : ''}\n`;
            telegram_message += `<a href="${website}/token/${id}">${symbol ? symbol.toUpperCase() : name}</a> <b>${currency_symbol}${number_format(current_price, `0,0${current_price >= 100 ? '' : current_price >= 1 ? '.00' : '.00000000'}`)}</b> <pre>${number_format(price_change_percentage_24h_in_currency / 100, '+0,0.00%')}</pre>`;
          });
          twitter_message += data.length === 1 ? data.map(d => `\n${website}/token/${d.id}`) : `\n${website}/tokens`;
          twitter_message += `\n\n💙 if you HODL any one of them\n\n${data.map(d => `${d.name ? `#${d.name.split(' ').filter(c => c).join('')}` : ''}`).join(' ')} `;
          twitter.push(twitter_message);
          telegram.push(telegram_message);
        }
       }
      else if (i < 2) {
        const data = _.slice(volume_per_market_caps, 0, 3);
        if (data.length > 0) {
          let twitter_message = '', telegram_message = '';
          data.forEach((d, i) => {
            const { id, symbol, name, current_price, price_change_percentage_24h_in_currency, volume_per_market_cap } = { ...d };
            twitter_message += `${i === 0 ? `Let's check on the Top${data.length > 1 ? ` ${data.length}` : ''} Volume / Market Cap 🌊` : ''}\n`;
            twitter_message += `${symbol ? `$${symbol.toUpperCase()}` : name} ${currency_symbol}${number_format(current_price, `0,0${current_price >= 100 ? '' : current_price >= 1 ? '.00' : '.00000000'}`)} ${number_format(price_change_percentage_24h_in_currency / 100, '+0,0.00%')}`;
            telegram_message += `${i === 0 ? `<a href="${website}/tokens">🌊 High Volume / Market Cap</a>` : ''}\n`;
            telegram_message += `<a href="${website}/token/${id}">${symbol ? symbol.toUpperCase() : name}</a> <b>${currency_symbol}${number_format(current_price, `0,0${current_price >= 100 ? '' : current_price >= 1 ? '.00' : '.00000000'}`)}</b> <pre>${number_format(price_change_percentage_24h_in_currency / 100, '+0,0.00%')}</pre>\n<b>Vol/MCap: ${number_format(volume_per_market_cap, '0,0.0000')}</b>`;
          });
          twitter_message += data.length === 1 ? data.map(d => `\n${website}/token/${d.id}`) : `\n${website}/tokens`;
          twitter_message += `\n\n💙 if you HODL any one of them\n\n${data.map(d => `${d.name ? `#${d.name.split(' ').filter(c => c).join('')}` : ''}`).join(' ')} `;
          twitter.push(twitter_message);
          telegram.push(telegram_message);
        }
      }
      else if (i < 3) {
        const data = _.slice(top_gainers, 0, 3);
        if (data.length > 0) {
          let twitter_message = '', telegram_message = '';
          data.forEach((d, i) => {
            const { id, symbol, name, current_price, price_change_percentage_24h_in_currency } = { ...d };
            twitter_message += `${i === 0 ? `Today's Top Gainers 🏅` : ''}\n`;
            twitter_message += `${symbol ? `$${symbol.toUpperCase()}` : name} ${currency_symbol}${number_format(current_price, `0,0${current_price >= 100 ? '' : current_price >= 1 ? '.00' : '.00000000'}`)} ${number_format(price_change_percentage_24h_in_currency / 100, '+0,0.00%')}`;
            telegram_message += `${i === 0 ? `<a href="${website}">🥇🥈🥉 Top Gainers</a>` : ''}\n`;
            telegram_message += `<a href="${website}/token/${id}">${symbol ? symbol.toUpperCase() : name}</a> <b>${currency_symbol}${number_format(current_price, `0,0${current_price >= 100 ? '' : current_price >= 1 ? '.00' : '.00000000'}`)}</b> <pre>${number_format(price_change_percentage_24h_in_currency / 100, '+0,0.00%')}</pre>`;
          });
          twitter_message += data.length === 1 ? data.map(d => `\n${website}/token/${d.id}`) : `\n${website}/tokens`;
          twitter_message += `\n\n💙 if you HODL any one of them\n\n${data.map(d => `${d.name ? `#${d.name.split(' ').filter(c => c).join('')}` : ''}`).join(' ')} `;
          twitter.push(twitter_message);
          telegram.push(telegram_message);
        }
      }
      else if (i < 4) {
        const data = _.slice(top_losers, 0, 3);
        if (data.length > 0) {
          let twitter_message = '', telegram_message = '';
          data.forEach((d, i) => {
            const { id, symbol, name, current_price, price_change_percentage_24h_in_currency } = { ...d };
            twitter_message += `${i === 0 ? `Today's Top Losers ⚰️` : ''}\n`;
            twitter_message += `${symbol ? `$${symbol.toUpperCase()}` : name} ${currency_symbol}${number_format(current_price, `0,0${current_price >= 100 ? '' : current_price >= 1 ? '.00' : '.00000000'}`)} ${number_format(price_change_percentage_24h_in_currency / 100, '+0,0.00%')}`;
            telegram_message += `${i === 0 ? `<a href="${website}">⚰️ Top Losers</a>` : ''}\n`;
            telegram_message += `<a href="${website}/token/${id}">${symbol ? symbol.toUpperCase() : name}</a> <b>${currency_symbol}${number_format(current_price, `0,0${current_price >= 100 ? '' : current_price >= 1 ? '.00' : '.00000000'}`)}</b> <pre>${number_format(price_change_percentage_24h_in_currency / 100, '+0,0.00%')}</pre>`;
          });
          twitter_message += data.length === 1 ? data.map(d => `\n${website}/token/${d.id}`) : `\n${website}/tokens`;
          twitter_message += `\n\n${data.map(d => `${d.name ? `#${d.name.split(' ').filter(c => c).join('')}` : ''}`).join(' ')} `;
          twitter.push(twitter_message);
          telegram.push(telegram_message);
        }
      }
      else if (i < 5) {
        const data = _.slice(_defis, 0, 3);
        if (data.length > 0) {
          let twitter_message = '', telegram_message = '';
          data.forEach((d, i) => {
            const { id, symbol, name, current_price, price_change_percentage_24h_in_currency } = { ...d };
            t