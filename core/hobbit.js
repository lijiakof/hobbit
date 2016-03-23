/// <reference path="zepto.js" />
var Hobbit = window.Hobbit = window.$H = (function () {
    $H = function () { };
    $H.config = {};
    /**测试测试
    * @desc 检测设备系统和浏览器的类型及版本。
    *
    * @ua userAgent字符串（非必选，不指定则使用当前浏览器的navigator.userAgent）
    * @return 返回结果是UAI对象，格式为： { os: 系统类型, ov: 系统版本, bs: 浏览器类型, bv: 浏览器版本 }
    *
    * @备注：该函数不会读缓存，若频繁调用$H.os.type()、ver()，请使用，类型为字符串类型（全部类型参见系统类型表），版本为浮点数字类型（忽略第二个点之后的版本号）
    */
    $H.detect = function (ua) {
        ua = ua || navigator.userAgent;
        var match = function (k) {
            var t = "unknown", v = 0;
            for (var m, i = 0; i < k.length; i++)
                if (m = ua.match(new RegExp("(" + k[i][1] + ")[^\\d_.]*(\\d+[._]?\\d*)?", "i"))) {
                    t = k[i][0];
                    v = parseFloat(m[2]);
                    v = isNaN(v) ? 0 : v;
                    break;
                }
            return { type: t, ver: v };
        };
        os = match([["windowsphone", "Windows\\s?Phone|WPOS"], ["android", "Android"], ["iosipad", "iPad"], ["iosipod", "iPod"], ["iosiphone", "iPhone\\sOS"], ["windowsmobile", "Windows\\s?Mobile"], ["windowspc", "Windows"], ["symbian", "Series60|Symbian|Nokia"], ["blackberry", "BlackBerry"], ["macpc", "Macintosh|Mac\\s?OS"]]);
        bs = match([["chrome", "Chrome|CriOS"], ["ie", "MSIE|IEMobile"], ["weixin", "MicroMessenger"], ["miuiyp", "MiuiYellowPage"], ["qq", "QQBrowser"], ["uc", "UCBrowser|UCWEB|JUC|\\sUC\\s"], ["firefox", "Firefox"], ["opera", "Opera"], ["safari", "Mac\\s?OS.*Safari"], ["native", "Android.*WebKit"]]);
        return $H.detect.cache = { os: os.type, ov: os.ver, bs: bs.type, bv: bs.ver };
    };
    $H.os = {
        type: function () { return ($H.detect.cache || $H.detect()).os; },
        ver: function () { return ($H.detect.cache || $H.detect()).ov; },
        online: function () { return navigator.onLine; }
    };
    $H.browser = {
        ua: navigator.userAgent,
        type: function () { return ($H.detect.cache || $H.detect()).bs; },
        ver: function () { return ($H.detect.cache || $H.detect()).bv; },
        height: function () { return $(window).height(); },
        width: function () { return $(window).width(); },
        hideAddressBar: function () {
            //if($.browser.webkit)
            $H.browser.scrollTop();
        },
        scrollTop: function (zep, offset) {
            if (zep)
                window.scrollTo(0, zep.offset().top + (offset || 0));
            else window.scrollTo(0, (offset || 1));
        },
        discrollable: function (selector) {
            var zep = selector ? $(selector) : $(window);
            zep.on("touchmove", $H.browser.preventEvent);
            var s = document.body.style; s.overflowX = s.overflowY = "hidden";
        },
        scrollable: function (selector) {
            var zep = selector ? $(selector) : $(window);
            zep.off("touchmove", $H.browser.preventEvent);
            var s = document.body.style; s.overflowX = s.overflowY = null;
        },
        preventEvent: function (e) {
            e.preventDefault();
        }
    };
    $H.json = {
        stringify: function (json) {
            if (typeof json != "object")
                return json;

            var s = null;
            try {
                s = window.JSON.stringify(json);
            }
            catch (e) {
                console.error(e);
            }

            return s;
        },
        parse: function (string) {
            var j = null;
            try {
                j = window.JSON.parse(string);
            }
            catch (e) {
                console.error(e);
            }

            return j;
        }
    };
    $H.url = {
        parse: function (href) {
            var data = {
                href: "",
                host: "",
                hostname: "",
                pathname: "",
                port: "",
                query: {},
                hash: "",
                search: ""
            };

            function dotQuery(href) {
                var num = 0;
                for (var i = 0; i < href.length; i++) {
                    if (href.charAt(i) == ".") {
                        num++;
                    } else {
                        return num;
                    }
                }
            }

            function relativeUrl(href) {
                var reg = /^(\.{0,}\/{0,})/,
                    dot = dotQuery(href),
                    newUrl = "";

                if (dot < 2) {
                    newUrl = currUrl.href.split("://")[0] + "://" + currUrl.host + currUrl.pathname + href.replace(reg, "");
                } else {
                    var currUrlArr = [];
                    currUrlArr = currUrl.pathname.split("/");

                    if (currUrlArr.length - 2 > dot - 1) {
                        var newPath = "/";
                        for (var i = 1; i < currUrlArr.length - dot - 2; i++) {
                            newPath += currUrlArr[i] + "/";
                        };
                        newUrl = currUrl.href.split("://")[0] + "://" + currUrl.host + newPath + href.replace(reg, "");
                    } else {
                        newUrl = currUrl.href.split("://")[0] + "://" + currUrl.host + "/" + href.replace(reg, "");
                    }
                }
                return newUrl;
            }

            var currUrl = window.location;
            if (href && href.length > 0) {
                var domainReg = /^\w+\./;
                if (href.split("://")[1]) {
                    data.href = href;
                } else if (domainReg.test(href)) {
                    data.href = currUrl.href.split("://")[0] + "://" + href;
                } else {
                    data.href = relativeUrl(href);
                }

                var urlArr = data.href.split("?");

                data.hostname = urlArr[0].split("://")[1].split(/\:|\/|\#/)[0];
                data.port = data.href.split(":")[2] ? data.href.split(":")[2].split(/\/|\?|\#/)[0] : "";
                data.host = data.port ? data.hostname + ":" + data.port : data.hostname;
                data.pathname = data.href.split("://")[1].substring(data.host.length).split(/\?|\#/)[0];
                data.hash = data.href.split("#")[1] ? "#" + data.href.split("#")[1] : "";
                data.search = urlArr[1] ? "?" + urlArr[1].split("#")[0] : "";
                data.query = $H.url.query(data.href);

                //  正则表达式版本敬请期待

            } else {
                data.href = currUrl.href;
                data.host = currUrl.host;
                data.hostname = currUrl.hostname;
                data.pathname = currUrl.pathname;
                data.port = currUrl.port;
                data.hash = currUrl.hash;
                data.search = currUrl.search;
                data.query = $H.url.query(data.href);
            };

            return data;
        },
        href: function (url, query, hash) {
            var url = url ? url : window.location.href,
                query = query || {},
                currQuery = $H.url.parse(url).query,
                newUrl = "",
                newQuery = "",
                newHash = "";

            function isEmpty(obj) {
                for (var i in obj)
                    return false;
                return true;
            }
            if (!isEmpty(currQuery)) {
                for (var i in query) {
                    for (var j in currQuery) {
                        if (i == j) {
                            currQuery[j] = query[i];
                        } else {
                            currQuery[i] = query[i];
                        };
                    }
                }
            } else {
                currQuery = query;
            };
            for (var k in currQuery) {
                currQuery[k] = currQuery[k] || "";
                newQuery += k + "=" + currQuery[k] + "&";
            }
            newQuery = newQuery.substring(0, newQuery.length - 1);
            newUrl = newQuery ? url.split(/\?|\#/)[0] + "?" + newQuery : url.split("?")[0];

            if (typeof (hash) == undefined) {
                newHash = url.split("#")[1] ? "#" + url.split("#")[1] : "";
                newUrl = newUrl + newHash;
            } else {
                newHash = hash ? "#" + hash : "";
                newUrl = newUrl + newHash;
            };

            return newUrl;
        },
        query: function (href) {
            var args = {},
                queryArr = [],
                queryArrItem = [],
                name, value,
                href = href || window.location.href,
                queryStr = href.split("?")[1] ? href.split("?")[1].split("#")[0] ? href.split("?")[1].split("#")[0] : "" : "";
            if (queryStr == "") {
                return {};
            } else {
                queryArr = queryStr.split("&");
                for (var i = queryArr.length - 1; i >= 0; i--) {
                    queryArrItem = queryArr[i].split("=");
                    name = decodeURIComponent(queryArrItem[0]);
                    value = decodeURIComponent(queryArrItem[1]);
                    args[name] = value || "";
                };
                return args;
            };
        }
    };
    $H.hash = function (string) {
        var hash = 1315423911, i, ch;
        for (i = string.length - 1; i >= 0; i--) {
            ch = string.charCodeAt(i);
            hash ^= ((hash << 5) + ch + (hash >> 2));
        }
        return (hash & 0x7FFFFFFF);
    };
    $H.parseDom = function (html) {
        var parser = new DOMParser();
        var doc = parser.parseFromString(html, "text/html");
        if (doc == null) {
            doc = document.implementation.createHTMLDocument("");
            doc.documentElement.innerHTML = html;
        }
        return doc;
    };
    $H.geo = function (options) {
        options = $.extend({
            expires: 60,
            timeout: 30,
            enableHighAccuracy: false,
            before: function () { },
            success: function () { },
            error: function () { },
            complete: function () { }
        }, options);

        if (navigator.geolocation) {
            options.before();

            navigator.geolocation.getCurrentPosition(
                function (p) {
                    options.success(p.coords);
                    options.complete();
                },
                function (code) {
                    options.error(code);
                    //1=PERMISSION_DENIED:表示没有权限使用地理定位API
                    //2=POSITION_UNAVAILABLE:表示无法确定设备的位置，例如一个或多个的用于定位采集程序报告了一个内部错误导致了全部过程的失败
                    //3=TIMEOUT:表示超时

                    options.complete();
                },
                {
                    maximumAge: options.expires * 1000,
                    enableHighAccuracy: options.enableHighAccuracy,
                    timeout: options.timeout * 1000
                });
        }

        return navigator.geolocation;
    };
    //url, data, type, target
    $H.submit = function (options) {
        options = $.extend({
            url: "",
            data: null,
            type: "POST",
            target: "_self"
        }, options);

        var form = $("<form>").hide().attr({
            method: options.type,
            action: options.url,
            data: options.data,
            target: options.target
        }).appendTo(document.body);

        if (options.data)
            for (var i in options.data)
                $("<input>").attr({
                    type: "hidden",
                    name: i,
                    value: options.data[i]
                }).appendTo(form);

        form[0].submit();
        form.remove();
    };
    $H.ajax = function (options) {
        options = $.extend({
            type: "GET",
            url: "",
            timeout: 30,
            data: null,
            dataType: "html",
            expires: 0,
            context: null,
            beforeSend: function () { },
            complete: function () { },
            success: function () { },
            error: function () { }
        }, options);

        //Expires time（second，>0为过期时间，如果不设置或者<=0则没有缓存）
        var t;
        if (isNaN(options.expires) || (options.expires <= 0)) {
            t = new Date().getTime();
        }
        else {
            t = parseInt(new Date().getTime() / (1000 * options.expires), 10);
        }
        options.url = $H.url.href(options.url, { "t": t });

        //Time out
        var tout = options.timeout;
        tout = ((!isNaN(tout) && tout > 0) ? tout : 30) * 1000;

        //dataType:"json", "jsonp", "xml", "html", or "text"
        return $.ajax({
            type: options.type.toUpperCase(),
            url: options.url,
            timeout: tout,
            data: options.data,
            dataType: options.dataType.toLowerCase(),
            context: options.context,
            beforeSend: options.beforeSend,
            // status: "success", "notmodified", "error", "timeout", "abort", "parsererror"
            complete: options.complete,
            success: options.success,
            // type: "timeout", "error", "abort", "parsererror"
            error: options.error
        });
    };
    $H.loadCss = function (options) {
        options = $.extend({
            url: [],
            success: function () { },
            error: function () { }
        }, options);
        options.url = $.isArray(options.url) ? options.url : [options.url];
        var count = 0, load = function (url, success, error) {
            var c = document.createElement("link");
            c.rel = "stylesheet";
            c.type = "text/css";
            c.onload = function () {
                if (++count >= options.url.length)
                    options.success();
            };
            c.onerror = function () {
                count--;
                options.error(c);
            };
            c.href = url;
            document.head.insertBefore(c, null);
        };
        for (var i = 0; i < options.url.length; i++)
            load(options.url[i]);
    };
    $H.loadScript = function (options) {
        options = $.extend({
            url: [],
            success: function () { },
            error: function () { }
        }, options);
        options.url = $.isArray(options.url) ? options.url : [options.url];

        var count = 0, load = function (url, success, error) {
            var s = document.createElement("script");
            s.type = 'text/javascript';
            if (options.async)
                s.async = "async";
            s.onreadystatechange = function () {
                if (!s.readyState || "loaded|complete".indexOf(s.readyState) != -1) {
                    s.onload = s.onreadystatechange = null;
                    if (++count >= options.url.length)
                        options.success();
                }
            };
            s.onload = function () {
                s.onload = s.onreadystatechange = null;
                if (++count >= options.url.length)
                    options.success();
            };
            s.onerror = function () {
                count--;
                options.error(s);
            };
            s.src = url;
            document.head.insertBefore(s, null);
        };
        for (var i = 0; i < options.url.length; i++)
            load(options.url[i]);
    };
    $H.load = function (options) {
        options = $.extend({
            resource: [],
            success: function () { },
            error: function () { }
        }, options);
        options.resource = $.isArray(options.resource) ? options.resource : [options.resource];
        var count = 0, onsuccess = function () {
            if (++count >= options.resource.length)
                options.success();
        }, onerror = function (r) {
            count--;
            options.error(r);
        };
        for (var i = 0; i < options.resource.length; i++) {
            switch (options.resource[i].type) {
                case "script":
                    $H.loadScript({
                        url: options.resource[i].url,
                        success: onsuccess,
                        error: onerror
                    });
                    break;
                case "css":
                    $H.loadCss({
                        url: options.resource[i].url,
                        success: onsuccess,
                        error: onerror
                    });
                    break;
                    //img,html
            }
        }
    };
    $H.cookie = {
        get: function (key) {
            if (!key)
                return null;
            key = key.toUpperCase();
            var cks = document.cookie.split("; ");
            var tmp = null;
            for (var i = 0; i < cks.length; i++) {
                tmp = cks[i].split("=");
                if (tmp[0].toUpperCase() == key)
                    return decodeURIComponent(tmp[1]);
            }
            return null;
        },
        set: function (options) {
            options = $.extend({
                key: "",
                value: "",
                expires: 0,
                path: "",
                domain: document.domain
            }, options);

            var ck = [options.key + "=" + encodeURIComponent(options.value)];
            if (!isNaN(options.expires) && options.expires == 0) {//为0时不设定过期时间，浏览器关闭时cookie自动消失
                var date = new Date();
                date.setTime(date.getTime() + options.expires * 1000);
                ck.push(";expires=" + date.toGMTString());
            }

            ck.push(";path=" + (options.path || "/"));
            if (options.domain && options.domain.toLowerCase() !== "localhost")
                ck.push(";domain=" + options.domain);
            document.cookie = ck.join("");
        },
        remove: function (options) {
            options = $.extend({
                key: "",
                path: "",
                domain: document.domain
            }, options);
            var date = new Date();
            date.setTime(date.getTime() - 999999);
            options.expires = date;
            $H.cookie.set(options);
            //document.cookie = options.key + "=;expires=" + date.toGMTString() + ";path=" + (options.path || "/") + ";domain=" + ((options.domain) || document.domain);
        }
    };
    $H.storage = {
        self: window.localStorage,
        setCnts: 0,
        get: function (key) {
            var ls = $H.storage.self;

            if (key && ls) {
                if (key.length > 64) key = $H.hash(key);

                //浏览器关闭 localStorage
                var value = null;
                try {
                    value = ls.getItem(key);
                }
                catch (e) {
                    console.error(e);
                }

                var item = $H.json.parse(value);

                if (item && item.exp && !isNaN(item.exp) && item.exp < new Date().getTime()) {
                    $H.storage.remove(key);
                    return null;
                }

                return item && item.val;
            }
            return null;
        },
        set: function (options) {
            options = $.extend({
                key: null,
                value: "",
                expires: 360
            }, options);

            var ls = $H.storage.self;
            if (options.key && ls) {
                if (++$H.storage.setCnts % 20 == 0)
                    $H.storage.recycle();

                options = options || {};

                if (isNaN(options.expires))
                    options.expires = 360;

                if (options.key.length > 64)
                    options.key = $H.hash(options.key);

                var item = {
                    exp: (options.expires * 1000) + new Date().getTime(),
                    val: options.value
                };
                //浏览器关闭 localStorage
                try {
                    ls.setItem(options.key, $H.json.stringify(item));
                }
                catch (e) { console.error(e); }
            }
        },
        remove: function (key) {
            var ls = $H.storage.self;
            if (ls) {
                if (key.length > 64) key = $H.hash(key);

                //浏览器关闭 localStorage
                try {
                    ls.removeItem(key);
                }
                catch (e) { console.error(e); }
            }
        },
        recycle: function () {
            var ls = $H.storage.self;
            if (ls) {
                for (var i = 0; i < ls.length; i++) {
                    var key = ls.key(i);

                    var value = ls.getItem(key);
                    var item = $H.json.parse(value);
                    if (item && item.exp && !isNaN(item.exp) && item.exp < new Date().getTime())
                        $H.storage.remove(key);
                }
            }
        },
        clear: function () {
            var ls = $H.storage.self;
            if (ls) {
                //浏览器关闭 localStorage
                try {
                    ls.clear();
                }
                catch (e) { console.error(e); }
            }
        }
    };
    $H.session = {
        self: window.sessionStorage,
        get: function (key) {
            var ss = $H.session.self;
            if (key && ss) {
                if (key.length > 64) key = $H.hash(key);

                //浏览器关闭 sessionStorage
                var value = null;
                try {
                    value = ss.getItem(key);
                }
                catch (e) {
                    console.error(e);
                }

                return value;
            }
            return null;
        },
        set: function (options) {
            options = $.extend({
                key: null,
                value: ""
            }, options);

            var ss = $H.session.self;
            if (options.key && ss) {

                if (options.key.length > 64)
                    options.key = $H.hash(options.key);

                //浏览器关闭 sessionStorage
                try {
                    ss.setItem(options.key, options.value);
                }
                catch (e) { console.error(e); }
            }
        },
        remove: function (key) {
            var ss = $H.session.self;
            if (ss) {
                if (key.length > 64) key = $H.hash(key);

                //浏览器关闭 sessionStorage
                try {
                    ss.removeItem(key);
                }
                catch (e) { console.error(e); }
            }
        },
        clear: function () {
            //浏览器关闭 sessionStorage
            try {
                $H.session.self.clear();
            }
            catch (e) { console.error(e); }
        }
    };
    /**
    * @desc 减少执行频率, 多次调用，在指定的时间内，只会执行一次。
    * **options:**
    * - ***delay***: 延时时间
    * - ***fn***: 被稀释的方法
    * - ***debounce_mode***: 是否开启防震动模式, true:start, false:end, 如果不传此参数的按延时时间定时执行。
    *
    * <code type="text">||||||||||||||||||||||||| (空闲) |||||||||||||||||||||||||
    * X    X    X    X    X    X      X    X    X    X    X    X</code>
    *
    * @grammar $.throttle(delay, fn) ⇒ function
    * @name $.throttle
    * @example var touchmoveHander = function(){
    *     //....
    * }
    * //绑定事件
    * $(document).bind('touchmove', $.throttle(250, touchmoveHander));//频繁滚动，每250ms，执行一次touchmoveHandler
    *
    * //解绑事件
    * $(document).unbind('touchmove', touchmoveHander);//注意这里面unbind还是touchmoveHander,而不是$.throttle返回的function, 当然unbind那个也是一样的效果
    *
    */
    $H.throttle = function (options) {
        options = $.extend({
            delay: 250,
            fn: function () { },
            debounce: undefined
        }, options);

        var last = 0, timeId;

        if (typeof options.fn !== 'function') {
            options.debounce = true;
            options.fn = new function () { };
            options.delay = 250;
        }

        function wrapper() {
            var that = this,
                    period = Date.now() - last,
                    args = arguments;

            function exec() {
                last = Date.now();
                options.fn.apply(that, args);
            };

            function clear() {
                timeId = undefined;
            };

            if (options.debounce && !timeId) {
                // debounce模式 && 第一次调用
                exec();
            }

            timeId && clearTimeout(timeId);
            if (options.debounce === undefined && period > options.delay) {
                // throttle, 执行到了delay时间
                exec();
            } else {
                // debounce, 如果是start就clearTimeout
                timeId = setTimeout(options.debounce ? clear : exec, options.debounce === undefined ? options.delay - period : options.delay);
            }
        };
        // for event bind | unbind
        wrapper._zid = options.fn._zid = options.fn._zid || $.proxy(options.fn)._zid;
        return wrapper;
    };

    $H.event = {
        hash: (function () {
            var callbacks = {};
            var stateCallback = null;
            var bufferState = null;
            var getAllState = function () {
                var hstr = window.location.href.split("#");
                return hstr.length > 1 ? hstr[1] : "";
            };
            var getCurrentState = function () {
                var state = getAllState(),
                    idx = state.lastIndexOf("/"),
                    name = state.substr(idx == -1 ? 0 : (idx + 1)).split("="),
                    value = name.length > 1 ? name[1] : "";
                return { "name": name[0].toLowerCase(), "value": value };
            };
            var init = (function () {
                currentState = getCurrentState();

                $(window).on("hashchange", function () {
                    currentState = getCurrentState();

                    if (bufferState != null) {
                        var hash = getAllState() + (bufferState ? ("/" + bufferState) : "");
                        bufferState = null;
                        location.hash = hash;
                    } else {
                        if (callbacks[currentState.name])
                            callbacks[currentState.name](currentState.value);
                    }

                    if (stateCallback) {
                        stateCallback(currentState.name, currentState.value);
                        stateCallback = null;
                    }
                });
            })();

            var h = function () { };

            h.on = function (name, callback) {
                name = (name || "").toLowerCase();
                callbacks[name] = callback;
                if (currentState.name == name)
                    setTimeout(function () {
                        callback(currentState.value);
                    }, 0);
            };
            h.pushState = function (opt) {
                if (!opt || !opt.name)
                    return;

                opt.value = opt.value ? encodeURIComponent(opt.value) : "";
                if (currentState.name == opt.name.toLowerCase() && currentState.value == opt.value)
                    return;

                var state = opt.name + (opt.value ? ("=" + opt.value) : "");

                if (opt.callback)
                    stateCallback = opt.callback;
                location.hash = getAllState() + "/" + state;
            };

            h.popState = function (opt) {
                var states = getAllState().split("/");
                var len = states.length;
                if (len == 1)
                    h.replaceState(opt);
                else {
                    if (opt && opt.name != undefined) {
                        var go = -1, state = (opt.name + (opt.value ? ("=" + opt.value) : "")).toLowerCase();
                        for (var i = 0; i < len; i++) {
                            if (state == states[len - i - 1].toLowerCase()) {
                                go = i;
                                break;
                            }
                        }
                        if (go == -1)
                            h.replaceState(opt);
                        else if (go > 0) {
                            if (opt.callback)
                                stateCallback = opt.callback;
                            history.go(-1 * go);
                        }
                    } else {
                        if (opt.callback)
                            stateCallback = opt.callback;
                        history.go(-1);
                    }
                }
            };

            h.replaceState = function (opt) {
                if (!opt || !opt.name)
                    return;

                opt.value = opt.value ? encodeURIComponent(opt.value) : "";
                if (currentState.name == opt.name.toLowerCase() && currentState.value == opt.value)
                    return;

                var state = opt.name + (opt.value ? ("=" + opt.value) : "");
                var states = getAllState().split("/");
                if (states.length == 1) {
                    if (opt.callback)
                        stateCallback = opt.callback;
                    location.replace(location.href.split("#")[0] + (state ? ("#" + state) : ""));
                } else {
                    if (opt.callback)
                        stateCallback = opt.callback;
                    history.go(-1);
                    bufferState = state;
                }
            };

            h.getValue = function (name) {
                var state = getAllState();
                state = state.split("/");
                name = name.toLowerCase();
                for (var i = 0, tmp = null; i < state.length; i++) {
                    tmp = state[i].split('=');
                    if (name == tmp[0].toLowerCase())
                        return tmp.length == 2 ? tmp[1] : "";
                }
                return null;
            };
            return h;
        })()
    };

    $H.tongji = function (name) {

        var tjName = name || "ajaxName";

        _hmt.push(['_trackEvent', tjName, 'ajax', '']);

    }

    return $H;
})();

//数组对象扩展
$.extend(Array.prototype, {
    //查找某个对象是否在数组中，支持对象数组
    idxOf: function (item) {
        var len = this.length, tmp;
        if (typeof item == "object")
            item = $H.json.stringify(item);
        for (var i = 0 ; i < len; i++) {
            tmp = this[i];
            if (typeof tmp == "object")
                tmp = $H.json.stringify(tmp);
            if (item == tmp)
                return i;
        }
        return -1;
    },
    //返回排重之后的数组
    unique: function () {
        var result = [], len = this.length;
        for (var i = 0; i < len; i++)
            if (result.idxOf(this[i]) == -1)
                result.push(this[i]);
        return result;
    }
});

//精简版的tap事件
(function () {
    if ($H.os.type().indexOf("ios") != -1) {//ios
        var enable = 'ontouchstart' in document,
            tap = { start: enable ? 'touchstart' : 'mousedown', end: enable ? 'touchend' : 'mouseup', move: enable ? "touchmove" : "mousemove" },
            tapEvent = function (e) { return e.touches ? e.touches[0] : e; };
        $.fn.tap = function (callback, continueDefault) {
            var prevent = function (e) { e.stopPropagation(); if (!continueDefault) e.preventDefault(); };
            return this.each(function () {
                var _, touch, dom = this, cancelTap = function () { touch = undefined; };
                $(dom).on(tap.start, function (e) {
                    if (!$(dom).attr("disabled")) {
                        _ = tapEvent(e);
                        touch = { x1: _.clientX, y1: _.clientY, x2: _.clientX, y2: _.clientY };
                    }
                }).on(tap.move, function (e) {
                    if (touch) {
                        _ = tapEvent(e);
                        touch.x2 = _.clientX;
                        touch.y2 = _.clientY;
                    }
                }).on(tap.end, function (e) {
                    if (touch && Math.abs(touch.x1 - touch.x2) < 10 && Math.abs(touch.y1 - touch.y2) < 10) {
                        setTimeout(function () { callback.call(dom, e); }, 0);
                        prevent(e);
                        cancelTap();
                    }
                }).on('touchcancel', cancelTap).click(function (e) { prevent(e); });
            });
        };
    } else {
        $.fn.tap = function (selector, data, callback, one) {
            return this.click(selector, data, callback, one);
        };
    }
})();

try {
    if (window.console && window.console.log) {
        console.log("%c欢迎加入hobbit-beta1.0：https://github.com/lijiakof/hobbit", "color:#007AFF");
    }
} catch (e) {
}