// import module for http request
const axios = require('axios');
// import module for date time
const moment = require('moment');
// import lodash
const _ = require('lodash');
// import config
const config = require('config-yml');
// import index
const { crud } = require('../index');

const filters = ['rising','hot','bullish','bearish','important','lol'];

module.exports = async () => {
  const now = moment();
  const { coinhippo } = { ...config?.api?.endpoints };
  const api = axios.create({ baseURL: coinhippo });
  let alerted, data = [];
  for (let i = 0; i < filters.length; i++) {
    const filter = filters[i];
    const res = await api.get('', {
      params: {
        module: 'news',
        public: true,
        page: 1,
        filter,
      },
    }).catch(error => { return { data: { error } }; });
    data = _.orderBy(_.uniqBy(_.concat(data, res?.data?.results || []), 'id'), ['created_at'], ['desc']);
  }
  if (data.length > 0) {
    const id = 'latest-news';
    const response = await crud({
      collection: 'tmp',
      method: 'get',
      id,
    });
    const latest = { ...response };
    data = data.filter(d => d.title && d.url && d.source && now.diff(moment(d.created_at)) <= (4 * 60 * 60 * 1000));
    const latest_index = latest?.news_id && data.findIndex(d => d.id?.toString() === latest.news_id);
    if (latest_index > -1) {
      data 