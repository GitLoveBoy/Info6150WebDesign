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