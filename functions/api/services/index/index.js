
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