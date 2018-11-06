var request = require('request-promise');
const async = require('async');

const API_ENDPOINT = 'https://aweme.snssdk.com/aweme/v1';

request = request.defaults({
  qs: {
    "js_sdk_version": "1.2.2",
    "app_type": "normal",
    "manifest_version_code": "310",
    "_rticket": Date.now(),
    "ac": "wifi",
    "device_id": "57969996079",
    "iid": "50021145892",
    "os_version": "1",
    "channel": "a",
    "version_code": "310",
    "device_type": "a",
    "language": "en",
    "resolution": "1",
    "openudid": "a",
    "update_version_code": "3102",
    "app_name": "aweme",
    "version_name": "3.1.0",
    "os_api": "26",
    "device_brand": "a",
    "ssmix": "a",
    "device_platform": "a",
    "dpi": "440",
    "aid": "1128",
    "as": "a1qwert123",
    "cp": "cbfhckdckkde1",
    "mas": "01789a14712db6c002c200d78d120c2e534c4cec1c8c1ca64646ec"
  },
  headers: {
    'User-Agent': 'com.ss.android.ugc.aweme/310 (Linux; U; Android 8.0.0; en_US; MIX 2; Build/OPR1.170623.027; Cronet/58.0.2991.0)',
    'X-SS-REQ-TICKET': '1541500434739',
    'X-Tt-Token': '002447bd7d6a5c792cb223b1151e399e0402e5fdcf768ab9f96930b63dc169d353480340ec7abaa1856d8133dcfe12363b42',
    'sdk-version': '1',
    'X-SS-TC': '0',
  },
  json: 1,
  // proxy: 'http://localhost:8888',
  // strictSSL: false
})

getFeed = (qs) => {
  return request(API_ENDPOINT+'/feed/', {
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

getSuggestions = (qs) => {
  return request(API_ENDPOINT+'/search/sug/', {
    qs: {
      // "keyword": "cat",
      ...qs
    }
  });
}

searchSingle = (qs) => {
  return request(API_ENDPOINT+'/general/search/single/', {
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

searchItem = (qs) => {
  return request(API_ENDPOINT+'/search/item/', {
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

searchAll = (qs) => {
  return request(API_ENDPOINT+'/discover/search/', {
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

searchMusic = (qs) => {
  return request(API_ENDPOINT+'/music/search/', {
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

searchChallenge = (qs) => {
  return request(API_ENDPOINT+'/challenge/search/', {
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

getUserInfoByUid = ({ user_id }) => {
  return request(API_ENDPOINT+'/user/', {user_id});
}

getUserPostByUid = ({ user_id, max_cursor, count }) => {
  return request(API_ENDPOINT+'/aweme/post/', {qs: {user_id, max_cursor, count}});
}

getAllUserPostByUid = ({ user_id }) => {
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

// searchItem({ keyword: '猫' }).then(console.log);
// searchMusic({ keyword: '猫' }).then(console.log);
// searchChallenge({ keyword: '猫' }).then(console.log);
// searchAll({ keyword: 'xxn520' }).then(console.log);
// getSuggestions({ keyword: '猫' }).then(console.log);
// getFeed().then(console.log);
// getUserInfoByUid({ user_id: 95599520856 }).then(console.log);
// getUserPostByUid({ user_id: 82480311983, count: 10 }).then(console.log);
// getAllUserPostByUid({ user_id: 82480311983 }).then(res => console.log(res.length));

module.exports = { request, getFeed, getSuggestions, searchSingle, searchItem, searchAll, searchMusic, searchChallenge, getUserInfoByUid, getUserPostByUid, getAllUserPostByUid }