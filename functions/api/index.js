
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