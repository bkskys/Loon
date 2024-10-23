
const _scriptSonverterCompatibilityType = typeof $response !== 'undefined' ? 'response' : typeof $request !== 'undefined' ? 'request' : ''
const _scriptSonverterCompatibilityDone = $done
try {
  
// 转换时间: 2024/10/23 17:47:48
// 兼容性转换
if (typeof $request !== 'undefined') {
  const lowerCaseRequestHeaders = Object.fromEntries(
    Object.entries($request.headers).map(([k, v]) => [k.toLowerCase(), v])
  );

  $request.headers = new Proxy(lowerCaseRequestHeaders, {
    get: function (target, propKey, receiver) {
      return Reflect.get(target, propKey.toLowerCase(), receiver);
    },
    set: function (target, propKey, value, receiver) {
      return Reflect.set(target, propKey.toLowerCase(), value, receiver);
    },
  });
}
if (typeof $response !== 'undefined') {
  const lowerCaseResponseHeaders = Object.fromEntries(
    Object.entries($response.headers).map(([k, v]) => [k.toLowerCase(), v])
  );

  $response.headers = new Proxy(lowerCaseResponseHeaders, {
    get: function (target, propKey, receiver) {
      return Reflect.get(target, propKey.toLowerCase(), receiver);
    },
    set: function (target, propKey, value, receiver) {
      return Reflect.set(target, propKey.toLowerCase(), value, receiver);
    },
  });
}
Object.getOwnPropertyNames($httpClient).forEach(method => {
  if(typeof $httpClient[method] === 'function') {
    $httpClient[method] = new Proxy($httpClient[method], {
      apply: (target, ctx, args) => {
        for (let field in args?.[0]?.headers) {
          if (['host'].includes(field.toLowerCase())) {
            delete args[0].headers[field];
          } else if (['number'].includes(typeof args[0].headers[field])) {
            args[0].headers[field] = args[0].headers[field].toString();
          }
        }
        return Reflect.apply(target, ctx, args);
      }
    });
  }
})


// QX 相关
var setInterval = () => {}
var clearInterval = () => {}
var $task = {
  fetch: url => {
    return new Promise((resolve, reject) => {
      if (url.method == 'POST') {
        $httpClient.post(url, (error, response, data) => {
          if (response) {
            response.body = data
            resolve(response, {
              error: error,
            })
          } else {
            resolve(null, {
              error: error,
            })
          }
        })
      } else {
        $httpClient.get(url, (error, response, data) => {
          if (response) {
            response.body = data
            resolve(response, {
              error: error,
            })
          } else {
            resolve(null, {
              error: error,
            })
          }
        })
      }
    })
  },
}

var $prefs = {
  removeValueForKey: key => {
    let result
    try {
      result = $persistentStore.write('', key)
    } catch (e) {
    }
    if ($persistentStore.read(key) == null) return result
    try {
      result = $persistentStore.write(null, key)
    } catch (e) {
    }
    if ($persistentStore.read(key) == null) return result
    const err = '无法模拟 removeValueForKey 删除 key: ' + key
    console.log(err)
    $notification.post('Script Hub: 脚本转换', '❌ local.js.txt', err)
    return result
  },
  valueForKey: key => {
    return $persistentStore.read(key)
  },
  setValueForKey: (val, key) => {
    return $persistentStore.write(val, key)
  },
}

var $notify = (title = '', subt = '', desc = '', opts) => {
  const toEnvOpts = (rawopts) => {
    if (!rawopts) return rawopts 
    if (typeof rawopts === 'string') {
      if ('undefined' !== typeof $loon) return rawopts
      else if('undefined' !== typeof $rocket) return rawopts
      else return { url: rawopts }
    } else if (typeof rawopts === 'object') {
      if ('undefined' !== typeof $loon) {
        let openUrl = rawopts.openUrl || rawopts.url || rawopts['open-url']
        let mediaUrl = rawopts.mediaUrl || rawopts['media-url']
        return { openUrl, mediaUrl }
      } else {
        let openUrl = rawopts.url || rawopts.openUrl || rawopts['open-url']
        if('undefined' !== typeof $rocket) return openUrl
        return { url: openUrl }
      }
    } else {
      return undefined
    }
  }
  console.log(title, subt, desc, toEnvOpts(opts))
  $notification.post(title, subt, desc, toEnvOpts(opts))
}
var _scriptSonverterOriginalDone = $done
var _scriptSonverterDone = (val = {}) => {
  let result
  if (
    (typeof $request !== 'undefined' &&
    typeof val === 'object' &&
    typeof val.status !== 'undefined' &&
    typeof val.headers !== 'undefined' &&
    typeof val.body !== 'undefined') || false
  ) {
    try {
      for (const part of val?.status?.split(' ')) {
        const statusCode = parseInt(part, 10)
        if (!isNaN(statusCode)) {
          val.status = statusCode
          break
        }
      }
    } catch (e) {}
    if (!val.status) {
      val.status = 200
    }
    if (!val.headers) {
      val.headers = {
        'Content-Type': 'text/plain; charset=UTF-8',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST,GET,OPTIONS,PUT,DELETE',
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
      }
    }
    result = { response: val }
  } else {
    result = val
  }
  console.log('$done')
  try {
    console.log(JSON.stringify(result))
  } catch (e) {
    console.log(result)
  }
  _scriptSonverterOriginalDone(result)
}
var window = globalThis
window.$done = _scriptSonverterDone
var global = globalThis
global.$done = _scriptSonverterDone

//2024.08.29   17:10

const targetPaths = [
  "zone_info.1.commerce",
  "zone_info.2.banner",
  "zone_info.0.common_func",
  "zone_info.3.game",
  "zone_info.4.auxiliary_func"
];

function deleteTargetPath(data, path) {
  let parts = path.split('.');
  let last = parts.pop();
  let obj = data;
  
  for (let part of parts) {
    if (obj && obj.hasOwnProperty(part)) {
      obj = obj[part];
    } else {
      return data;
    }
  }

  if (obj && obj.hasOwnProperty(last)) {
    delete obj[last];
  }

  return data;
}

const url = $request.url;
let obj;
try {
    obj = JSON.parse($response.body);
} catch (error) {
    console.error("JSON 解析错误：", error);
    _scriptSonverterDone({});
    return;
}

if (url.includes("/sidebar/home")) {
    delete obj.vip_banner;
    delete obj.tools;
}

if (url.includes("/frs/frsBottom")) {
    delete obj.card_activity.small_card;
    delete obj.card_activity.big_card;
    delete obj.ai_chatroom_guide;
}

if (url.includes("/user/profile")) {
    delete obj.banner;
    delete obj.duxiaoman_entry;
    delete obj.recom_naws_list;
    delete obj.vip_banner;
    delete obj.namoaixud_entry;
    
    targetPaths.forEach(path => {
        obj = deleteTargetPath(obj, path);
    });
}

if (obj.hasOwnProperty("user") && obj["user"].hasOwnProperty("user_growth")) {
    delete obj["user"]["user_growth"];
}

const typesToRemove = [60, 53, 58, 50, 10, 64, 51, 52, 55, 57, 62];

if (obj.custom_grid && Array.isArray(obj.custom_grid)) {
    obj.custom_grid = obj.custom_grid.filter(item => !typesToRemove.includes(item.type));
}

if (url.includes("/livefeed/feed")) {
    delete obj.data?.banner?.items;
}

_scriptSonverterDone({body: JSON.stringify(obj)});
} catch (e) {
  console.log('❌ Script Hub 兼容层捕获到原脚本未处理的错误')
  if (_scriptSonverterCompatibilityType) {
    console.log('⚠️ 故不修改本次' + (_scriptSonverterCompatibilityType === 'response' ? '响应' : '请求'))
  } else {
    console.log('⚠️ 因类型非请求或响应, 抛出错误')
  }
  console.log(e)
  if (_scriptSonverterCompatibilityType) {
    _scriptSonverterCompatibilityDone({})
  } else {
    throw e
  }
}
