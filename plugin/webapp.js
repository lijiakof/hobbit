/// <reference path="zepto.js" />
/// <reference path="../hobbit.js" />
$(function () {
    //document.referrer

    $("a").on("click", function (e) {
        e.preventDefault();
        var form = $("form").serializeArray();
        var scrollTop = $(window).scrollTop();
        $H.app.changePage({
            url: $(this).attr("href"),
            success: function () {
                //存入 formValues+scorllTopValues
                history.replaceState({
                    form: form,
                    scorllTop: scrollTop
                });
                //
                history.pushState(null, "", $(this).attr("href"));
            }
        });
    });

    window.onpopstate = function () {
        $H.app.changePage({
            url: location.href,
            success: function () {
                var state = $.extend({
                    form: [],
                    scorllTop: 0
                }, history.state);
                //恢复 formValues
                //for (var i = 0; i < state.form.length; i++) {
                    
                //}
                //恢复 scorllTopValues
                window.scrollTo(0, state.scorllTop);
            }
        });
    }
});

$H.app = {
    changePage: function (page) {
        page = $.extend({
            url: location.href,
            before: function () { },
            success: function () { },
            error: function () { }
        }, page);

        //var form = $("form").serializeArray();

        $H.ajax({
            url: page.url,
            type: "get",
            timeout: 15,
            dataType: "html",
            beforeSend: function () {
                $H.loader.show();
            },
            success: function (html,state, xhr) {

                var doc = $H.app.parseDom(html);
                document.body = doc.body;
                $(document.body).find("a").on("click", function (e) {
                    e.preventDefault();

                    var scorllTop = $(window).scrollTop();
                    $H.app.changePage({
                        url: $(this).attr("href"),
                        success: function () {
                            $H.browser.scrollTop();
                            //存入 formValues+scorllTopValues
                            history.replaceState({
                                //form: form,
                                scorllTop: scorllTop
                            });
                            //改变 url
                            history.pushState(null, "", $(this).attr("href"));
                        }
                    })
                });
                //document.head = doc.head;
                
                //初始化 html
                /*
                $(html).each(function () {
                    //组织 body
                    if ($(this).attr("tagName") == "DIV") {
                        $(document.body).empty();
                        $(document.body).append($(this));
                        $H.browser.scrollTop();

                        //绑定 <a> 的 click 事件
                        $("a").on("click", function (e) {
                            e.preventDefault();

                            var scorllTop = $(window).scrollTop();
                            $H.app.changePage({
                                url: $(this).attr("href"),
                                success: function () {
                                    $H.browser.scrollTop();
                                    //存入 formValues+scorllTopValues
                                    history.replaceState({
                                        //form: form,
                                        scorllTop: scorllTop
                                    });
                                    //改变 url
                                    history.pushState(null, "", $(this).attr("href"));
                                }
                            })
                        });
                    }

                    //插入 head
                    //$(document.head).html("");
                    if ($(this).attr("tagName") == "SCRIPT") {
                        $H.loadScript({
                            url: $(this).attr("src")
                        });
                    }
                    //if ($(this).attr("tagName") == "LINK" ||
                    //    $(this).attr("tagName") == "META" ||
                    //    $(this).attr("tagName") == "TITLE") {
                    //    document.head.insertBefore($(this)[0], null);
                    //}

                });
                */
                page.success();
            },
            error: function () { },
            complete: function () {
                $H.loader.close();
            }
        });
    },
    renderHtml: function (options) {
        options = $.extend({
            html: "",
            load: function () { }
        }, options);

        //window.onload()
    },
    parseDom: function (html) {
        var parser = new DOMParser();
        var doc = parser.parseFromString(html, "text/html");
        if (doc == null) {
            doc = document.implementation.createHTMLDocument("");
            doc.documentElement.innerHTML = html;
        }        
        return doc;
    },
    isVisited: function () {
        //document.referrer
        if ($H.session.get(location.href) == location.href) {
            return true;
        }
        else {
            $H.session.set({
                key: location.href,
                value: location.href
            });
            return false;
        }
    }
}
