'use strict';

import _ from 'lodash';
import Timeago from 'timeago.js';
import store from '../vuex/user';

let getCheck = {
    checkEmail(val) {
        var filter = /^([a-zA-Z0-9_\\.\\-])+\\@(([a-zA-Z0-9\\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        if (filter.test(val)) {
            return true;
        } else {
            return false;
        }
    },
    checkPhone(val) {
        var filter = /^1\d{10}$/;

        if (filter.test(val)) {
            return true;
        } else {
            return false;
        }
    }
};

/**
 * 从文本中提取出@username 标记的用户名数组
 * @param {String} text 文本内容
 * @return {Array} 用户名数组
 */
const fetchUsers = (text) => {
    if (!text) {
        return [];
    }

    var ignoreRegexs = [
        /```.+?```/g, // 去除单行的 ```
        /^```[\s\S]+?^```/gm, // ``` 里面的是 pre 标签内容
        /`[\s\S]+?`/g, // 同一行中，`some code` 中内容也不该被解析
        /^.*/gm, // 4个空格也是 pre 标签，在这里 . 不会匹配换行
        /\b\S*?@[^\s]*?\..+?\b/g, // somebody@gmail.com 会被去除
        /\[@.+?\\]\(\/.+?\)/g // 已经被 link 的 username
    ];

    ignoreRegexs.forEach((ignoreRegex) => {
        text = text.replace(ignoreRegex, '');
    });

    var results = text.match(/@[a-z0-9\-_]+\b/igm);
    var names = [];
    if (results) {
        for (var i = 0, l = results.length; i < l; i++) {
            var s = results[i];
            // remove leading char @
            s = s.slice(1);
            names.push(s);
        }
    }
    names = _.uniq(names);
    return names;
};

/**
 * 根据文本内容，替换为数据库中的数据
 * @param {String} text 文本内容
 * @param {Function} callback 回调函数
 */
const linkUsers = (text) => {
    var users = fetchUsers(text);
    for (var i = 0, l = users.length; i < l; i++) {
        var name = users[i];
        text = text.replace(new RegExp('@' + name + '\\b(?!\\])', 'g'), '[@' + name + '](/user/' + name + ')');
    }
    return text;
};

/**
 *   对Date的扩展，将 Date 转化为指定格式的String
 *   月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
 *   年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
 *   例子：
 *   (new Date()).Format('yyyy-MM-dd hh:mm:ss.S') ==> 2006-07-02 08:09:04.423
 *   (new Date()).Format('yyyy-M-d h:m:s.S')      ==> 2006-7-2 8:9:4.18
 */
const fmtDate = (date, fmt) => { // author: meizz
    var o = {
        'M+': date.getMonth() + 1, // 月份
        'd+': date.getDate(), // 日
        'h+': date.getHours(), // 小时
        'm+': date.getMinutes(), // 分
        's+': date.getSeconds(), // 秒
        'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
        'S': date.getMilliseconds() // 毫秒
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
        }
    }
    return fmt;
};

/**
 * 调用Timeago库显示到现在的时间
 */
const MillisecondToDate = (time) => {
    var str = '';
    if (time !== null && time !== '') {
        let timeagoInstance = new Timeago();
        str = timeagoInstance.format(time, 'zh_CN');
    }
    return str;
};

/**
 * 格式化日期或时间
 * @param {string} time 需要格式化的时间
 * @param {bool} friendly 是否是fromNow
 */
exports.getLastTimeStr = (time, friendly) => {
    if (friendly) {
        return MillisecondToDate(time);
    } else {
        return fmtDate(new Date(time), 'yyyy-MM-dd hh:mm');
    }
};

/**
 * 获取不同tab的信息
 * @param  {[type]}  tab     [tab分类]
 * @param  {[type]}  good    [是否是精华]
 * @param  {[type]}  top     [是否置顶]
 * @param  {Boolean} isClass [是否是样式]
 * @return {[type]}          [返回对应字符串]
 */
exports.getTabInfo = (tab, good, top, isClass) => {
    let str = '';
    let className = '';
    if (top) {
        str = '置顶';
        className = 'top';
    } else if (good) {
        str = '精华';
        className = 'good';
    } else {
        switch (tab) {
            case 'share':
                str = '分享';
                className = 'share';
                break;
            case 'ask':
                str = '问答';
                className = 'ask';
                break;
            case 'job':
                str = '招聘';
                className = 'job';
                break;
            default:
                str = '暂无';
                className = 'default';
                break;
        }
    }
    return isClass ? className : str;
};

/**
 * 配置节流函数
 * @param  {[Function]}  fn     [要执行的函数]
 * @param  {[Number]}  delay    [延迟执行的毫秒数]
 * @param  {[Number]}  mustRun  [至少多久执行一次]
 * @return {[Function]}         [节流函数]
 */
exports.throttle = (fn, wait, mustRun) => {
    let timeout;
    let startTime = new Date();
    return function() {
        let context = this;
        let args = arguments;
        let curTime = new Date();

        clearTimeout(timeout);
        // 如果达到了规定的触发时间间隔，触发 handler
        if (curTime - startTime >= mustRun) {
            fn.apply(context, args);
            startTime = curTime;
            // 没达到触发间隔，重新设定定时器
        } else {
            timeout = setTimeout(fn, wait);
        }
    };
};

/**
 * 获取请求地址
 */
exports.getServer = () => {
    return {query: {api: 'http://192.168.1.142:11180'}, doubleQuery: {api: 'http://192.168.1.148:11180'}, otherQuery: {api: 'http://192.168.1.151:8180'}, personId: 'http://10.35.252.178:11180'};
    // return {query: {api: 'http://10.35.128.210:11180'}, doubleQuery: {api: 'http://10.35.252.178:11180'}, otherQuery: {api: 'http://10.35.142.107:8180'}, personId: 'http://10.35.252.178:11180'};
};

/**
 * 封装ajax--payload
 * @param  {[object]}  obj     [ajax配置]
 */
exports.ajax = ($, opt) => {
    $.ajax({
        dataType: 'json',
        type: opt.type,
        url: opt.url,
        data: opt.data,
        success: opt.success,
        error: opt.error
    });
};

/**
 * 封装ajax--payload
 * @param  {[object]}  obj     [ajax配置]
 */
exports.ajaxPayload = ($, opt) => {
    $.ajax({
        contentType: 'application/json; charset=UTF-8',
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        dataType: 'json',
        type: opt.type,
        url: opt.url,
        data: JSON.stringify(opt.data),
        success: opt.success,
        error: opt.error
    });
};

/**
 * 封装ajax--payload
 * @param  {[object]}  obj     [ajax配置]
 */
exports.ajaxPayloadA = ($, opt) => {
    $.ajax({
        contentType: 'application/json; charset=UTF-8',
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        headers: {
            'token': store.state.userInfo.session_id
        },
        dataType: 'json',
        type: opt.type,
        url: opt.url,
        data: JSON.stringify(opt.data),
        success: opt.success,
        error: opt.error
    });
};

/**
 * 封装ajax--payload
 * @param  {[object]}  obj     [ajax配置]
 */
exports.ajaxPayloadB = ($, opt) => {
    $.ajax({
        contentType: 'application/json; charset=UTF-8',
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        headers: {
            'token': store.state.userInfo.session_id_double
        },
        dataType: 'json',
        type: opt.type,
        url: opt.url,
        data: JSON.stringify(opt.data),
        success: opt.success,
        error: opt.error
    });
};

/**
 * 设置cookie
 * @param  {[string]}  str
 * @param  {[string]}  str
 * *
 */
exports.setCookie = (name, string) => {
    var exdate = new Date();
    var expiredays = 365 * 86400000;
    exdate.setDate(exdate.getDate() + expiredays);
    document.cookie = name + '=' + escape(string) + ((expiredays == null) ? '' : ';expires=' + exdate.toGMTString());
};

/**
 * 读取cookie
 * @param  {[object]}  obj     [ajax配置]
 */
exports.getCookie = (name) => {
    var nameEQ = name + '=';
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1, c.length);
        }
        if (c.indexOf(nameEQ) === 0) {
            return unescape(c.substring(nameEQ.length, c.length));
        }
    }
    return false;
};

