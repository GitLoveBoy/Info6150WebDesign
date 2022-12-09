
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