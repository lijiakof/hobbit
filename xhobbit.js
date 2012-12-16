/// <reference path="jquip.js" />
$(function () {
    $H.autoPageHeight();
});
$("a").bind("touchstart", function () { }).bind("touchend", function () { });
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
    loader: {
        ui: $("<div class='ui_loader'>").html("<div class='ui_loader_round'><div class='ui_loader_ring'></div></div><h1>努力加载中...</h1>"),
        status: 0,
        show: function () {
            if ($H.loader.status == 0) {
                $H.loader.ui.appendTo("body").show();
                $H.loader.status = 1;
            }
        },
        hide: function () {
            if ($H.loader.status == 1) {
                $H.loader.ui.remove();
                $H.loader.status = 0;
            }
        }
    },
    dialog: {
        ui: $("<div>"),
        show: function(){ },
        submit: function(){ },
        cancle: function(){ }
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
     * @param {Object} jSon
     * @param {Function} fn
     * @param {number} et seconds
     * @param {number} to seconds
     * */ 
    ajaxReq: function(url, jSon, fn, et, to){
        $H.loader.show();
        //Expires
        et = (et && et > 0) ? et : 600;
        to = (to && to > 0) ? to : 30;
        var expires = parseInt(new Date().getTime() / (1000 * et), 10);
        //jSon.expires = 
        $.ajax({
            type: "GET",
            url: url,
            data: jSon,
            dataType: "json",
            complete: function () { $H.loader.hide(); },
            success: function (data) {
                fn(data);
                $H.loader.hide();
            },
            error: function () { $H.loader.hide(); }
        });
    },
    /**
     * Auto set page height，
     */
    autoPageHeight: function(){
        //var body = $("body");
        var browserHeight = $H.browser.height;
        var bodyHeight = $("body").height();
        var footerHeight = $("footer").height() ? $("footer").height() : 0;
        $("body").height(browserHeight + 300);
        $H.scrollTop();
        browserHeight = $H.browser.height = window.innerHeight || $(window).height();
        //footer style is "position:absolute; bottom:0"
        bodyHeight = (bodyHeight + footerHeight < browserHeight) ? browserHeight : bodyHeight + footerHeight;
        //bodyHeight = (bodyHeight < browserHeight) ? browserHeight : bodyHeight - footerHeight;
        $("body").height(bodyHeight);
    },
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
        
        Child = function(){
            if(Child.uber && Child.uber.hasOwnProperty("struct")){
                Child.uber.struct.apply(this, arguments);
            }
            if(Child.prototype.hasOwnProperty("struct")){
                Child.prototype.struct.apply(this, arguments);
            }
        };
        
        parent = parent || Object;
        F = function(){};
        F.prototype = parent.prototype;
        Child.prototype = new F();
        Child.uber = parent.prototype;
        Child.prototype.constructor = Child;

        for(i in props){
            if(props.hasOwnProperty(i)){
                Child.prototype[i] = props[i];
            }
        }

        return Child;
    },

    xfn: function(url, fn){
        $H.loader.show();
        $.loadScript(url, function(){
            $H.loader.hide();
            if(fn) fn();
        }, true);
    }
}

var ui = $H.klass(null, {
    struct: function(id){
        this.id = id;
    },
    update: function(){}
});

var uiSpan = $H.klass(null,{
    struct: function(id){
        this.id = id;
    },
    show:function(){
        
    }
 });

var uiTabs = $H.klass(null, {
    struct: function(id){
        this.id = id;
    },
    show: function(){
    
    }
});

var uiDrawer = $H.klass(null, {
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

var uiNav = $H.klass(null, {
    struct: function(sel){
        $(sel).find("a").each(function(){ $(this).append("<span class='nav_arrow_r'></span>")});
    }
});