/**
 * 删除cookie
 * @param  {[object]}  obj     [ajax配置]
 */
exports.delCookie = (name) => {
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);

    var arr, reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)'), cval;
    arr = document.cookie.match(reg);
    if(arr) {
        cval = unescape(arr[2]);
    } else{
        cval = null;
    }
    if(cval != null) {
        document.cookie = name + '=' + cval + ';expires=' + exp.toGMTString();
    }
};

/**
 * 获取图片base64_uri
 * @param  {[str]}  string
 */
exports.convertBase64 = (url, uri) => {
    return url + '/storage/v1/image?uri_base64=' + btoa(uri);
};

/**
 * md5加密
 * @param  {[str]}  obj     [ajax配置]
 */
exports.md5 = (str) => {
    if (str === null) {
        return null;
    }
    var xl;
    var rotateLeft = function(lValue, iShiftBits) {
        return lValue << iShiftBits | lValue >>> 32 - iShiftBits;
    };
    var addUnsigned = function(lX, lY) {
        var lX4, lY4, lX8, lY8, lResult;
        lX8 = lX & 2147483648;
        lY8 = lY & 2147483648;
        lX4 = lX & 1073741824;
        lY4 = lY & 1073741824;
        lResult = (lX & 1073741823) + (lY & 1073741823);
        if (lX4 & lY4) {
            return lResult ^ 2147483648 ^ lX8 ^ lY8;
        }
        if (lX4 | lY4) {
            if (lResult & 1073741824) {
                return lResult ^ 3221225472 ^ lX8 ^ lY8;
            } else {
                return lResult ^ 1073741824 ^ lX8 ^ lY8;
            }
        } else {
            return lResult ^ lX8 ^ lY8;
        }
    };
    var _F = function(x, y, z) {
        return x & y | ~x & z;
    };
    var _G = function(x, y, z) {
        return x & z | y & ~z;
    };
    var _H = function(x, y, z) {
        return x ^ y ^ z;
    };
    var _I = function(x, y, z) {
        return y ^ (x | ~z);
    };
    var _FF = function(a, b, c, d, x, s, ac) {
        a = addUnsigned(a, addUnsigned(addUnsigned(_F(b, c, d), x), ac));
        return addUnsigned(rotateLeft(a, s), b);
    };
    var _GG = function(a, b, c, d, x, s, ac) {
        a = addUnsigned(a, addUnsigned(addUnsigned(_G(b, c, d), x), ac));
        return addUnsigned(rotateLeft(a, s), b);
    };
    var _HH = function(a, b, c, d, x, s, ac) {
        a = addUnsigned(a, addUnsigned(addUnsigned(_H(b, c, d), x), ac));
        return addUnsigned(rotateLeft(a, s), b);
    };
    var _II = function(a, b, c, d, x, s, ac) {
        a = addUnsigned(a, addUnsigned(addUnsigned(_I(b, c, d), x), ac));
        return addUnsigned(rotateLeft(a, s), b);
    };
    var convertToWordArray = function(str) {
        var lWordCount;
        var lMessageLength = str.length;
        var lNumberOfWordsTemp1 = lMessageLength + 8;
        var lNumberOfWordsTemp2 = (lNumberOfWordsTemp1 - lNumberOfWordsTemp1 % 64) / 64;
        var lNumberOfWords = (lNumberOfWordsTemp2 + 1) * 16;
        var lWordArray = new Array(lNumberOfWords - 1);
        var lBytePosition = 0;
        var lByteCount = 0;
        while (lByteCount < lMessageLength) {
            lWordCount = (lByteCount - lByteCount % 4) / 4;
            lBytePosition = lByteCount % 4 * 8;
            lWordArray[lWordCount] = lWordArray[lWordCount] | str.charCodeAt(lByteCount) << lBytePosition;
            lByteCount++;
        }
        lWordCount = (lByteCount - lByteCount % 4) / 4;
        lBytePosition = lByteCount % 4 * 8;
        lWordArray[lWordCount] = lWordArray[lWordCount] | 128 << lBytePosition;
        lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
        lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
        return lWordArray;
    };
    var wordToHex = function(lValue) {
        var wordToHexValue = '', wordToHexValueTemp = '', lByte, lCount;
        for (lCount = 0; lCount <= 3; lCount++) {
            lByte = lValue >>> lCount * 8 & 255;
            wordToHexValueTemp = '0' + lByte.toString(16);
            wordToHexValue = wordToHexValue + wordToHexValueTemp.substr(wordToHexValueTemp.length - 2, 2);
        }
        return wordToHexValue;
    };
    var x = [], k, AA, BB, CC, DD, a, b, c, d, S11 = 7, S12 = 12, S13 = 17, S14 = 22, S21 = 5, S22 = 9, S23 = 14, S24 = 20, S31 = 4, S32 = 11, S33 = 16, S34 = 23, S41 = 6, S42 = 10, S43 = 15, S44 = 21;
    x = convertToWordArray(str);
    a = 1732584193;
    b = 4023233417;
    c = 2562383102;
    d = 271733878;
    xl = x.length;
    for (k = 0; k < xl; k += 16) {
        AA = a;
        BB = b;
        CC = c;
        DD = d;
        a = _FF(a, b, c, d, x[k + 0], S11, 3614090360);
        d = _FF(d, a, b, c, x[k + 1], S12, 3905402710);
        c = _FF(c, d, a, b, x[k + 2], S13, 606105819);
        b = _FF(b, c, d, a, x[k + 3], S14, 3250441966);
        a = _FF(a, b, c, d, x[k + 4], S11, 4118548399);
        d = _FF(d, a, b, c, x[k + 5], S12, 1200080426);
        c = _FF(c, d, a, b, x[k + 6], S13, 2821735955);
        b = _FF(b, c, d, a, x[k + 7], S14, 4249261313);
        a = _FF(a, b, c, d, x[k + 8], S11, 1770035416);
        d = _FF(d, a, b, c, x[k + 9], S12, 2336552879);
        c = _FF(c, d, a, b, x[k + 10], S13, 4294925233);
        b = _FF(b, c, d, a, x[k + 11], S14, 2304563134);
        a = _FF(a, b, c, d, x[k + 12], S11, 1804603682);
        d = _FF(d, a, b, c, x[k + 13], S12, 4254626195);
        c = _FF(c, d, a, b, x[k + 14], S13, 2792965006);
        b = _FF(b, c, d, a, x[k + 15], S14, 1236535329);
        a = _GG(a, b, c, d, x[k + 1], S21, 4129170786);
        d = _GG(d, a, b, c, x[k + 6], S22, 3225465664);
        c = _GG(c, d, a, b, x[k + 11], S23, 643717713);
        b = _GG(b, c, d, a, x[k + 0], S24, 3921069994);
        a = _GG(a, b, c, d, x[k + 5], S21, 3593408605);
        d = _GG(d, a, b, c, x[k + 10], S22, 38016083);
        c = _GG(c, d, a, b, x[k + 15], S23, 3634488961);
        b = _GG(b, c, d, a, x[k + 4], S24, 3889429448);
        a = _GG(a, b, c, d, x[k + 9], S21, 568446438);
        d = _GG(d, a, b, c, x[k + 14], S22, 3275163606);
        c = _GG(c, d, a, b, x[k + 3], S23, 4107603335);
        b = _GG(b, c, d, a, x[k + 8], S24, 1163531501);
        a = _GG(a, b, c, d, x[k + 13], S21, 2850285829);
        d = _GG(d, a, b, c, x[k + 2], S22, 4243563512);
        c = _GG(c, d, a, b, x[k + 7], S23, 1735328473);
        b = _GG(b, c, d, a, x[k + 12], S24, 2368359562);
        a = _HH(a, b, c, d, x[k + 5], S31, 4294588738);
        d = _HH(d, a, b, c, x[k + 8], S32, 2272392833);
        c = _HH(c, d, a, b, x[k + 11], S33, 1839030562);
        b = _HH(b, c, d, a, x[k + 14], S34, 4259657740);
        a = _HH(a, b, c, d, x[k + 1], S31, 2763975236);
        d = _HH(d, a, b, c, x[k + 4], S32, 1272893353);
        c = _HH(c, d, a, b, x[k + 7], S33, 4139469664);
        b = _HH(b, c, d, a, x[k + 10], S34, 3200236656);
        a = _HH(a, b, c, d, x[k + 13], S31, 681279174);
        d = _HH(d, a, b, c, x[k + 0], S32, 3936430074);
        c = _HH(c, d, a, b, x[k + 3], S33, 3572445317);
        b = _HH(b, c, d, a, x[k + 6], S34, 76029189);
        a = _HH(a, b, c, d, x[k + 9], S31, 3654602809);
        d = _HH(d, a, b, c, x[k + 12], S32, 3873151461);
        c = _HH(c, d, a, b, x[k + 15], S33, 530742520);
        b = _HH(b, c, d, a, x[k + 2], S34, 3299628645);
        a = _II(a, b, c, d, x[k + 0], S41, 4096336452);
        d = _II(d, a, b, c, x[k + 7], S42, 1126891415);
        c = _II(c, d, a, b, x[k + 14], S43, 2878612391);
        b = _II(b, c, d, a, x[k + 5], S44, 4237533241);
        a = _II(a, b, c, d, x[k + 12], S41, 1700485571);
        d = _II(d, a, b, c, x[k + 3], S42, 2399980690);
        c = _II(c, d, a, b, x[k + 10], S43, 4293915773);
        b = _II(b, c, d, a, x[k + 1], S44, 2240044497);
        a = _II(a, b, c, d, x[k + 8], S41, 1873313359);
        d = _II(d, a, b, c, x[k + 15], S42, 4264355552);
        c = _II(c, d, a, b, x[k + 6], S43, 2734768916);
        b = _II(b, c, d, a, x[k + 13], S44, 1309151649);
        a = _II(a, b, c, d, x[k + 4], S41, 4149444226);
        d = _II(d, a, b, c, x[k + 11], S42, 3174756917);
        c = _II(c, d, a, b, x[k + 2], S43, 718787259);
        b = _II(b, c, d, a, x[k + 9], S44, 3951481745);
        a = addUnsigned(a, AA);
        b = addUnsigned(b, BB);
        c = addUnsigned(c, CC);
        d = addUnsigned(d, DD);
    }
    var temp = wordToHex(a) + wordToHex(b) + wordToHex(c) + wordToHex(d);
    return temp.toLowerCase();
};

