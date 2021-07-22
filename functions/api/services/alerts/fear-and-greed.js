
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