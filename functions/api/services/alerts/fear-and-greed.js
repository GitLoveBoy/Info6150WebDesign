
// import module for http request
const axios = require('axios');
// import config
const config = require('config-yml');
// import utils
const { number_format } = require('../../utils');

module.exports = async () => {
  const { coinhippo } = { ...config?.api?.endpoints };
  const { high, low } = { ...config?.alerts?.fear_and_greed_threshold };
  const api = axios.create({ baseURL: coinhippo });
  const res = await api.get('', {
    params: {
      module: 'fear_and_greed',
    },
  }).catch(error => { return { data: { error } }; });
  const data = res?.data?.data?.[0];
  if (data) {
    const { value_classification } = { ...data };
    let { value } = { ...data };
    value = Number(value);
    const twitter = [], telegram = [];
    twitter.push(`🌦 Today's #Bitcoin Fear & Greed Index is ${number_format(value, '0,0')} - ${value_classification}${value <= low ? ' 🥶' : value >= high ? ' 🤩' : ''}\n\n#Cryptocurrency`);
    telegram.push(`🌦 Today's Bitcoin Fear & Greed Index is <pre>${number_format(value, '0,0')}</pre> - <u>${value_classification}</u>${value <= low ? ' 🥶' : value >= high ? ' 🤩' : ''}`);
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
        },
      }).catch(error => { return { data: { error } }; });
    }
  }
  return !!data;
};