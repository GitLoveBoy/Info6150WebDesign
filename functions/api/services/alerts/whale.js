
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