/// <reference path="zepto.js" />
/// <reference path="../hobbit.js" />
$(function () {
    //document.referrer
    //$("a").on("click", function (e) {
        //e.preventDefault();
        //$H.app.changePage({
        //    url: $(this).attr("href")
        //});
    //});

    window.onpopstate = function () {
        $H.app.changePage({
            url: location.href,
            replace: true
        });
    };
});

$H.app = {
    changePage: function (page) {
        page = $.extend({
            url: "",
            replace: false,
            transition: "slide",
            before: function () { },
            success: function () { },
            error: function () { }
        }, page);

        if (page.url == "") return;
        //var form = $("form").serializeArray();

        $H.ajax({
            url: page.url,
            type: "get",
            timeout: 15,
            expires: 10,
            dataType: "html",
            beforeSend: function () {
                $H.loader.show({ mask: true });
            },
            success: function (html, state, xhr) {
                $H.app.renderHtml({
                    html: html,
                    ready: function () {
                        $(document.body).find("a").on("click", function (e) {
                            e.preventDefault();                            
                            var href = $(this).attr("href");
                            $H.app.changePage({ url: href });
                        });
                    },
                    loaded: function () {
                        $H.browser.scrollTop();
                        //var scorllTop = $(window).scrollTop();
                        //存入 formValues+scorllTopValues
                        //history.replaceState({
                        //form: form,
                        //scorllTop: scorllTop
                        //});
                        //改变 url
                        if (page.replace) {
                            history.replaceState(null, "", page.url);
                        }
                        else {
                            history.pushState(null, "", page.url);
                        }

                        page.success();
                    }
                });
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
            before: function(doc){ return doc; },
            ready: function(){ },
            loaded: function () { },
            jsloaded: function(){ }
        }, options);

        var doc = $H.app.parseDom(options.html);
        doc = options.before(doc);

        //document.head.children = null;
        $(document.head).empty();
        $(doc.head).children().each(function () {
            if ($(this).attr("tagName") == "LINK" ||
            	$(this).attr("tagName") == "META" ||
                $(this).attr("tagName") == "TITLE") {
                document.head.insertBefore(this, null);
            }
        });
        //document.body.children = null;
        $(document.body).empty();
        $(document.body).append($(doc.body).children());
        options.ready();
		
        $H.app.loadJs($(doc).find("script").toArray());
        doc = null;
        options.loaded();
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
    loadJs: function (scripts) {
    	/*options = $.extend({
            scripts: [],
            complete: function(){
            	
            }
        }, options);*/
    	
        if (scripts.length > 0) {
            var script = $(scripts.shift());
            var s = document.createElement('script');
            s.async = "async";
            s.src = script.attr("src");

            var Args = arguments;
            s.onload = function () {
            	Args.callee(scripts);
            };
            s.onerror = function () {
            	Args.callee(scripts);
            };

            document.head.insertBefore(s, null);
        }
    },
    loadCss: function (csss){
    	if(csss.length > 0){
    		var css = $(csss.shift());
    		var c = document.createElement("link");
	        c.rel = "stylesheet";
	        c.type = "text/css";
	        c.href = css.attr("href");
	        
            var Args = arguments;
	        c.onload = function () {
				Args.callee(csss);
			};
	        c.onerror = function () {
				Args.callee(csss);
			  
			};
        	document.head.insertBefore(c, null);
    	}
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
};

$H.history = {
    get: function () {
        var history = $H.session.get("$H.history");
        history = $H.json.parse(history);
        history = $.isArray(history) ? history : [];
        return history;
    },
    push: function (url) {
        var history = $H.history.get();
        //url = $H.hash(url);
        history.push(url);
        
        history = $H.json.stringify(history);
        $H.session.set({ key: "$H.history", value: history });
    }
};
