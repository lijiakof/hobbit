/// <reference path="zepto.js" />

$(function () {
    $H.autoPageHeight();
    //ios a tag active style
    $("a").bind("touchstart", function () { }).bind("touchend", function () { });
});

var $H = {
    conf:{
        version: "beta 2.0",
        lazyLoadImg: "data:img/jpg;base64,R0lGODlhAQABAIAAAAAAAAAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==",
        loaderImg: "",
        plusCalendar: "",
        plusValidator: "hobbit.fn.validator.js"        
    },
    /**
    * Immediate Function pattern
    * Browser informations
    */
    browser: (function(){
        var ua = navigator.userAgent.toLowerCase();
        //var f = function(k) { return ua.indexOf() };
        return {
            ua: ua,
            isSafari: ua.indexOf("safari") > 0 && ua.indexOf("chrome") <= 0,
            isChrome: ua.indexOf("chrome") > 0,
            isQQ: ua.indexOf("qqbrowser") > 0,
            isUc: ua.indexOf("uc") > 0,//to do
            isIe: ua.indexOf("ie") > 0,//to do
            height: window.innerHeight || $(window).height(),
            width: window.innerWidth || $(window).width(),
        };
    })(),
    /**
     * loader
     */
    loader: {
        ui: $("<div class='ui_loader'>").html("<div class='ui_loader_round'><div class='ui_loader_ring'></div></div>"),
        txt: $("<h1>"),
        status: 0,
        show: function (txt) {
            if ($H.loader.status == 0) {
                $H.loader.ui.append($H.loader.txt);
                if(txt)
                    $H.loader.txt.text(txt);
                else
                    $H.loader.txt.text("努力加载中...");
                $H.loader.ui.appendTo("body").show();
                $H.loader.status = 1;
            }
        },
        hide: function () {
            if ($H.loader && $H.loader.status && $H.loader.status == 1) {
                $H.loader.ui.remove();
                $H.loader.status = 0;
            }
        }
    },
    /**
     * dialog
     */
    dialog: {
        ui: $("<div>"),
        show: function(){ },
        submit: function(){ },
        cancle: function(){ }
    },
    /**
     */
    alert: function(message){
        alert(message);
    },
    msgbox: {
        ui: $("<div>"),
        show: function(){ },
        close: function(){ }
    },
    jSon: { 
        stringify: function(o, t){ },
        parse: function(s, t){},
        
        _stringifyJson:function(){},
        _stringifyNvp:function(){},
        _parseJsonStr:function(){},
        _parseNvpStr:function(){},
    },
    /**
     * @param {String} url
     * @param {Object} data
     * @param {Function} callback
     * @param {number} expires seconds
     * @param {number} timeout seconds
     * */ 
    ajax: function(options){
        $H.loader.show();
        //Expires time
        var expires = options.expires;
        expires = (expires && expires > 0) ? expires : 600;
        expires = parseInt(new Date().getTime() / (1000 * expires), 10);
        //Time out
        var timeout = options.timeout;
        timeout = (timeout && timeout > 0) ? timeout : 30;
        var type = options.type ? options.type : "GET";
        var dataType = options.dataType ? options.dataType : "json";
        //jSon.expires = 
        $.ajax({
            type: type,
            url: options.url,
            data: options.data,
            dataType: dataType,
            complete: function () { $H.loader.hide(); },
            success: function (data) {
                if(options.callback)
                    options.callback(data);
                $H.loader.hide();
            },
            error: function () { 
                $H.loader.hide();
                $H.msgbox.show();
            }
        });
    },
    /**
     * Auto set page height
     */
    autoPageHeight: function(){
        var browserHeight = $H.browser.height;
        var bodyHeight = $("body").height();
        var footerHeight = $("footer").height() ? $("footer").height() : 0;
        $("body").height(browserHeight + 300);
        $H.scrollTop();
        browserHeight = $H.browser.height = window.innerHeight || $(window).height();

        if(bodyHeight < browserHeight){
            var fillHeight = browserHeight - bodyHeight;
            var fillDiv = $("<div>").height(fillHeight).insertBefore("footer");
        }
        $("body").height(bodyHeight);
    },
    /**
     * Scroll DOM element top
     * @param {String} sel
     * @param {Function} callback
     */
    scrollTop: function(sel, callback){
        //todo 
        /*if($(sel).is("input") && $H.browser.isSafari){            
            e.preventDefault && (e.preventDefault(), e.stopPropagation());
        }*/
        window.scrollTo(0, sel ? $(sel).offset().top : 1);
        if(callback) callback();
    },
    storage: function(){},
    /**
     * klass
     * @param {Object} parent
     * @param {Object} props
     */
    klass: function(parent, props){
        var Child, F, i;
        //new structor
        Child = function(){
            if(Child.uber && Child.uber.hasOwnProperty("struct")){
                Child.uber.struct.apply(this, arguments);
            }
            if(Child.prototype.hasOwnProperty("struct")){
                Child.prototype.struct.apply(this, arguments);
            }
        };
        //inherit
        parent = parent || Object;
        F = function(){};
        F.prototype = parent.prototype;
        Child.prototype = new F();
        Child.uber = parent.prototype;
        Child.prototype.constructor = Child;
        //add functions
        for(i in props){
            if(props.hasOwnProperty(i)){
                Child.prototype[i] = props[i];
            }
        }

        return Child;
    },
    loadScript: function(url, cb, async){
        var doc = document,docEl = doc.documentElement;
		var h = doc.head || doc.getElementsByTagName('head')[0] || docEl,
			s = doc.createElement('script'), rs;
		if (async) s.async = "async";
	    s.onreadystatechange = function () {
		    if (!(rs = s.readyState) || rs == "loaded" || rs == "complete"){
			    s.onload = s.onreadystatechange = null;
			    if (h && s.parentNode)
			        h.removeChild(s);
			    s = undefined;
			    if (cb) cb();
		    }
	    };
		s.onload = cb;
		s.src = url;
		h.insertBefore(s, h.firstChild);
    },
    loadCss: function(url, async){
        var css = document.createElement('link')
        //css.onreadystatechange
    },
    /**
     * Lazyload function
     * @param {String} url
     * @param {Function} fn
     */
    xfn: function(url, fn){
        $H.loader.show();
        $H.loadScript(url, function(){
            $H.loader.hide();
            if(fn) fn();
        }, true);
    },

    ui: {}
}
$H.ui.nav = $H.klass(null, {
    struct: function(sel){
        $(sel).find("a").each(function(){ $(this).append("<span class='nav_arrow_r'></span>")});
    }
});

$H.ui.span = $H.klass(null,{
    struct: function(id){
        this.id = id;
    },
    show:function(){
        
    }
 });

$H.ui.tabs = $H.klass(null, {
    struct: function(id){
        this.id = id;
    },
    show: function(){
        
    }
});

$H.ui.drawer = $H.klass(null, {
    struct: function(sel){
        this.sel = sel;
        this.status = 0;
    },
    open: function(){
        $(this.sel).show();
        this.status = 1;
    },
    close: function(){
        $(this.sel).hide();  
        this.status = 0;  
    },
    toggle: function() {
        if(this.status) this.close();
        else this.open();
    }
});

$H.ui.accordion = $H.klass(null, {
    struct: function(id){ },
});

$H.ui.button = $H.klass();

$H.ui.input = $H.klass();

$H.ui.checkbox = $H.klass();

$H.ui.radio = $H.klass();

$H.ui.select = $H.klass();

$H.ui.searcher = $H.klass();

$H.ui.suggestion = $H.klass();

$H.xui = $H.klass();









