
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
    title: 'Kucoin',
    url: 'https://www.kucoin.com',
    path: '/rss/news',
    keywords: ['gets listed on'],
  },
  {
    id: 'kraken',
    title: 'Kraken',
    url: 'https://blog.kraken.com',
    path: '/kraken-news/announcements',
    keywords: ['trading starts'],
  },
];

module.exports = async () => {
  let data = [];
  for (let i = 0; i < exchanges.length; i++) {
    const exchange = exchanges[i];
    const { id, url, path, params, headers, keywords } = { ...exchange };
    const web = axios.create({ baseURL: url });
    const res = await web.get(path || '', {
      params,
      headers,
    }).catch(error => { return { data: { error } }; });
    const html = res?.data && !res.data.error && parse(res.data);
    if (html) {
      switch (id) {
        case 'binance':
          try {
            const object = html.querySelector('#link-0-0-p1');
            const title = object.textContent;
            data.push({
              exchange,
              title,
              url: `${url}${object.getAttribute('href')}`,
            });
          } catch (error) {}
          break;
        case 'coinbase':
          try {
            const object = html.querySelector('h1').querySelector('a');
            const title = object.textContent;
            if (title && (!keywords || keywords.length < 1 || keywords.findIndex(k => title.toLowerCase().includes(k)) > -1)) {
              data.push({
                exchange,
                title,
                url: _.head(object.getAttribute('href')?.split('?')),
              });
            }
          } catch (error) {}
          break;
        case 'coinlist':
          try {
            const object = html.querySelector('.m-article-card__info-link');
            const title = object.querySelector('.m-article-card__title')?.getAttribute('title');
            if (title && (!keywords || keywords.length < 1 || keywords.findIndex(k => title.toLowerCase().includes(k)) > -1)) {
              data.push({
                exchange,
                title,
                url: `${url}${object.getAttribute('href')}`,
              });
            }
          } catch (error) {}
          break;
        case 'okex':
          try {
            const object = html.querySelector('.article-list-item').querySelector('a');
            const title = object.textContent;
            if (title && (!keywords || keywords.length < 1 || keywords.findIndex(k => title.toLowerCase().includes(k)) > -1)) {
              data.push({
                exchange,
                title,
                url: `${url}${object.getAttribute('href')}`,
              });
            }
          } catch (error) {}
          break;
        case 'ftx':
          try {
            const object = html.querySelector('.article-list-item').querySelector('a');
            const title = object.textContent;
            if (title && (!keywords || keywords.length < 1 || keywords.findIndex(k => title.toLowerCase().includes(k)) > -1)) {
              data.push({
                exchange,
                title,
                url: `${url}${object.getAttribute('href')}`,
              });
            }
          } catch (error) {}
          break;
        case 'huobi':
          try {
            const object = html.querySelector('.list-field1');
            const title = object.textContent?.split('\n').join('').trim();
            data.push({
              exchange,
              title,
              url: `${url}${object.getAttribute('href')}`,
            });
          } catch (error) {}
          break;
        case 'kucoin':
          try {
            const object = html.querySelector('item');
            let title = object.querySelector('title')?.textContent;
            const prefix = '<![CDATA[', postfix = ']]>';
            title = (title ? title.startsWith(prefix) && title.endsWith(postfix) ? title.substring(prefix.length, title.length - postfix.length) : title : '').trim();
            if (title && (!keywords || keywords.length < 1 || keywords.findIndex(k => title.toLowerCase().includes(k)) > -1)) {
              data.push({
                exchange,
                title,
                url: object.querySelector('guid')?.textContent,
              });
            }
          } catch (error) {}
          break;
        case 'kraken':
          try {
            const object = html.querySelector('.entry-header').querySelector('h1').querySelector('a');
            const title = object.textContent;
            if (title && (!keywords || keywords.length < 1 || keywords.findIndex(k => title.toLowerCase().includes(k)) > -1)) {
              data.push({
                exchange,
                title,
                url: object.getAttribute('href'),
              });
            }
          } catch (error) {}
          break;
        default:
          break;
      }
    }
  }
  if (data.length > 0) {
    const id = 'latest-exchanges-listing';
    const response = await crud({
      collection: 'tmp',
      method: 'get',
      id,
    });
    const latest = { ...response };
    data = _.slice(data.filter(d => d.exchange && d.title && d.url && d.url !== latest[d.exchange.id]), 0, 1);
    const twitter = [], telegram = [];
    data.forEach((d, i) => {
      const { exchange, title, url } = { ...d };
      latest[exchange.id] = url;
      twitter.push(`${i === 0 ? `💎 ${exchange.title} ${exchange.event || 'Listing'}\n` : ''}\n${title}\n${url}\n\n#${exchange.title?.split(' ').join('')} #Cryptocurrency`);
      telegram.push(`${i === 0 ? `💎 <b><pre>${exchange.title} ${exchange.event || 'Listing'}</pre></b>\n` : ''}${title}\n<pre>via</pre> <a href="${url}">${new URL(url).hostname}</a>`);
    });
    if (data.length > 0) {
      await crud({
        collection: 'tmp',
        method: 'set',
        id,
        ...latest,
      });
      if (twitter.length > 0 || telegram.length > 0) {
        const { coinhippo } = { ...config?.api?.endpoints };
        const { socials } = { ...config };
        const api = axios.create({ baseURL: coinhippo });
        await api.post('', {
          module: 'broadcast',
          twitter: {
            messages: twitter,
            key: socials?.twitter?.api_key,
          },
          telegram: {
            messages: telegram,
            key: socials?.telegram?.key,
            parameters: {
              web_preview: true,
            },
          },
        }).catch(error => { return { data: { error } }; });
      }
    }
  }
  return data.length > 0;
};