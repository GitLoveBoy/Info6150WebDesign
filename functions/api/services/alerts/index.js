// import module for date time
const moment = require('moment');

const exchanges_listing = require('./exchanges-listing');
const fear_and_greed = require('./fear-and-greed');
const gas = require('./gas');
const markets = require('./markets');
const news = require('./news');
const whale = require('./whale');

module.exports = async () => {
  const now = moment();
  let alerted = false;
  if (!alerted) {
    alerted = await exchanges_listing();
  }
  if (!alerted) {
    alerted = await news();
  }
  if (!alerted && Number(now.hours()) % 12 === 0 && Number(now.minutes()) === 5) {
    alerted = await fear_and_greed();
  }
  if (!ale