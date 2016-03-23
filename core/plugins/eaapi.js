(function () {
    if (!window.JSON || !window.performance)
        return;

    var def = function (v) {
        return v || "";
    };

    var send = function (j) {
        var m = document.createElement('img');
        m.setAttribute('src', "http://mobile-2011.elong.com/monitor/app?req=" + encodeURIComponent(window.JSON.stringify(j)));
        m.style.display = 'none';
        document.body.appendChild(m);
    };

    window.addEventListener("load", function () {
        setTimeout(
            function () {
                try {
                    var start = window.performance.timing.requestStart;
                    var domReady = window.performance.timing.domContentLoadedEventEnd;
                    var pageload = window.performance.timing.loadEventEnd;
                    domReady = domReady - start;
                    pageload = pageload - start;
                    var net = "";
                    if (navigator.connection) {
                        switch (navigator.connection.type) {
                            case 1: net += ";ETHERNET"; break;
                            case 2: net += ";WIFI"; break;
                            case 3: net += ";2G"; break;
                            case 4: net += ";3G"; break;
                            case 5: net += ";4G"; break;
                            default: net += ";OTHER" + navigator.connection.type; break;
                        }
                    }

                    if (start <= 0 || domReady <= 0 || pageload <= 0)
                        return;

                    var req = {
                        exception: "",
                        httpResultCode: 200,
                        requestUrl: def(_EA.ctl) + "?action=" + def(_EA.act),
                        type: 0,//请求分类：0=正常请求，1=请求超时，2=Crush，3=客户端异常，4=不正常请求结果,非http 200请求
                        h5Extend: {
                            UserTraceId: def(_EA["cid"]),
                            TraceId: def(_EA["traceId"]),
                            DeviceId: def(_EA["sid"]),
                            Version: "1301001",
                            ChannelId: def(_EA["channelId"]),
                            ClientType: def(_EA["clientType"]),
                            Network: net,
                            OsVerson: "Html5_v3",
                            Guid: def(_EA["cid"]),
                            FirstTime: domReady,
                            AllTime: pageload
                        }
                    };

                    send(req);
                } catch (ex) {
                    try { console.error(ex); }
                    catch (ex) { }
                }
            }
            , 100);
    }, false);
})();