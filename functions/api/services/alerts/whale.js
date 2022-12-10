
// import module for http request
const axios = require('axios');
// import module for date time
const moment = require('moment');
// import lodash
const _ = require('lodash');
// import config
const config = require('config-yml');
// import utils
const { number_format, equals_ignore_case, name } = require('../../utils');

const donation_keywords = ['charity','donation','donate'];
const hacked_keywords = ['hack'];
const huge_tokens = ['btc','eth','usdt','usdc','busd'];
const min_amount = 1e7;
const ignore_case_words = ['for'];

const repeat_emoji = d => {
  const { amount_usd, transaction_type, is_donation, is_hacked } = { ...d };
  let emoji;
  switch (transaction_type) {
    case 'mint':
      emoji = '🖨';
      break;
    case 'burn':
      emoji = '🔥';
      break;
    case 'lock':
      emoji = '🔐';
      break;
    case 'unlock':
      emoji = '🔓';
    case '':
      if (is_donation) {
        emoji = '🎁';
      }
      else if (is_hacked) {
        emoji = '🥷';
      }
      else {
        if (amount_usd <= 5 * min_amount) {
          emoji = '🐟';
        }
        else if (amount_usd <= 10 * min_amount) {
          emoji = '🐬';
        }
        else if (amount_usd <= 50 * min_amount) {
          emoji = '🐋';
        }
        else {
          emoji = '🐳';
        }
      }
      break;
  }
  return [...Array(amount_usd <= (transaction_type !== 'transfer' ? 1.5 : is_donation || is_hacked ? 1 : 5) * min_amount ?
    1 : amount_usd <= (transaction_type !== 'transfer' ? 3 : is_donation || is_hacked ? 2 : 10) * min_amount ?
    2 : amount_usd <= (transaction_type !== 'transfer' ? 10 : is_donation || is_hacked ? 5 : 50) * min_amount ?
    3 : 4
  ).keys()].map(i => emoji).join('');
};

module.exports = async () => {
  const now = moment();
  const { coinhippo } = { ...config?.api?.endpoints };
  const api = axios.create({ baseURL: coinhippo });
  const res = await api.get('', {
    params: {
      module: 'whale_alert',
      start: moment(now).subtract(3, 'minute').unix(),
      end: moment(now).unix(),
    },
  }).catch(error => { return { data: { error } }; });
  let alerted, data = res?.data?.transactions || [];
  data = _.orderBy(Object.entries(_.groupBy(data, 'hash')).map(([k, v]) => {
    return {
      k,
      v,
      amount: _.sumBy(v, 'amount'),
      amount_usd: _.sumBy(v, 'amount_usd'),
      timestamp: _.min(v.map(d => d.timestamp)),
    };
  }), ['amount_usd', 'timestamp'], ['desc', 'asc']);
  data = data.filter(d => d.v?.findIndex(_d => _d.symbol) > -1);
  data = data.map(d => {
    const { v, transaction_type } = { ...d };
    return {
      ...d,
      blockchain: _.head(v.map(_d => _d.blockchain).filter(b => b)),
      transaction_type: _.head(v.map(_d => _d.transaction_type).filter(t => t)),
      symbol: _.head(v.map(_d => _d.symbol).filter(s => s)),
      from_addresses: _.uniq(v.map(_d => _d.from?.address).filter(a => a)),
      from_address_name: _.head(v.map(_d => _d.from?.owner ? _d.from.owner_type === 'exchange' && _d.from.owner.length <= 3 ? name(_d.from.owner, null, ignore_case_words) : _d.from.owner : '').filter(n => n)),
      from_address_type: _.head(v.map(_d => _d.from?.owner ? _d.from.owner_type : '').filter(t => t)),
      to_addresses: _.uniq(v.map(_d => _d.to?.address).filter(a => a)),
      to_address_name: _.head(v.map(_d => _d.to?.owner ? _d.to.owner_type === 'exchange' && _d.to.owner.length <= 3 ? name(_d.to.owner, null, ignore_case_words) : _d.to.owner : '').filter(n => n)),
      to_address_type: _.head(v.map(_d => _d.to?.owner ? _d.to.owner_type : '').filter(t => t)),
      is_donation: transaction_type === 'transfer' && v.findIndex(_d => _d.to?.owner && donation_keywords.findIndex(k => _d.to.owner.toLowerCase().indexOf(k) > -1) > -1) > -1,
      is_hacked: transaction_type === 'transfer' && v.findIndex(_d => _d.from?.owner && hacked_keywords.findIndex(k => _d.from.owner.toLowerCase().indexOf(k) > -1) > -1) > -1,
    };
  });
  data = data.map(d => {
    const { from_address_name, to_address_name, symbol } = { ...d };
    return {
      ...d,
      from_address_name: name(from_address_name ?
        from_address_name.split(' ').map(_d => _d.replace(symbol, symbol.toUpperCase())).join(' ') :
        symbol === 'husd' ? `${symbol.toUpperCase()} incinerator` : 'unknown wallet'
      , null, ignore_case_words),
      to_address_name: name(to_address_name ?
        to_address_name.split(' ').map(_d => _d.replace(symbol, symbol.toUpperCase())).join(' ') :
        'unknown wallet'
      , null, ignore_case_words),
    };
  });
  data = data.filter(d => {
    const { from_address_name, to_address_name, from_address_type, to_address_type } = { ...d };
    return from_address_name && to_address_name &&
      (from_address_name.toLowerCase().indexOf('unknown owner ') < 0 || to_address_name.toLowerCase().indexOf('unknown owner ') < 0) &&
      !(from_address_type === 'exchange' && to_address_type === 'exchange' && from_address_name === to_address_name);
  });
  data = data.filter(d => {
    const { v, amount_usd, transaction_type, symbol, from_address_name, to_address_name, is_donation, is_hacked } = { ...d };
    return v && amount_usd >= (transaction_type !== 'transfer' ? 2.5 : is_donation || is_hacked ? 0.5 : 7.5) * (equals_ignore_case(from_address_name, to_address_name) && huge_tokens.indexOf(symbol) > -1 ? 2.5 : 1) * min_amount;