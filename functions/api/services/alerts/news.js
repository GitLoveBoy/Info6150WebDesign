// import module for http request
const axios = require('axios');
// import module for date time
const moment = require('moment');
// import lodash
const _ = require('lodash');
// import config
const config = require('config-yml');
// import index
const { crud } = require('../index');

const filters = ['rising','hot','bullish','bearish','important','lol'];

module.exports = async () => {
  const now = moment();
  const { coinhippo } = { ...config?.api?.endpoints };
  const api = axios.create({ baseURL: coinhippo });
  let alerted, data = [];
  for (let i = 0; i < filters.length; i++) {
    const fil