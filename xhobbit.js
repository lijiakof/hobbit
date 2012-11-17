/// <reference path="jquip.js" />

$(function () {
	$h.initialize();
    $h.loader.show();
 });

$h = {
    conf:{
        version: "beta 2.0",
        expiresTime: 600,//seconds
        timeOut: 30,//seconds
        lazyLoadImg: "data:img/jpg;base64,R0lGODlhAQABAIAAAAAAAAAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==",
        loaderImg: "",
        plusCalendar: "",
        plusValidator: "hobbit.fn.validator.js"        
    },
    initialize: function(){
        //initializeBrowser();
        //initializeLoader();
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
        jSon: { },//urlQueryStringToJson
    },
    loader: {
        show:function(){},
        hide:function(){},
    },
    dialog: {},
    jSon: { 
        stringify: function(o, t){ },
        parse: function(s, t){},
    },
    ajax: function(url, jSon, fn, et, to){
        $h.loader.show();
        //Expires
        et = (et && et > 0) ? et : $h.conf.expiresTime;
        to = (to && to > 0) ? to : $h.conf.timeOut;
        var expires = parseInt(new Date().getTime() / (1000 * et));
        //jSon.expires = 
        $.ajax({
            type: "GET",
            url: url,
            data: jSon,
            dataType: "json",
            complete: function () { $h.loader.hide(); },
            success: function (data) {
                fn(data);
                $h.loader.hide();
            },
            error: function () { $h.loader.hide(); }
        });
    },
    autoHeight: function(){},
    storage:function(){},

    xfn: function(url, fn){},

    ui: {
        lable: function(id)  {
            
        },
        checkbox: function() {},
        radio: function() {},
        select: function() {},
        toolbar: function() {},
        tabs: function() {},
        accordion: function() {},

        xUi: function() {}
    }
}