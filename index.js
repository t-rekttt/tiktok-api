var request = require('request-promise');
const async = require('async');

request = request.defaults({
  qs: {
    "source": "discover",
    "ts": "1556178331",
    "js_sdk_version": "",
    "app_type": "normal",
    "manifest_version_code": "583",
    "_rticket": "1556178332328",
    "app_language": "en",
    "iid": "6683055906148435713",
    "channel": "googleplay",
    "device_type": "MIX%202",
    "language": "en",
    "account_region": "VN",
    "resolution": "1080*2030",
    "openudid": "b19f5ff713b925ef",
    "update_version_code": "5830",
    "sys_region": "US",
    "os_api": "26",
    "uoo": "0",
    "is_my_cn": "0",
    "timezone_name": "Asia%2FHo_Chi_Minh",
    "dpi": "440",
    "carrier_region": "VN",
    "ac": "wifi",
    "device_id": "6620810330052445697",
    "pass-route": "1",
    "mcc_mnc": "45204",
    "os_version": "8.0.0",
    "timezone_offset": "25200",
    "version_code": "583",
    "carrier_region_v2": "452",
    "app_name": "trill",
    "ab_version": "5.8.3",
    "version_name": "5.8.3",
    "device_brand": "Xiaomi",
    "ssmix": "a",
    "pass-region": "1",
    "device_platform": "android",
    "build_number": "5.8.3",
    "region": "US",
    "aid": "1180",
    "as": "a1qwert123",
    "cp": "cbfhckdckkde1"
  },
  headers: {
    'User-Agent': 'com.ss.android.ugc.trill/584 (Linux; U; Android 5.1.1; en_US; LG-H961N;',
    'X-SS-REQ-TICKET': '1541500434739',
    'X-Tt-Token': '002447bd7d6a5c792cb223b1151e399e0402e5fdcf768ab9f96930b63dc169d353480340ec7abaa1856d8133dcfe12363b42',
    'sdk-version': '1',
    'X-SS-TC': '0',
  },
  json: 1,
//   proxy: 'http://localhost:8080',
  strictSSL: false
});

class tiktok {
  constructor(country = null) {
    this.API_ENDPOINT = 'https://api2.musical.ly/aweme/v1';

    if (country && country.toLowerCase() === 'vn') this.API_ENDPOINT = 'https://api21-h2.tiktokv.com/aweme/v1';
  }

  getFeed(qs) {
    return request(this.API_ENDPOINT+'/feed/', {
        qs: {
          "type": "0",
          "max_cursor": "0",
          "min_cursor": "0",
          "count": "6",
          "volume": "1",
          "pull_type": "0",
          "need_relieve_aweme": "0",
          "filter_warn": "0",
          "is_cold_start": "0",
          ...qs
        }
      });
  }

  getSuggestions(qs) {
    return request(this.API_ENDPOINT+'/search/sug/', {
      qs: {
        // "keyword": "cat",
        ...qs
      }
    });
  }

  searchSingle(qs) {
    return request(this.API_ENDPOINT+'/general/search/single/', {
      qs: {
        // "keyword": "cat",
        "offset": "0",
        "count": "10",
        "is_pull_refresh": "0",
        "hot_search": "0",
        ...qs
      }
    });
  }

  searchItem(qs) {
    return request(this.API_ENDPOINT+'/search/item/', {
      qs: {
        // "keyword": "cat",
        "offset": "0",
        "count": "10",
        "source": "video_search",
        "is_pull_refresh": "1",
        "hot_search": "0",
        ...qs
      }
    });
  }

  searchAll(qs) {
    return request(this.API_ENDPOINT+'/discover/search/', {
      qs: {
        // "keyword": "cat",
        "cursor": "0",
        "count": "10",
        "type": "1",
        "is_pull_refresh": "1",
        "hot_search": "0",
        ...qs
      }
    });
  }

  searchMusic(qs) {
    return request(this.API_ENDPOINT+'/music/search/', {
      qs: {
        // "keyword": "cat",
        "cursor": "0",
        "count": "10",
        "is_pull_refresh": "1",
        "hot_search": "0",
        ...qs
      }
    });
  }

  searchChallenge(qs) {
    return request(this.API_ENDPOINT+'/challenge/search/', {
      qs: {
        // "keyword": "cat",
        "cursor": "0",
        "count": "20",
        "hot_search": "0",
        "is_pull_refresh": "1",
        "search_source": "challenge",
        ...qs
      }
    });
  }

  getUserInfoByUid({ user_id }) {
    return request(this.API_ENDPOINT+'/user/', {user_id});
  }

  getUserPostByUid({ user_id, max_cursor, count }) {
    return request(this.API_ENDPOINT+'/aweme/post/', {qs: {user_id, max_cursor, count}});
  }

  getAllUserPostByUid({ user_id }) {
    return new Promise(resolve => {
      max_cursor = null;

      let posts = [];

      async.doWhilst(
        cb => {
          getUserPostByUid({ count: 25, user_id, max_cursor })
            .then(data => {
              posts = posts.concat(data.aweme_list);

              max_cursor = null;

              if (data.has_more) max_cursor = data.max_cursor;

              cb();
            })
            .catch(cb);
        }, 
        () => max_cursor,
        (err, data) => {
          if (err) throw err;

          resolve(posts);
        }
      );
    });
  }
}

module.exports = tiktok;
