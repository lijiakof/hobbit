/// <reference path="jquip.js" />
/// <reference path="plus/hobbit.fn.tmpl.js" />
/// <reference path="plus/hobbit.fn.validator.js" />

//hobbit.fx
$.extend({
    hobbit: {
        version: "1.0",
        plusCalendar: "",
        plusValidator: "hobbit.fn.validator.js"
    },

    browser: {
        isSafari: false,
        isChrome: false,
        isQQ: false,
        isUc: false,
        isIe: false,
        ua: "",
        height: 0,
        width: 0,
        isCapture: false
    },

    getBrowser: function () {
        if (!$.browser.isCapture) {
            var ua = navigator.userAgent.toLowerCase();
            $.browser.ua = ua;
            if (ua.indexOf("chrome") > 0) {
                $.browser.isChrome = true;
            }
            if (ua.indexOf("safari") > 0 && ua.indexOf("chrome") <= 0) {
                $.browser.isSafari = true;
            }

            $.browser.height = window.innerHeight || $(window).height();
            $.browser.width = window.innerWidth || $(window).width();

            $.browser.isCapture = true;
        }

        return $.browser;
    },

    loader: {
        ui: $("<div>").addClass("ui_loader").html("<img class=\"ui_loader_icon\" src='images/loader.gif'><h1>努力加载中...</h1>"),
        status: 0,
        show: function () {
            if ($.loader.status == 0) {
                $.loader.ui.appendTo("body").show();
                $.loader.status = 1;
            }
        },
        hide: function () {
            if ($.loader.status == 1) {
                $.loader.ui.hide();
                $.loader.status = 0;
            }
        }
    },

    dialog: function () { },

    jSon: {
        //jSon对象序列化为jSon|nvp字符串
        stringify: function (o, type) {
            switch (type) {
                case "json": ""; break;
                case "nvp": ""; break;
                default: ""; break;
            }
            var s = [], p = {}, c = ""; p.isArr = o instanceof Array; if (p.isArr) { p.l = "["; p.r = "]" } else { p.l = "{"; p.r = "}" }; for (k in o) { if (!p.isArr) c = '"' + k + '":'; else c = ""; switch (typeof (o[k])) { case "object": if (o[k] instanceof Object) c += arguments.callee(o[k]); else c += o[k]; break; case "string": c += '"' + o[k].replace("\\", "\\\\").replace('"', '\\"') + '"'; break; case "number": case "boolean": case "null": c += o[k]; break; default: continue }; s.push(c) }; return p.l + s.join(",") + p.r
        },
        //将json|nvp字符串解析成jSon对象
        parse: function (val, type) {
            var json = {};
            switch (type) {
                case "json": json = this.parseFromNvp(val); break;
                case "nvp": json = this.parseFromStr(val); break;
                default: json = this.parseFromStr(val); break;
            }
            return json;
        },

        parseFromStr: function (str) {
            var k; try { k = eval('(' + str + ')'); return (typeof k == "object") ? k : '' } catch (e) { return '' };
        },
        parseFromNvp: function (nvp) {
            var jSon = {}, pairs = nvp.split('&'), d = decodeURIComponent, n, v;
            $.each(pairs, function (i, p) {
                p = p.split('=');
                n = d(p[0]);
                v = d(p[1]);
                jSon[n] = !jSon[n] ? v : [].concat(obj[n]).concat(v);
            });
            return jSon;
        }
    },

    reqToJson: function () {
        var nvp = location.search;
        return $.jSon.nvpDeserialize(nvp);
    },
    formToNvp: function (formId) { },

    ajaxRequest: function (url, jSon, timeout, fn) {
        $.loader.show();
        var expires;
        if (timeout && timeout > 0) {
            //时间戳缓存
            expires = parseInt(new Date().getTime() / (1000 * 60 * timeout));
        }

        //jSon.expires = 
        $.ajax({
            type: "GET",
            url: url,
            data: jSon,
            dataType: "json",
            complete: function () { $.loader.hide(); },
            success: function (data) {
                fn(data);
                $.loader.hide();
            },
            error: function () { $.loader.hide(); }
        });
    },

    autoPageHeight: function () {
    },

    xfn: function (url, fn) {
        $.loading("show");
        $.getScript(url, function () {
            fn();
            $.loading("hide");
        });
    },

    xValidator: function (thisForm, mode) {
        $.xfn($.hobbit.plusValidator, function () { $.Validate(thisForm, mode); });
    },

    xTmpl: function () {
        $.xfn("plus/hobbit.fn.tmpl.js", function () { $.tmpl() });
    }

});

$.fn.extend({
    //将表单值序列化成nvp
    serialize: function () {
        var params = [];
        $.each(this.serializeArray(), function (i, field) {
            params.push(field.name + "=" + encodeURIComponent(field.value));
        });
        return params.join("&");
    }
});

//hobbit.ui
$.fn.extend({
    ui: function () {

    },
    uiLable1: new function (u) {
        this.ui = u;
        this.ini = function () { alert("ini"); };
        this.show = function () { alert("show"); };
    },
    uiLable: {
        ui: "",
        ini: function (u) {
            this.ui = u;
            alert("ini");
        },
        show: function () {
            alert("show");
        }

    },
    uiCheckbox: function () { },
    uiRadio: function () { },
    uiSelect: function () { },

    uiToolbar: function () { },
    uiTabs: function () { },
    uiAccordion: function () { },

    xui: function (url, ui) {
        $.getScript(url, ui);
    },

    xCalendar: function (url, ui) {
        this.xui($.hobbit.plusCalendar, function () { });
    }
});

