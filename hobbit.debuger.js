/// <reference path="jquip.js" />
/// <reference path="libs/json2.js" />

$.extend({
    debuger: {
        id: "debuger",
        win: $("<div>"),
        title: $("<div>").text("hobbit.debuger"),
        panel: $("<div>"),
        ontimePanel : $("<div>"),
        ontimeConsole: $("<table>"),
        ontimeInt: $("<input>"),
        ontimeBtn: $("<div>").text("cmd"),
        console: function () {
            var winCss = {
                "font-family":"Helvetica,Arial,sans-serif",
                "padding": "3px",
                "-webkit-border-radius": "6px",
                "background-color": "#4B5E81",
                "-webkit-text-size-adjust" : "none",
            };
            var titleCss = {
                "background-color": "#4B5E81",
                "background-image": "-webkit-linear-gradient(#EEEEEE,#D1D1D1)",
                "-webkit-border-top-right-radius": "3px",
                "-webkit-border-top-left-radius": "3px",
                "font-size": "12px",
                "color": "#000",
                "text-indent": "10px",
                "text-shadow": "none",
                "height": "20px",
                "line-height": "20px"
            };
            var pannelCss = {
                "background-color": "#fff",
                "-webkit-border-bottom-right-radius": "3px",
                "-webkit-border-bottom-left-radius": "3px",
            };
            var ontimePanelCss = {
                "margin": "0",
                "padding": "2px 0"
            };
            var ontimeIntCss = {
                "margin": "0",
                "border":"1px solid #4B5E81",
                //"box-shadow":"inset 0 1px 4px rgba(0, 0, 0, .2)",
                "box-shadow":"none",
                "border-radius": "4px",
                "line-height": "18px",
                "width":"70%"
            };
            var ontimeBtnCss = {
                "border":"1px solid #DD4500",
                "color": "#fff",
                //"background-image": "linear-gradient(#FF9B00, #DD4500)",
                "background-image": "-webkit-linear-gradient(#FF9B00,#DD4500)",
                "-webkit-border-radius": "3px",
                "width":"24%",
                "height": "22px",
                "line-height": "20px",
                "text-align": "center",
                "float":"right",
            };
            var ontimeConsoleCss = {
                "background-color": "#fff",
                "width":"100%",
                "font-size": "12px",
                "border-collapse": "collapse",
	            "border-spacing": "0",
	            "empty-cells": "show"
            }

            var dg = this;
            this.ontimeBtn.click(function(){
                dg.cmd(dg.ontimeInt.val());
                window.scrollTo(0, document.body.scrollHeight);
            });
            
            this.win.css(winCss).prependTo("body");
            this.title.css(titleCss).appendTo(this.win);
            this.panel.css(pannelCss).appendTo(this.win);
            this.ontimeConsole.css(ontimeConsoleCss).appendTo(this.panel);
            this.ontimePanel.css(ontimePanelCss).appendTo(this.win);
            this.ontimeInt.css(ontimeIntCss).val("#").appendTo(this.ontimePanel);
            this.ontimeBtn.css(ontimeBtnCss).appendTo(this.ontimePanel)
        },
        cmd: function(code){
            code = code.replace(/#wl/g,"$.debuger.writeLine");
            code = code.replace(/#ua/g,"$.debuger.writeLine(navigator.userAgent)");
            code = code.replace(/#br/g, "$.debuger.writeLine($.jSon.stringify($.getBrowser()))");
            //code = code.replace(/#ip/g,"$.getScript('http://m.elong.com/hobbit/ua.aspx?p=ip', null,function(a){$.debuger.writeLine(a)})");
            eval("try{"+ code +"}catch(e){alert(e.message)}");
        },
        writeLine: function (obj, wt) {
            var time = new Date();
            var y = time.getFullYear();
            var m = time.getMonth() + 1;
            var d = time.getDate();
            var h = time.getHours();
            var m = time.getMinutes();
            var s = time.getSeconds();
            var t = h + ":" + m + ":" + s; //y + "-" + m + "-" + d + " " + 


            var type = Object.prototype.toString.apply(obj);
            switch (type) {
                case "[object String]": type = "[s]"; break;
                case "[object Number]": type = "[n]"; break;
                case "[object Boolean]": type = "[b]"; break;
                case "[object Array]": type = "[a]"; break;
                case "[object Function]": type = "[f]"; break;
                case "[object Date]": type = "[d]"; break;
                case "[object Object]": type = "[o]"; break;
                case "[object User]": type = "[u]"; break;
            }
                
            var txtHeader = t + type;
            var txtContent = obj;

            var trLine = $("<tr>").css({
            });
            var tdHeader = $("<td>").css({
                "width": "75px",
                "border-top": "solid 1px #B7B7B7",
                "vertical-align": "top",
            });
            var tdContent = $("<td>").css({
                "border-top": "solid 1px #B7B7B7",
                "vertical-align": "top",
                "word-wrap": "break-word",
                "word-break": "break-all",
                "font-size": "12px",
            });
            

            if (wt == "e") {
                type = "[er]";
                tdContent.css({ "color": "red" });
            }

            tdHeader.text(txtHeader).appendTo(trLine);
            tdContent.text(txtContent).appendTo(trLine);
            trLine.appendTo(this.ontimeConsole);
        },
        wirte: function(){},
        tryCatch: function (fn) {
            try {
                fn();
                this.writeLine("the function is ok!");
            }
            catch (e) {
                this.writeLine(e.message, "e");
            }
        },
        ip:function(){
            //$.getScript('http://m.elong.com/hobbit/ua.aspx?p=ip', "",function(a){$.debuger.writeLine(a)})
        }
    }
});