/**
 * @description 格式化时间yyyy-mm-dd形式
 *  @param timestamp
 * @returns {string}
 */
exports.getDate = (timestamp) => {
    timestamp = parseInt(timestamp);
    var day = new Date(timestamp),
        Year = 0,
        Month = 0,
        Day = 0,
        CurrentDate = '';
    // 初始化时间
    Year = day.getFullYear();
    Month = day.getMonth() + 1;
    Day = day.getDate();
    CurrentDate += Year + '-';
    if (Month >= 10) {
        CurrentDate += Month + '-';
    } else {
        CurrentDate += '0' + Month + '-';
    }
    if (Day >= 10) {
        CurrentDate += Day;
    } else {
        CurrentDate += '0' + Day;
    }
    return CurrentDate;
};

/**
 * @description 格式化时间H:M形式
 * @param timestamp
 * @returns {string}
 */
exports.getTime = (timestamp) => {
    timestamp = parseInt(timestamp);
    var day = new Date(timestamp),
        CurrentDate = '',
        h = day.getHours(),
        m = day.getMinutes();
    if (h >= 10) {
        CurrentDate += h + ':';
    } else {
        CurrentDate += '0' + h + ':';
    }
    if (m >= 10) {
        CurrentDate += m;
    } else {
        CurrentDate += '0' + m;
    }
    return CurrentDate;
};

exports.linkUsers = linkUsers;
exports.fetchUsers = fetchUsers;
exports.getCheck = getCheck;
exports.fmtDate = fmtDate;
exports.MillisecondToDate = MillisecondToDate;
