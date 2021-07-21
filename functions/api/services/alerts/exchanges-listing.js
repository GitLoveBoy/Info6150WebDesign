
// import module for http request
const axios = require('axios');
// import lodash
const _ = require('lodash');
// import config
const config = require('config-yml');
// import index
const { crud } = require('../index');
// import html parser
const parse = require('node-html-parser').parse;

// exchanges
const exchanges = [
  {
    id: 'binance',
    title: 'Binance',
    url: 'https://www.binance.com',
    path: '/en/support/announcement/c-48',
  },
  {
    id: 'coinbase',
    title: 'Coinbase',
    url: 'https://medium.com',
    path: '/@coinbaseblog',
    keywords: ['now available on coinbase', 'launching on coinbase'],
  },
  {
    id: 'coinlist',
    title: 'Coinlist',
    event: 'Token Sales',
    url: 'https://blog.coinlist.co',
    path: '/tag/token-sales/',
    keywords: ['token sale on coinlist'],
  },
  // {
  //   id: 'okex',
  //   title: 'OKEx',
  //   url: 'https://www.okex.com',
  //   path: '/support/hc/en-us/sections/115000447632-New-Token',
  // },
  // {
  //   id: 'ftx',
  //   title: 'FTX',
  //   url: 'https://help.ftx.com',
  //   path: '/hc/en-us/sections/360011389572-New-Listing-Announcements',
  //   keywords: ['has listed'],
  // },
  // {
  //   id: 'huobi',
  //   title: 'Huobi',
  //   url: 'https://www.huobi.com',
  //   path: '/support/en-us/list/360000039942/',
  // },
  {
    id: 'kucoin',