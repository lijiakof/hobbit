/// <reference path="zepto.js" />
var $H = {
    config: {},
    /**
    * @desc 检测设备系统和浏览器的类型及版本。
    *
    * @ua userAgent字符串（非必选，不指定则使用当前浏览器的navigator.userAgent）
    * @return 返回结果是UAI对象，格式为： { os: 系统类型, ov: 系统版本, bs: 浏览器类型, bv: 浏览器版本 }
    *
    * @备注：该函数依赖$H.storage用于缓存结果，类型为字符串类型（全部类型参见系统类型表），版本为浮点数字类型（忽略第二个点之后的版本号）
    */
    detect: function (ua) {
        var uai, u;
        if (!ua) {
            uai = $H.storage.get("UAI");
            if (uai) return uai;
            u = navigator.userAgent;
        } else
            u = ua;
        var os, bs, vr = "\\D*(\\d+[._]?\\d*)?";
        var match = function (k) {
            var t = "unknown", v = 0;
            for (var m, i = 0; i < k.length; i++)
                if (m = u.match(new RegExp("(" + k[i][1] + ")" + vr, "i"))) {
                    t = k[i][0];
                    v = parseFloat(m[2]);
                    v = isNaN(v) ? 0 : v;
                    break;
                }
            return { type: t, ver: v };
        };
        os = match([["android", "Android"], ["iosipad", "iPad"], ["iosipod", "iPod"], ["iosiphone", "iPhone\\sOS"], ["windowsmobile", "Windows\\s?Mobile"], ["windowsphone", "Windows\\s?Phone|WPOS"], ["windowspc", "Windows"], ["symbian", "Series60|Symbian|Nokia"], ["blackberry", "BlackBerry"], ["macpc", "Macintosh|Mac\\s?OS"]]);
        bs = match([["chrome", "Chrome|CriOS"], ["ie", "MSIE"], ["weixin", "MicroMessenger"], ["miuiyp", "MiuiYellowPage"], ["qq", "QQBrowser"], ["uc", "UCBrowser|UCWEB|JUC|\\sUC\\s"], ["firefox", "Firefox"], ["opera", "Opera"], ["safari", "Mac\\s?OS.*Safari"], ["native", "Android.*WebKit"]]);
        uai = { os: os.type, ov: os.ver, bs: bs.type, bv: bs.ver };
        if (!ua)
            $H.storage.set({ key: "UAI", value: uai, expires: 3600 * 24 * 30 });
        return uai;
    },
    os: {
        type: function () { return $H.detect().os; },
        ver: function () { return $H.detect().ov; },
        online: function () { return navigator.onLine; }
    },
    browser: {
        ua: navigator.userAgent,
        type: function () { return $H.detect().bs; },
        ver: function () { return $H.detect().bv; },
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
            zep.bind("touchmove", $H.browser.preventEvent);
            var s = document.body.style; s.overflowX = s.overflowY = "hidden";
        },
        scrollable: function (selector) {
            var zep = selector ? $(selector) : $(window);
            zep.unbind("touchmove", $H.browser.preventEvent);
            var s = document.body.style; s.overflowX = s.overflowY = "auto";
        },
        preventEvent: function (e) {
            e.preventDefault();
        }
    },
    mask: {
        ui: $("<div>"),
        show: function (options) {
            options = $.extend({
                scrollable: true,
                clickMask: function () {  }
            }, options);

            //var height = $(document).height();
            //if ($H.browser.height() > height)
            //    height = $H.browser.height();
            
            $H.mask.ui.css({
                "background-color": "#333",
                "position": "absolute",
                "top": "0",
                "height": document.body.scrollHeight,
                "width": "100%",
                "z-index": "9998",
                "opacity": ".4"
            }).appendTo($("body"));

            $H.mask.ui.off("click");            
            $H.mask.ui.on("click", options.clickMask);

            if (!options.scrollable)
                $H.browser.discrollable();

            return $H.mask.ui;
        },
        close: function () {
            if ($H.mask.ui) {
                $H.mask.ui.empty();
                $H.mask.ui.remove();
            }
            $H.browser.scrollable();
        }
    },
    loader: {
        ui: $("<div>").addClass("loader"),
        show: function (options) {
            options = $.extend({
                text: "",
                mask: false,
                scrollable: true,
                clickMask: function () { },
                timeout: -1
            }, options);

            $H.loader.ui.empty();
            var text = $("<div>");
            var loading = $("<div>").addClass("loading");

            if (options.mask) {
                $H.mask.show({
                    scrollable: true,
                    clickMask: options.clickMask
                });
            }

            loading.appendTo($H.loader.ui);
            $H.loader.ui.appendTo($("body"));

            if (options.text) {
                text.addClass("text").html(options.text).appendTo($H.loader.ui);
            }
            $H.loader.ui.css("margin-left", -$H.loader.ui.width() / 2);

            //todo; 提炼出int解析方法
            //如果不传timeout，则永久显示
            var timeout = parseInt(options.timeout, 10);
            if (!isNaN(timeout) && timeout >= 0)
                setTimeout($H.loader.close, timeout * 1000);

            if (!options.scrollable)
                $H.browser.discrollable();

            return $H.loader.ui;
        },
        close: function () {
            $H.mask.close();
            if ($H.loader.ui) {
                $H.loader.ui.empty();
                $H.loader.ui.remove();
            }
        }
    },
    dialog: {
        ui: $("<div>").addClass("dialog"),
        show: function (options) {
            options = $.extend({
                title: "",
                content: "",
                buttons: null,
                mask: false,
                scrollable: false,
                clickMask: function () { }
            }, options);

            $H.dialog.ui.empty();
            var title = $("<div>").addClass("title");
            var content = $("<div>").addClass("content");
            var btns = $("<div>").addClass("btns");

            if (options.mask) {
                $H.mask.show({
                    scrollable: true,
                    clickMask: options.clickMask
                });
            }

            if (options.title) {
                title.html(options.title);
                $H.dialog.ui.append(title)
            }

            $H.dialog.ui.append(content);
            if (options.content) {
                content.html(options.content).css("max-height", $H.browser.height() - 180);
            }

            //btn = {text:"",callback:""}
            if (options.buttons) {
                $.each(options.buttons, function (index, item) {
                    var zepBtn = $("<a>").text(item.text);
                    //todo: touchActive
                    zepBtn.on("touchstart mousedown", function () {
                        $(this).addClass("active");
                        var This = $(this);
                        if ("android,windowsmobile,windowsphone,windowspc".indexOf($H.os.type()) != -1) {
                            setTimeout(function () { This.removeClass("active"); }, 800);
                        }
                    }).on("touchcancel touchend mouseup click", function () {
                        $(this).removeClass("active");
                    })

                    if (item.class)
                        zepBtn.addClass(item.class)
                    if (item.css)
                        zepBtn.css(item.css);
                    if (item.callback)
                        zepBtn.on("click", function () {
                            item.callback();
                        });
                    btns.append(zepBtn);
                    zepBtn = null;
                });
                $H.dialog.ui.append(btns);
            }

            $H.dialog.ui.appendTo($("body"));
            $H.dialog.ui.css("margin-top", -$H.dialog.ui.height() / 2);

            if (!options.scrollable)
                $H.browser.discrollable();
            //$H.dialog.content.unbind("touchmove", $H.browser.preventEvent);

            return $H.dialog.ui;
        },
        close: function () {
            $H.mask.close();
            if ($H.dialog.ui) {
                $H.dialog.ui.empty();
                $H.dialog.ui.remove();
            }

            $H.browser.scrollable();
        }
    },
    json: {
        stringify: function (json) {
            var s = null;
            try {
                s = window.JSON.stringify(json);
            }
            catch (e) {
                console.error(e)
            }

            return s;
        },
        parse: function (string) {
            var j = null;
            try {
                j = window.JSON.parse(string);
            }
            catch (e) {
                console.error(e)
            }

            return j;
        }
    },
    url: {
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
                    };
                };
            };

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
                    };
                };
                return newUrl;
            };

            var currUrl = window.location;
            if (href && href.length > 0) {
                var domainReg = /^\w+\./;
                if (href.split("://")[1]) {
                    data.href = href;
                } else if (domainReg.test(href)) {
                    data.href = currUrl.href.split("://")[0] + "://" + href;
                } else {
                    data.href = relativeUrl(href);
                };

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

            for (var i in query) {
                for (var j in currQuery) {
                    if (i == j) {
                        currQuery[j] = query[i];
                    } else {
                        currQuery[i] = query[i];
                    };
                }
            }
            for (var k in currQuery) {
                currQuery[k] = currQuery[k] || "";
                newQuery += k + "=" + currQuery[k] + "&";
            }
            newQuery = newQuery.substring(0, newQuery.length - 1);
            newUrl = newQuery ? url.split("?")[0] + "?" + newQuery : url.split("?")[0];
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
    },
    hash: function (string) {
        var hash = 1315423911, i, ch;
        for (i = string.length - 1; i >= 0; i--) {
            ch = string.charCodeAt(i);
            hash ^= ((hash << 5) + ch + (hash >> 2));
        }
        return (hash & 0x7FFFFFFF);
    },
    geo: function (options) {
        options = $.extend({
            expires: 60,
            timeout: 30,
            enableHighAccuracy: false,
            before: function () { },
            success: function () { },
            error: function(){ },
            complete: function () { }
        }, options);

        if (navigator.geolocation) {
            options.before();

            navigator.geolocation.getCurrentPosition(
                function (p) {
                    options.success(p.coords);
                    options.complete();
                },
                function (code, msg) {
                    options.error(code, msg);
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
    },
    //url, data, type, target
    submit: function (options) {
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
    },
    ajax: function (options) {
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
    },
    loadCss: function (options) {
        options = $.extend({
            url: "",
            success: function () { },
            error: function () { }
        }, options);

        var c = document.createElement("link");
        c.rel = "stylesheet";
        c.type = "text/css";
        c.href = options.url;
        document.querySelector("head").insertBefore(c, null);
        c.onload = options.success;
        c.onerror = options.error;
    },
    loadScript: function (options) {
        options = $.extend({
            url: "",
            success: function () { },
            error: function () { }
        }, options);

        var h = document.head || document.getElementsByTagName('head')[0] || docEl,
			s = document.createElement('script'), rs;
        if (options.async) s.async = "async";
        s.onreadystatechange = function () {//兼容IE
            if (!(rs = s.readyState) || rs == "loaded" || rs == "complete") {
                s.onload = s.onreadystatechange = null;
                if (h && s.parentNode)
                    h.removeChild(s);
                s = undefined;
                options.success();
            }
        };

        s.onload = options.success;
        s.onerror = options.error;
        s.src = options.url;
        h.insertBefore(s, null);
    },
    cookie: {
        get: function (key) {
            if (!key)
                return null;
            key = key.toUpperCase();
            var cks = document.cookie.split("; ");
            var tmp = null;
            for (var i = 0; i < cks.length; i++) {
                tmp = cks[i].split("=");
                if (tmp[0].toUpperCase() == key)
                    return unescape(tmp[1]);
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

            var ck = [options.key + "=" + escape(options.value)];
            //?todo：如果expires小于等于0怎么办
            if (!isNaN(options.expires) && options.expires > 0) {//为0时不设定过期时间，浏览器关闭时cookie自动消失
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
            //todo: key 为空怎么存入
            var date = new Date();
            date.setTime(date.getTime() - 999999);
            var aaa = options.key + "=;expires=" + date.toGMTString() + ";path=" + (options.path || "/") + ";domain=" + ((options.domain) || document.domain);
            document.cookie = aaa;
        }
    },
    storage: {
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
                    console.error(e)
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
                catch (e) { console.error(e) }
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
                catch (e) { console.error(e) }
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
                catch (e) { console.error(e) }
            }
        }
    },
    session: {
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
                    console.error(e)
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
                catch (e) { console.error(e) }
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
                catch (e) { console.error(e) }
            }
        },
        clear: function () {
            //浏览器关闭 sessionStorage
            try {
                $H.session.self.clear();
            }
            catch (e) { console.error(e) }
        }
    },
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
    throttle: function (options) {
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
    },
    klass: function (parent, instantProps) {
        var child, F, i;
        child = function () {
            if (child.uber && child.uber.hasOwnProperty("struct"))
                child.uber.struct.apply(this, arguments);
            if (child.prototype.hasOwnProperty("struct"))
                child.prototype.struct.apply(this, arguments);
        };
        parent = parent || Object;
        F = function () { };
        F.prototype = parent.prototype;
        child.prototype = new F();
        child.uber = parent.prototype;
        child.prototype.constructor = child;
        for (i in instantProps)
            if (instantProps.hasOwnProperty(i))
                child.prototype[i] = instantProps[i];
        return child;
    }
}