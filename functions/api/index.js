
exports.handler = async (event, context, callback) => {
  // import module for http request
  const axios = require('axios');
  // import module for date time
  const moment = require('moment');
  // import lodash
  const _ = require('lodash');
  // import config
  const config = require('config-yml');
  // import index
  const { crud } = require('./services/index');
  // import utils
  const { sleep, equals_ignore_case, get_params, to_json } = require('./utils');
  // data
  const { chains } = require('./data');

  // parse function event to req
  const req = {
    body: (event.body && JSON.parse(event.body)) || {},
    query: event.queryStringParameters || {},
    params: event.pathParameters || {},
    method: event.requestContext?.http?.method,
    url: event.routeKey?.replace('ANY ', ''),
    headers: event.headers,
  };

  // initial response
  let response;
  // initial params
  let params = get_params(req);

  // handle api routes
  switch (req.url) {
    case '/':
      // initial module
      const _module = params.module?.trim().toLowerCase();
      delete params.module;

      // initial path
      let path = params.path || '';
      delete params.path;

      // initial cache
      let cache = typeof params.cache === 'boolean' ? params.cache : params.cache?.trim().toLowerCase() === 'true' ? true : false;
      delete params.cache;
      const cache_timeout = params.cache_timeout ? Number(params.cache_timeout) : undefined;
      delete params.cache_timeout;

      // initial variables
      let res, response_cache, cache_id, cache_hit;
      // api
      const { coingecko, ens, fear_and_greed, news, whale_alert } = { ...config?.api?.endpoints };
      // run each module
      switch (_module) {
        case 'index':
          res = { data: await crud(params) };
          break;
        case 'coingecko':
          // set id
          cache_id = _.concat(path.split('/'), params && [JSON.stringify({ ...params })]).filter(s => s).join('_').toLowerCase();
          if (!cache_id) {
            cache = false;
          }
          // get from cache
          if (cache) {
            response_cache = await crud({
              collection: 'tmp',
              method: 'get',
              id: cache_id,
            });
            response_cache = to_json(response_cache?.response);
            if (response_cache && moment().diff(moment(response_cache.updated_at * 1000), 'minutes', true) <= (cache_timeout || 1)) {
              res = { data: response_cache };
              cache_hit = true;
            }
          }
          // cache miss
          if (!res) {
            if (coingecko) {
              const api = axios.create({ baseURL: coingecko });
              res = await api.get(path, { params })
                .catch(error => { return { data: { error } }; });
            }
          }
          // check cache
          if (res?.data && !res.data.error) {
            // save
            if (cache && !cache_hit) {
              await crud({
                collection: 'tmp',
                method: 'set',
                id: cache_id,
                response: JSON.stringify(res.data),
                updated_at: moment().unix(),
              });
            }
          }
          else if (response_cache) {
            res = { data: response_cache };
          }
          res.data.cache_hit = cache_hit;
          break;
        case 'ens':
          if (ens) {
            const api = axios.create({ baseURL: ens });
            res = await api.get(path, { params })
              .catch(error => { return { data: { error } }; });
          }
          break;
        case 'fear_and_greed':
          if (fear_and_greed) {
            path = path || '/fng/';
            params = {
              ...params,
              limit: 31,
            };
            const api = axios.create({ baseURL: fear_and_greed });
            res = await api.get(path, { params })
              .catch(error => { return { data: { error } }; });
          }
          break;
        case 'news':
          if (news?.api) {
            path = path || '/posts/';
            path = `${path}${!path.endsWith('/') ? '/' : ''}`;
            params = {
              ...params,
              auth_token: news.key,
            };
            const api = axios.create({ baseURL: news.api });
            res = await api.get(path, { params })
              .catch(error => { return { data: { error } }; });
          }
          break;
        case 'whale_alert':
          if (whale_alert?.api) {
            path = path || '/transactions';
            params = {
              ...params,
              api_key: whale_alert.key,
            };
            const api = axios.create({ baseURL: whale_alert.api });
            res = await api.get(path, { params })
              .catch(error => { return { data: { error } }; });
          }
          break;
        case 'data':
          let data = { chains };
          if (data[params.collection]) {
            data = data[params.collection];
          }
          res = { data };
          break;
        case 'broadcast':
          const { twitter, telegram } = { ...params };
          if (twitter?.messages?.length > 0) {
            // import twitter api
            const TwitterClient = require('twitter-api-client').TwitterClient;
            const { api_key, api_secret, access_token, access_token_secret } = { ...config?.socials?.twitter };
            if (twitter.key === api_key) {
              const twitter_client = new TwitterClient({
                apiKey: api_key,
                apiSecret: api_secret,
                accessToken: access_token,
                accessTokenSecret: access_token_secret
              });
              const { messages } = { ...twitter };
              messages.forEach(async (m, i) => {
                try {
                  await twitter_client.tweets.statusesUpdate({
                    status: m,
                  });
                } catch (error) {}
              });
            }
          }
          if (telegram?.messages?.length > 0) {
            const { api, key, channel } = { ...config?.socials?.telegram };
            if (telegram.key === key) {
              const { messages, parameters } = { ...telegram };
              const { web_preview } = { ...parameters };
              messages.forEach(async (m, i) => {
                try {
                  await axios.get(`${api}/bot${key}/sendMessage`, {
                    params: {
                      chat_id: channel,
                      parse_mode: 'html',
                      disable_web_page_preview: !(web_preview === true || web_preview === 'true'),
                      disable_notification: i < messages.length - 1,
                      text: m,
                    },
                  });
                } catch (error) {}
              });
            }
          }
          break;
        default:
          break;
      };

      // set response
      if (res?.data) {
        response = res.data;
        // remove error config
        if (response.error?.config) {
          delete response.error.config;
        }
      }
      break;
    default:
      if (!req.url) {
        response = await require('./services/alerts')();
      }
      break;
  };

  // return response
  return response;
};