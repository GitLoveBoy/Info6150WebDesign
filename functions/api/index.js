
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