/// <reference path="../zepto.js" />
/// <reference path="../hobbit.js" />

$H.validate = (function () {
    //解析属性
    var parse = function (filter) {
        var msg, errorClass, correctClass;
        if (typeof filter == "string")
            filter = filter.charAt(0) == "#" ? eval(filter.substr(1)) : $H.json.parse(filter);
        if (!$.isArray(filter))
            filter = [filter];
        else {
            for (var i = 0, p; i < filter.length; i++) {
                p = filter[i];
                if (p["msg"] == undefined)
                    p["msg"] = msg;
                else
                    msg = p["msg"];
            }
        }
        return { filter: filter };
    };

    //带有value属性的标签
    var VALTAGS = { "INPUT": 1, "TEXTAREA": 1, "BUTTON": 1, "SELECT": 1 };

    //获取元素属性值
    var getval = function (zep, fixdc, trim) {
        var v, fn = VALTAGS[zep.attr("tagName").toUpperCase()] == undefined ? "html" : "val";
        v = zep[fn]() || "";
        if (fixdc)
            v = dc2sc(v);
        if (trim)
            v = v.trim();
        zep[fn](v);
        return v;
    };

    //计算表达式值
    var evalVal = function (v) {
        if (typeof v == "function")
            return v();
        else if (typeof v == "string" && v.indexOf("javascript:") == 0)
            return Function("v", "return " + v.substr(11))();
        return v;
    };

    //全角转半角字符
    var dc2sc = function (src) {
        var len = src.length, code, tar = [];
        for (var i = 0; i < len; i++) {
            code = src.charCodeAt(i);
            if (code == 12288)
                tar.push(String.fromCharCode(32));
            else if (code > 65280 && code < 65375)
                tar.push(String.fromCharCode(code - 65248));
            else
                tar.push(src.charAt(i));
        }
        return tar.join("");
    };

    var isept = function (v) { return v.trim().length == 0; };

    var vtip = function (tar, msg) {
        var tip = tar.next("span.vtip");
        if (tip.length == 0)
            tip = $("<span class='vtip'>");
        tar.after(tip.html(msg));
        return tip;
    };

    //预定义验证类型
    var definedType = {
        digit: /^\d*$/,
        number: /^[-\+]?\d*(\.\d+)?$/,
        email: /^(\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*)?$/i,
        mobile: /^(((\(\d{2,3}\))|(\d{3}\-))?1[34578]\d{9})?$/,
        tel: /^(((\(\d{2,3}\))|(\d{3}\-))?(\(0\d{2,3}\)|0\d{2,3}-)?[1-9]\d{6,7}(\-\d{1,6})?)?$/,
        zip: /^(\d{6})?$/,
        name: /^[a-zA-Z\u0391-\uFFE5][a-zA-Z\u0391-\uFFE5\/\-\.]{1,19}$/,
        idcard: /^(\d{15}|\d{18}|\d{17}(\d|X|x))?$/,
        en: /^[A-Za-z]*$/,
        ch: /^[\u0391-\uFFE5]*$/,
        bankcard: /^(\d[\d\-]{10,17}\d)?$/
    };

    //预定义类型别名
    definedType["int"] = definedType["long"] = definedType["digit"];
    definedType["money"] = definedType["float"] = definedType["double"] = definedType["number"];
    definedType["phone"] = definedType["mobile"];
    definedType["telephone"] = definedType["tel"];
    definedType["postcode"] = definedType["zipcode"] = definedType["zip"];
    definedType["username"] = definedType["realname"] = definedType["name"];
    definedType["english"] = definedType["en"];
    definedType["chinese"] = definedType["zh"] = definedType["ch"];

    //检测单个filter项
    var checkerr = function (f, v) {
        var iserr = false;
        for (var i in f) {
            if (iserr) break;

            switch (i) {
                case "required":
                case "rq": if (f[i]) iserr = isept(v); break;
                case "min": iserr = !isept(v) && Number(v) < Number(evalVal(f[i])); break;
                case "max": iserr = !isept(v) && Number(v) > Number(evalVal(f[i])); break;
                case "minlength":
                case "minlen": iserr = !isept(v) && v.length < Number(evalVal(f[i])); break;
                case "maxlength":
                case "maxlen": iserr = !isept(v) && v.length > Number(evalVal(f[i])); break;
                case "equal":
                case "eq": iserr = !isept(v) && v != evalVal(f[i]); break;
                case "regex": iserr = new RegExp(evalVal(f[i])).test(v); break;
                case "function":
                case "fn": iserr = evalVal(f[i]); break;
                case "type": iserr = !definedType[f[i]].test(v); break;
            }
        }
        return f["mirror"] ? !iserr : iserr;
    };

    //验证函数
    var $v = function (zep, options) {
        options = $.extend({}, $v.globalOptions, options);
        if (zep == undefined)
            zep = $("[data-validate]");
        var prop, f, f0, result = {
            isError: !1, msgs: [], errors: [], corrects: [], getData: function () {
                var data = {}, checked, tg, nm;
                for (var i = 0; i < this.corrects.length; i++) {
                    tg = this.corrects[i].target;
                    checked = false;
                    nm = tg.attr("name")
                    if (nm && !tg.prop("disabled")) {
                        if (tg.attr("tagName").toUpperCase() == "INPUT" && "RADIO,CHECKBOX".indexOf((tg.attr("type") || "-").toUpperCase()) != -1)
                            checked = tg.prop("checked");
                        else
                            checked = true;
                    }
                    if (checked)
                        data[nm] = data[nm] ? data[nm] + "," + this.corrects[i].val : this.corrects[i].val;
                }
                return data;
            }
        };
        zep.each(function () {
            filter = $(this).data("validate");
            if (!filter)
                return true;
            prop = parse(filter);
            prop.filter[0] = $.extend({}, options.defaultFilter, prop.filter[0]);
            prop.target = $(this);
            prop.val = getval(prop.target, options.fixDC, options.trim);
            if (!options.testMode && options.before && !options.before(prop))
                return true;
            f0 = prop.filter[0];
            for (var i = 0; i < prop.filter.length; i++) {
                f = prop.filter[i];
                prop.isError = checkerr(f, prop.val);
                if (prop.isError) {
                    result.isError = true;
                    result.msgs.push(f.msg);
                    result.errors.push(prop);
                    if (!options.testMode && typeof f0.errorClass == "string")
                        (options.appendDom ? vtip(prop.target, f.msg) : prop.target).removeClass(f0.correctClass).addClass(f0.errorClass);
                    break;
                }
            }

            if (!prop.isError) {
                result.corrects.push(prop);
                if (!options.testMode && typeof f0.correctClass == "string")
                    (options.appendDom ? vtip(prop.target, "") : prop.target).removeClass(f0.errorClass)[isept(prop.val) ? "removeClass" : "addClass"](f0.correctClass);
            }
            if (!options.testMode && options.after)
                result = options.after(prop, result) || result;

            if (prop.isError && options.singleMode)
                return false;
        });

        if (!options.testMode && options.report)
            options.report(result);

        return result;
    };

    //全局默认设置
    $v.globalOptions = { fixDC: !1, trim: !0, singleMode: !1, testMode: !1, before: 0, after: 0, defaultFilter: undefined, appendDom: 0, report: function (result) { if (result.isError) alert(result.msgs.join(";\r")); } };

    return $v;
})();

$.extend($.fn, {
    validate: function (options) {
        return $H.validate(this, options);
    }
});