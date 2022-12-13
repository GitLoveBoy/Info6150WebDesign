
// import module for http request
const axios = require('axios');
// import utils
const { normalize_obj } = require('./utils');

// initial indexer info
const indexer_url = process.env.INDEXER_URL;
const indexer_username = process.env.INDEXER_USERNAME;
const indexer_password = process.env.INDEXER_PASSWORD;

module.exports.crud = async (params = {}) => {
  // initial response
  let response;

  if (indexer_url && params?.collection) {
    // set collection name
    const collection = params.collection;
    delete params.collection;
    // set method
    const method = params.method; // get, set, update, query, search, delete, remove
    delete params.method;
    let path = params.path || '';
    delete params.path;
    // set id
    let id = params.id;
    delete params.id;
    // initial track total
    const track_total_hits = typeof params.track_total_hits === 'boolean' ? params.track_total_hits : typeof params.track_total_hits === 'string' ? params.track_total_hits?.trim().toLowerCase() === 'true' ? true : false : true;
    delete params.track_total_hits;
    // initial use raw data
    const use_raw_data = typeof params.use_raw_data === 'boolean' ? params.use_raw_data : typeof params.use_raw_data === 'string' ? params.use_raw_data?.trim().toLowerCase() === 'true' ? true : false : true;
    delete params.use_raw_data;
    // initial update only
    const update_only = typeof params.update_only === 'boolean' ? params.update_only : typeof params.update_only === 'string' ? params.update_only?.trim().toLowerCase() === 'true' ? true : false : true;
    delete params.update_only;

    // normalize
    if (!isNaN(params.height)) {
      params.height = Number(params.height);
    }
    const objectFields = ['aggs', 'query', 'sort', 'fields'];
    objectFields.forEach(f => {
      if (params[f]) {
        try {
          params[f] = params[f]?.startsWith('[') && params[f].endsWith(']') ? JSON.parse(params[f]) : normalize_obj(JSON.parse(params[f]));
        } catch (error) {}
      }
    });

    // initial indexer
    const indexer = axios.create({ baseURL: indexer_url });
    // initial auth
    const auth = {
      username: indexer_username,
      password: indexer_password,
    };

    // run method
    switch (method) {
      case 'get':
        path = path || `/${collection}/_doc/${id}`;
        // request indexer
        response = await indexer.get(path, { params, auth })
          .catch(error => { return { data: { error } }; });
        // set response data
        response = response?.data?._source ? { data: { ...response.data._source, id: response.data._id } } : response;
        break;
      case 'set':
      case 'update':
        path = path || `/${collection}/_doc/${id}`;
        if (path.includes('/_update_by_query')) {
          try {
            // request indexer
            response = await indexer.post(path, params, { auth })
              .catch(error => { return { data: { error } }; });
          } catch (error) {}
        }
        else {
          // request indexer
          response = await (path.includes('_update') ?
            indexer.post(path, { doc: params }, { auth }) :
            indexer.put(path, params, { auth })
          ).catch(error => { return { data: { error } }; });
          // retry with update/insert
          if (response?.data?.error) {
            path = path?.replace(path.includes('_doc') ? '_doc' : '_update', path.includes('_doc') ? '_update' : '_doc') || path;
            if (update_only && path?.includes('_doc')) {
              // request indexer
              const _response = await indexer.get(path, { auth })
                .catch(error => { return { data: { error } }; });
              if (_response?.data?._source) {
                path = path?.replace('_doc', '_update') || path;
              }
            }
            // request indexer
            response = await (path.includes('_update') ?
              indexer.post(path, { doc: params }, { auth }) :
              indexer.put(path, params, { auth })
            ).catch(error => { return { data: { error } }; });
          }
        }
        break;
      case 'query':
      case 'search':
        path = path || `/${collection}/_search`;
        // setup search data
        const search_data = use_raw_data ? params : {
          query: {
            bool: {
              // set query for each field
              must: Object.entries({ ...params }).filter(([k, v]) => !['from', 'size', 'query', 'aggs', 'sort', '_source', 'fields'].includes(k)).map(([k, v]) => {
                // overide field from params
                switch (k) {
                  case 'id':
                    if (!v && id) {
                      v = id;
                    }
                    break;
                  default:
                    break;
                }
                // set match query
                return {
                  match: {
                    [`${k}`]: v,
                  },
                };
              }),