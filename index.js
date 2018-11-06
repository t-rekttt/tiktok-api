const request = require('request-promise');

const API_ENDPOINT = 'https://aweme.snssdk.com/aweme/v1/feed/';

getFeed = (qs) => {
  return request(API_ENDPOINT, {
      qs: {
        "type": "0",
        "max_cursor": "0",
        "min_cursor": "0",
        "count": "6",
        "volume": "1",
        "pull_type": "0",
        "need_relieve_aweme": "0",
        "filter_warn": "0",
        "req_from": "enter_auto",
        "is_cold_start": "0",
        "manifest_version_code": "310",
        "version_code": "310",
        "device_type": "ahihi",
        "app_name": "aweme",
        ...qs
      }
    });
}

module.exports = { getFeed }