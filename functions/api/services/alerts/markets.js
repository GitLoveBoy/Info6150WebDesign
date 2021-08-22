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
const filter_outs = ['tether','usd-coin','binance-