/// <reference path="../core/zepto.js" />
/// <reference path="../core/hobbit.js" />

//自动建议控件
//参数options的属性：
//getData获取自动建议结果的方法，必传项，入参是keyword字符串或json对象
//showKeyword显示关键字的回调方法
//showSuggest显示自动建议结果的回调方法
//delay缓冲时间，默认200毫秒
//cache:是否启用缓存，默认true
$H.suggestion = function (options) {
    options = $.extend({
        getData: 0,
        showKeyword: 0,
        showSuggest: 0,
        delay: 200,
        cache: 1
    }, options);

    var $this = this;
    var keyword = { value: 0, code: 0 };
    var cache = {};
    var getCode = function (k) {
        if (typeof k == "object")
            k = $H.json.stringify(k);
        return $H.hash(k.toString());
    };

    this.input = function (k) {
        $H.throttle({
            delay: options.delay,
            fn: function () {
                keyword.value = k;
                keyword.code = getCode(k);
                !options.showKeyword || options.showKeyword(k);

                //检查是否启用了并有缓存
                if (options.cache) {
                    var result = cache["H" + keyword.code];
                    if (result != undefined) {
                        $this.setData(result);
                        return;
                    }
                }

                if (options.getData)
                    options.getData(k);
            },
            debounce: false
        });
    };

    //var r = { code: 0, result: [{}, {}] };
    this.setData = function (result) {
        if (result && "code" in result) {
            if (options.cache)
                cache["H" + result.code] = result;
            if (keyword.code == result.code)
                !options.showSuggest || options.showSuggest(keyword.value, result);
        }
    };

    this.clearCache = function () {
        for (var i in cache)
            delete cache[i];
    };
};

$.extend($.fn, {
    suggestion: function (options) {
        var $this = this, sug;

        options = $.extend({
            getData: 0,
            showKeyword: 0,
            showSuggest: 0,
            delay: 200,
            cache: 1,
            maxcount: 10,
            url: 0,
            jsonp: 0,
            showing: 0,
            showed: 0,
            hiding: 0,
            hided: 0,
            format: 0,//字符串或者方法都行
            filter: 0,
            selected: 0
        }, options);

        var init = (function () {
            sug = $H.suggestion({
                delay: options.delay,
                cache: options.cache,
                showKeyword: options.showKeyword,
                getData: options.getData || function (keyword) {
                    $H.ajax({
                        type: "GET",
                        url: options.url,
                        data: (typeof keyword == "object") ? keyword : { "key": keyword },
                        dataType: options.jsonp ? "jsonp" : "json",
                        expires: 60,
                        context: keyword,
                        //complete: function () { },
                        //error: function () { }
                        success: function (result) { sug.setData(result); }
                    });
                },
                showSuggest: options.showSuggest || function (keyword, result) {

                }
            });
            this.on("input", sug.input(this.val()));

        })();
    }
});

/*
委托：
getData(关键字json)   ——初始化时需要传给自动建议控件，是个抽象方法，使用者须实现通过输入数据获取自动建议数据。无返回值。入参是json格式，因为输入的参数往往不仅仅是一个关键字，例如酒店关键词自动建议的输入条件就包含城市ID和关键字两个。

方法：
setDate(返回的建议结果json)	   ——当使用者获得了自动建议数据后，需要调用此方法告诉自动建议控件建议的数据是什么，自动建议控件会缓存数据。
input(关键字json)    ——当用户输入的时候应该由使用者去调用这个方法，告诉自动建议该控件去触发自动建议。
showValue(关键字json)	——
show(返回的建议结果json)    ——初始化时可以传给自动建议控件（可选），是个方法，可以由使用者自定义如何渲染显示自动建议的结果。如果不指定，则使用控件自己实现渲染逻辑。
clear() ——清空显示的div[class=’suggest’]
close()  ——隐藏显示的div[class=’suggest’]

功能：
自动缓存以前的结果（内存json对象？）
对频繁调用change方法的稀释（触发最后一个change？），且稀释时间可配置。
？即将show的时候，如果检测到又有change方法被调动，应该取消掉show。
[不需要]支持输入什么就很快显示本身。（可配置）
[不需要]没有自动建议结果时显示是历史显示功能。（可配置）



1、	用户在任意可输入控件中输入关键字A
2、	触发控件使用者调用自动建议控件的input(关键字json)方法，将A传给自动建议控件。自动调用showValue(关键字json)。 //同时，如果需要立刻显示用户输入的内容，还要调用clear()方法，再调用show(date)方法显示用户输入的内容。
3、	如果该关键字有缓存，直接show(缓存的data)，否则自动建议控件稀释后判断是否有挂起的关键字，如果没有才调用getData(json)方法，也就是使用者自己定义的获取数据的方法。
4、	如果使用者需要缓存返回数据，则调用setDate(data)方法。
5、	？调用show(data)方法(如果data是空就不继续处理了)，同时判断是否有挂起的关键字，有则不继续处理，没有则显示结果。
6、	


*/