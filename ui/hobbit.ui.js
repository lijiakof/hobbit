/// <reference path="../core/zepto.js" />
/// <reference path="../core/hobbit.js" />
$H.mask = {
    ui: [],
    show: function (options) {
        options = $.extend({
            scrollable: true,
            clickMask: function () { }
        }, options);

        //var height = $(document).height();
        //if ($H.browser.height() > height)
        //    height = $H.browser.height();

        $("input").blur();

        var msk = $("<div>").css({
            "background-color": "#333",
            "position": "absolute",
            "top": "0",
            "height": document.body.scrollHeight,
            "width": "100%",
            "z-index": "9998",
            "opacity": ".4"
        });

        msk.appendTo($("body"));
        $H.mask.ui.push(msk);

        msk.off("click");
        msk.on("click", options.clickMask);

        if (!options.scrollable)
            $H.browser.discrollable();

        return msk;
    },
    close: function () {
        if ($H.mask.ui) {
            var mak = $H.mask.ui.pop();
            if (mak) {
                mak.empty();
                mak.remove();
            }
        }
        $H.browser.scrollable();
    }
};
$H.loader = {
    ui: $("<div>").addClass("loader"),
    options: {
        text: "",
        mask: false,
        scrollable: true,
        clickMask: function () { },
        timeout: -1
    },
    show: function (options) {
        $H.loader.options = $.extend($H.loader.options, options);

        $("input").blur();
        $H.loader.ui.empty();
        var text = $("<div>");
        var loading = $("<div>").addClass("loading");

        if ($H.loader.options.mask) {
            $H.mask.show({
                scrollable: true,
                clickMask: $H.loader.options.clickMask
            });
        }

        loading.appendTo($H.loader.ui);
        $H.loader.ui.appendTo($("body"));

        if ($H.loader.options.text) {
            text.addClass("text").html($H.loader.options.text).appendTo($H.loader.ui);
        }
        $H.loader.ui.css("margin-left", -$H.loader.ui.width() / 2);

        //todo; 提炼出int解析方法
        //如果不传timeout，则永久显示
        var timeout = parseInt($H.loader.options.timeout, 10);
        if (!isNaN(timeout) && timeout >= 0)
            setTimeout($H.loader.close, timeout * 1000);

        if (!$H.loader.options.scrollable)
            $H.browser.discrollable();

        return $H.loader.ui;
    },
    close: function () {
        if ($H.loader.options.mask)
            $H.mask.close();
        if ($H.loader.ui) {
            $H.loader.ui.empty();
            $H.loader.ui.remove();
        }
    }
};
$H.dialog = {
    ui: $("<div>").addClass("dialog"),
    options: {
        title: "",
        content: "",
        buttons: null,
        mask: false,
        scrollable: false,
        clickMask: function () { }
    },
    show: function (options) {
        $H.dialog.options = $.extend($H.dialog.options, options);

        $("input textarea").blur();
        $H.dialog.ui.empty();
        var title = $("<div>").addClass("title");
        var content = $("<div>").addClass("content");
        var btns = $("<div>").addClass("btns");

        if ($H.dialog.options.mask) {
            $H.mask.show({
                scrollable: true,
                clickMask: $H.dialog.options.clickMask
            });
        }

        if ($H.dialog.options.title) {
            title.html($H.dialog.options.title);
            $H.dialog.ui.append(title);
        }

        $H.dialog.ui.append(content);
        if ($H.dialog.options.content) {
            content.html($H.dialog.options.content).css("max-height", $H.browser.height() - 180);
        }

        //btn = {text:"",callback:"",className:"",css:{}}
        if ($H.dialog.options.buttons) {
            $.each($H.dialog.options.buttons, function (index, item) {
                var zepBtn = $("<a>").text(item.text);
                //todo: touchActive
                zepBtn.on("touchstart mousedown", function () {
                    $(this).addClass("active");
                    var This = $(this);
                    setTimeout(function () { This.removeClass("active"); }, 2e3);
                }).on("touchcancel touchend mouseup click", function () {
                    $(this).removeClass("active");
                });

                if (item.className)
                    zepBtn.addClass(item.className);
                if (item.css)
                    zepBtn.css(item.css);
                if (item.callback)
                    zepBtn.on("click", function () {
                        item.callback();
                    });
                btns.append(zepBtn);
                zepBtn = null;
            });
            $H.dialog.ui.append(btns);
        }

        $H.dialog.ui.appendTo($("body"));
        $H.dialog.ui.css("margin-top", -$H.dialog.ui.height() / 2);

        if (!$H.dialog.options.scrollable)
            $H.browser.discrollable();
        //$H.dialog.content.unbind("touchmove", $H.browser.preventEvent);

        return $H.dialog.ui;
    },
    close: function () {
        if ($H.dialog.options.mask)
            $H.mask.close();
        if ($H.dialog.ui) {
            $H.dialog.ui.empty();
            $H.dialog.ui.remove();
        }

        $H.browser.scrollable();
    }
};

$H.alert = function (msg, callback) {
    $H.dialog.show({
        title: "提示",
        content: msg,
        buttons: [{
            text: "确定",
            callback: function () {
                if (callback) callback();
                $H.dialog.close();
            }
        }],
        mask: true,
        scrollable: false
    });
};

$H.confirm = function (msg, ok, cancel) {
    $H.dialog.show({
        title: "提示",
        content: msg,
        buttons: [{
            text: "确定",
            callback: function () {
                if (ok) ok();
                $H.dialog.close();
            }
        }, {
            text: "取消",
            callback: function () {
                if (cancel) cancel();
                $H.dialog.close();
            }
        }],
        mask: true,
        scrollable: false
    });

};

$.extend($.fn, {
    transferCssTo: function (elem) {
        var className = this.attr("class");
        var style = this.attr("style");
        if (className != "") {
            elem.addClass(className);
            this.removeAttr("class");
        }
        if (style != undefined && style.length > 0) {
            elem.attr("style", style);
            this.removeAttr("style");
        }
    },
    touchActive: function (css) {
        //touchstart>mouseover>mousedown>touchmove>mousemove>touchend>mouseup>click
        var className = css == undefined ? "active" : css;
        var enable = 'ontouchstart' in document,
        tap = {
            start: enable ? 'touchstart' : 'mousedown',
            end: enable ? 'touchend' : 'mouseup'
        };

        this.on(tap.start, function () {
            var $this = $(this);
            if (!$this.hasClass("disabled")) {
                $this.addClass(className);
                setTimeout(function () { $this.removeClass(className); }, 2e3);
            }
        }).on(tap.end, function () {
            $(this).removeClass(className);
        });

        return this;
    }
});

$.extend($.fn, {
    mask: function () {

        this.show = function () {

        };

        this.close = function () {

        };
    },
    loader: function () {

        this.show = function () { };

        this.close = function () { };
    },
    dialog: function () {

        this.show = function () { };

        this.close = function () {

        };
    }
});

$.extend($.fn, {
    radio: function () {
        var This = this;
        var dom = this[0];
        var ui = this.parent(".radio");

        this.checked = function (checked) {
            if (checked !== undefined) {
                dom.checked = checked;
            }

            $("input[name='" + dom.name + "']").each(function () {
                if ($(this)[0].checked)
                    $(this).parent().addClass("checked");
                else
                    $(this).parent().removeClass("checked");
            });

            return dom.checked;
        };

        this.disabled = function (disabled) {
            if (disabled !== undefined) {
                dom.disabled = disabled;
            }

            if (dom.disabled)
                ui.addClass("disabled");
            else
                ui.removeClass("disabled");

            return dom.disabled;

        };

        this.selected = function () {
            return $("input[name=" + dom.name + "]:checked");
        };

        var init = (function () {
            if (!ui || ui.length == 0) {
                This.wrap("<span class='radio'></span>");
                ui = This.parent(".radio");
            }
            This.transferCssTo(ui);
            This.checked();
            This.disabled();

            This.on("change", function (e) {
                This.checked();
            });
        })();

        return this;
    },

    checkbox: function () {
        var This = this;
        var dom = this[0];
        var ui = this.parent(".checkbox");

        this.checked = function (checked) {
            if (checked !== undefined) {
                dom.checked = checked;
            }

            if (dom.checked)
                ui.addClass("checked");
            else
                ui.removeClass("checked");

            return dom.checked;
        };

        this.disabled = function (disabled) {
            if (disabled !== undefined) {
                dom.disabled = disabled;
            }

            if (dom.disabled)
                ui.addClass("disabled");
            else
                ui.removeClass("disabled");

            return dom.disabled;
        };

        var init = (function () {
            if (!ui || ui.length == 0) {
                This.wrap("<span class='checkbox'></span>");
                ui = This.parent(".checkbox");
            }

            This.transferCssTo(ui);
            This.checked();
            This.disabled();

            This.on("change", function (e) {
                This.checked();
            });
        })();

        return this;
    },

    switcher: function () {
        var This = this;
        var dom = this[0];
        var ui = this.parent(".switch");

        this.checked = function (checked) {
            if (checked !== undefined) {
                dom.checked = checked;
            }

            if (dom.checked)
                ui.removeClass("off").addClass("on");
            else
                ui.removeClass("on").addClass("off");

            dom.value = dom.checked ? "on" : "off";

            return dom.checked;
        };

        this.disabled = function (disabled) {
            if (disabled !== undefined) {
                dom.disabled = disabled;
            }

            if (dom.disabled)
                ui.addClass("disabled");
            else
                ui.removeClass("disabled");

            return dom.disabled;
        };

        var init = (function () {
            if (!ui || ui.length == 0) {
                This.wrap("<span class='switch'></span>");
                ui = This.parent(".switch");
            }

            This.checked();
            This.disabled();

            This.on("change", function (e) {
                This.checked();
            });
        })();

        return this;
    },

    range: function (options) {
        var This = this;
        var dom = this[0];
        var ui = this.parent(".range");
        var bar = ui.children(".range-bar");
        var active = ui.children(".range-active");

        options = $.extend({
            max: This.attr("max") ? This.attr("max") : 100,
            step: This.attr("step") ? This.attr("step") : 1,
            value: This.val() ? This.val() : 0
        }, options);

        this.val = function (val) {
            if (val !== undefined) {
                dom.value = val;

                var activeWidth = (val / options.max) * ui.offset().width;
                active.css({ width: activeWidth });
                //bar.css({"-webkit-transform": 'translate3d(' + (activeWidth - 110) + 'px,0,0)'});
                bar.css({ left: activeWidth });
            }

            return dom.value;
        };

        var init = (function () {
            if (!ui || ui.length == 0) {
                This.wrap("<span class='range'></span>");
                ui = This.parent(".range");
            }
            if (!bar || bar.length == 0) {
                This.before("<span class='range-bar'></span>");
                bar = ui.children(".range-bar");
            }
            if (!active || active.length == 0) {
                This.before("<span class='range-active'></span>");
                active = ui.children(".range-active");
            }

            This.attr(options);
            This.val(options.value);
            This.transferCssTo(ui);
            var width = ui.offset().width;
            var left = ui.offset().left;
            bar.on("touchmove mousemove", function (e) {
                $H.browser.discrollable();
                var pageX;
                if (e.type == "touchmove") {
                    pageX = e.touches[0].pageX;
                }
                else if (e.type == "mousemove") {
                    pageX = e.pageX;
                }
                if (pageX >= left && pageX <= left + width) {
                    var activeWidth = pageX - left;

                    var value = parseInt((activeWidth / width) * options.max, 10);
                    This.val(value);

                    This.trigger("change");
                }

            }).on("touchend mouseup", function () {
                $H.browser.scrollable();
            });
        })();

        return this;
    }
});

$.extend($.fn, {
    select: function (options) {
        var This = this;
        var dom = this[0];
        var ui = this.parent(".select");
        var text = ui.children("span");
        options = $.extend({
            displayText: function (opt) { return opt ? opt.text : ""; }
        }, options);

        this.count = function () {
            return dom.options.length;
        };

        this.displayText = options.displayText;

        //遵循原则：获取或操作只能针对dom元素进行
        //保证options的顺序是通过index从小到大
        this.options = function (opts) {
            opts = (opts == undefined) ? null : ($.isArray(opts) ? opts : [opts]);

            var selectedOptions = [], o, p;
            for (var j = 0; j < dom.options.length; j++) {
                o = dom.options[j];
                if (opts == null)
                    selectedOptions.push({ index: o.index, value: o.value, text: o.innerHTML, selected: o.selected });
                else
                    for (var i = 0; i < opts.length; i++) {
                        p = opts[i];
                        //如果匹配到相应的option的属性
                        if (opts.length == 0 ||
                            (p.value == undefined || o.value == p.value) &&
                            (p.index == undefined || o.index == p.index) &&
                            (p.text == undefined || o.innerHTML == p.text) &&
                            (p.selected == undefined || o.selected == p.selected)) {
                            selectedOptions.push({ index: o.index, value: o.value, text: o.innerHTML, selected: o.selected });
                            break;
                        }
                    }
            }

            return selectedOptions;
        };

        this.selected = function (opt) {
            var selectedOpt;
            if (opt === undefined) {
                if (dom.selectedIndex == -1) {
                    selectedOpt = null;
                }
                else {
                    var option = dom.options[dom.selectedIndex];
                    selectedOpt = {
                        index: dom.selectedIndex,
                        value: option ? option.value : option,
                        text: option ? option.innerHTML : option,
                        selected: true
                    };
                }
            }
            else {
                var opts = This.options(opt);
                if (opts.length >= 1) {
                    selectedOpt = opts[opts.length - 1];
                    if (dom.selectedIndex != selectedOpt.index) {
                        selectedOpt.selected = true;
                        dom.selectedIndex = selectedOpt.index;
                        This.trigger("change");
                    }
                }
            }

            return selectedOpt;
        };

        //按照index从小到大的insert，如果index超出select>options的长度范围则插入到最后
        //如果设置了selected，控件会选中最后一次被设置了selected的选项，忽略它的顺序
        this.insert = function (opts) {
            if (opts != undefined) {
                //先排序
                opts = $.isArray(opts) ? opts : [opts];
                opts.sort(function (a, b) {
                    return a.index - b.index;
                });
                var changed = false;
                for (var i = 0; i < opts.length; i++) {
                    var insertOpt = $("<option>").val(opts[i].value || "").text(opts[i].text || "");
                    if (This.count() == 0)
                        insertOpt.appendTo(This);
                    else {
                        var insertIndex = opts[i].index || 0;
                        if (insertIndex < This.count())
                            $(dom.options[insertIndex]).before(insertOpt);
                        else
                            $(dom.options[This.count() - 1]).after(insertOpt);
                    }

                    if (opts[i].selected) {
                        dom.selectedIndex = opts[i].index;
                        changed = true;
                    }
                }
                if (changed)
                    This.trigger("change");
                return opts;
            }
        };
        //按照index从大到小的remove
        this.remove = function (opts) {
            if (opts === undefined) {
                if (dom.options.length > 0) {
                    This.empty();
                    This.trigger("change");
                }
            }
            else {
                opts = This.options(opts);
                var selectedRemove = false;
                for (var i = opts.length - 1; i >= 0 ; i--) {
                    if (opts[i].selected) selectedRemove = true;
                    $(dom.options[i]).remove();
                }
                if (selectedRemove)
                    This.trigger("change");
            }
            return opts;
        };
        //todo:本期不提供update
        this.update = function (opt) {
            if (opt !== undefined) {
            }
        };

        var init = (function () {
            if (!ui || ui.length == 0) {
                This.wrap("<span class='select'></span>");
                ui = This.parent(".select");
                This.transferCssTo(ui);
                ui.touchActive();
            }

            if (!text || text.length == 0) {
                text = $("<span>");
                ui.append(text);
            }
            if (This.selected()) {
                text.html(This.displayText(This.selected()));
            }

            This.on("change", function () {
                text.html(This.displayText(This.selected()));
            });
        })();

        return this;
    },

    mupselect: function (args) {
        var $this = this, wrap, dom, span, doChange = false;
        args = $.extend({
            displayText: function (opts) {
                if (opts.length == 0)
                    return $this.attr("data-placeholder") || "";

                var txt = [];
                for (var i = 0; i < opts.length; i++)
                    txt.push(opts[i].text);
                return txt.join(",").trim();
            }
        }, args);

        var display = function () {
            var selectedOptions = $this.options({ selected: true });
            span.html($this.displayText(selectedOptions));
            return selectedOptions;
        };

        this.displayText = args.displayText;

        this.count = function () { return dom.options.length; };

        this.options = function (opts) {
            opts = (opts == undefined) ? null : ($.isArray(opts) ? opts : [opts]);
            var selectedOptions = [], o, p;
            for (var j = 0; j < dom.options.length; j++) {
                o = dom.options[j];
                if (opts == null)
                    selectedOptions.push({ index: o.index, value: o.value, text: o.innerHTML, selected: o.selected });
                else
                    for (var i = 0; i < opts.length; i++) {
                        p = opts[i];
                        //如果匹配到相应的option的属性
                        if (opts.length == 0 ||
                            (p.value == undefined || o.value == p.value) &&
                            (p.index == undefined || o.index == p.index) &&
                            (p.text == undefined || o.innerHTML == p.text) &&
                            (p.selected == undefined || o.selected == p.selected)) {
                            selectedOptions.push({ index: o.index, value: o.value, text: o.innerHTML, selected: o.selected });
                            break;
                        }
                    }
            }
            return selectedOptions;
        };

        this.selected = function (opts) {
            var selectedOptions = $this.options({ selected: true });
            if (opts == undefined)
                return selectedOptions;

            var selectingOptions = $this.options(opts);

            for (var i = 0; i < dom.options.length; i++)
                dom.options[i].selected = false;

            dom.value = null;

            for (var i = 0; i < selectingOptions.length; i++)
                dom.options[selectingOptions[i].index].selected = true;

            if (selectedOptions.length == selectingOptions.length) {
                var flag = false;
                for (var i = 0; i < selectingOptions.length; i++) {
                    flag = false;
                    for (var j = 0; j < selectingOptions.length; j++) {
                        if (selectedOptions[i].index == selectingOptions[j].index)
                            flag = true;
                    }
                    if (!flag) {
                        doChange = true;
                        $this.trigger("change");
                        doChange = false;
                        return selectingOptions;
                    }
                }
            } else {
                doChange = true;
                $this.trigger("change");
                doChange = false;
            }

            return selectingOptions;
        };

        this.remove = function (opts) {
            if (opts === undefined) {
                if ($this.count() > 0) {
                    $this.empty();
                    doChange = true;
                    $this.trigger("change");
                    doChange = false;
                }
            }
            else {
                opts = $this.options(opts);
                var selectedRemove = false;
                for (var i = opts.length - 1; i >= 0 ; i--) {
                    if (opts[i].selected)
                        selectedRemove = true;
                    $(dom.options[i]).remove();
                }
                if (selectedRemove) {
                    doChange = true;
                    $this.trigger("change");
                    doChange = false;
                }
            }
            return opts;
        };

        this.insert = function (opts) {
            if (opts != undefined) {
                opts = $.isArray(opts) ? opts : [opts];
                opts.sort(function (a, b) {
                    return a.index - b.index;
                });
                var changed = false;
                for (var i = 0; i < opts.length; i++) {
                    var insertOpt = $("<option>").val(opts[i].value || "").text(opts[i].text);
                    if (opts[i].selected)
                        insertOpt[0].selected = changed = true;
                    if ($this.count() == 0)
                        insertOpt.appendTo($this);
                    else {
                        var insertIndex = opts[i].index || 0;
                        if (insertIndex < $this.count())
                            $(dom.options[insertIndex]).before(insertOpt);
                        else
                            $(dom.options[$this.count() - 1]).after(insertOpt);
                    }
                }
                if (changed) {
                    doChange = true;
                    $this.trigger("change");
                    doChange = false;
                }
                return opts;
            }
        };

        var init = function () {
            if (!(wrap = $this.parent(".mupselect")) || wrap.length == 0)
                wrap = $this.wrap("<span class='mupselect'></span>").parent(".mupselect");

            if (!(span = wrap.children("span")) || span.length == 0)
                span = $("<span>").appendTo(wrap);

            //兼容PC上的多选，macpc的多选与51返利的ua一致，不能显示！
            if ($H.os.type() == "windowspc")
                $this.css("opacity", "1");

            dom = $this[0];
            display();

            /*
            解决ios7多选框的bug(https://discussions.apple.com/message/23745665#23745665)
            ios7上的浏览器原生多选控件有2个bug：
            1、点击多选控件时，如果第一个选项是选中状态，会将其显示为“非选中”，但其实内存中该选项实际是选中状态的。
            2、当选完后，点击“完成”按钮后，会将当前已经滚动到中间的选项反选，即，若已选中则去掉选中，若未选则将其选中。
            */
            if ("iosiphone,iosipod".indexOf($H.os.type()) != -1 && $H.os.ver() >= 7) {
                var lastSelectedOptions = $this.options({ selected: true });
                $(dom.options[0]).before($("<option>").val("").text("").attr("disabled", "disabled"));
                $this.on("focusin", function () { doChange = true; });
                $this.on("focusout", function () { doChange = false; });
                $this.on("change", function () {
                    if (doChange) {
                        lastSelectedOptions = display();
                        $this.trigger("changed");
                    }
                    else {
                        setTimeout(function () {
                            for (var i = 0; i < dom.options.length; i++)
                                dom.options[i].selected = false;

                            dom.value = null;

                            for (var i = 0; i < lastSelectedOptions.length; i++)
                                dom.options[lastSelectedOptions[i].index].selected = true;
                        }, 1);
                    }
                });
            } else if ("android" == $H.os.type() && "qq" == $H.browser.type()) {
                //解决安卓QQ浏览器多选控件BUG
                $this.on("touchstart", function (e) {
                    $this.css({ "left": e.touches[0].clientX - $(window).width() + 10 + $this.offset().left });
                }).on("touchend", function (e) {
                    setTimeout(function () {
                        $this.css({ "left": 0 });
                    }, 500);
                }).on("change", function (e) {
                    display();
                    $this.trigger("changed");
                });
            } else {
                $this.on("change", function (e) {
                    display();
                    $this.trigger("changed");
                });
            }
        };

        init();
        return this;
    }
});

$.extend($.fn, {
    tabs: function (options) {
        var args = {},
            defaults = {
                selected: 0,
                disabled: [],
                callback: function (args) { }
            },
            opts = $.extend(defaults, options),
            This = $(this);

        this.init = function (opts) {
            if (!This.is("tabs")) {
                This.addClass("tabs");
            };
            var li = This.find(".ul .li"),
                num = li.length,
                width = (100 / num).toFixed(2);
            for (var i = 0; i < num; i++) {
                if (i != num - 1) {
                    li.eq(i).css({ "width": width + "%" });
                } else {
                    var lastWidth = 100 - width * (num - 1);
                    li.eq(i).css({ "width": lastWidth + "%" });
                };
            };

            This.find(".ul .li").eq(opts.selected).addClass("selected");
            This.children("div.content").hide().eq(opts.selected).show();
            This.find(".ul .li").on("click", function (e) {
                e.stopPropagation();
                var index = $(this).index();
                for (var i = 0; i < opts.disabled.length; i++) {
                    if (index == opts.disabled[i]) {
                        return false;
                    };
                };
                $(this).addClass("selected").siblings().removeClass("selected");
                This.children("div.content").eq(index).show().siblings("div.content").hide();
                opts.callback(args);
            });
        };

        this.index = function (index) {
            if (index == undefined) {
                var index = 0,
                index = $(".ul li.selected").index();
                return index;
            } else {
                if (index > -1 && index < This.find(".ul").length && index == parseInt(index)) {
                    This.find(".ul .li").eq(index).trigger("click");
                    opts.callback(args);
                };
            };
        };

        this.init(opts);

        return This;
    },

    page: function (options) {
        options = $.extend({
            url: ""
        }, options);

        var This = this;
        var pages = $(".page");
        var beforePage = {
            zepto: $(pages.get(0))
        };

        this.getBeforePage = function () {
            var page = $(pages.get(0));

            pages.each(function () {
                if ($(this)[0].style.display == "" ||
                    $(this)[0].style.display == "block") {
                    page = $(this);
                }
            });

            return page;
        };

        this.show = function (opts) {
            opts = $.extend({
                data: {},
                scorllTop: 0,
                before: function () { },
                success: function () { },
                complete: function () { },
                error: function () { }
            }, opts);

            opts.before(opts.data);

            beforePage = {
                zepto: this.getBeforePage(),
                scrolledTop: $(window).scrollTop()
            };

            var showHtml = function (html) {
                if (html) {
                    var doc = $H.parseDom(html);

                    $(doc.head).children().each(function () {
                        if ($(this).attr("tagName") == "LINK" ||
                            $(this).attr("tagName") == "META" ||
                            $(this).attr("tagName") == "TITLE") {
                            document.head.insertBefore(this, null);
                        }
                    });

                    This.append($(doc.body).children());

                    var scriptList = [];
                    $(doc).find("script").each(function () {
                        scriptList.push($(this).attr("src"));
                    });
                    $H.loadScript({ url: scriptList });
                }

                $(".page").hide();
                This.css("display", "");
                $(window).scrollTop(opts.scorllTop);
                opts.success(opts.data);
                opts.complete(opts.data);
            };

            if (options.url) {
                $H.ajax({
                    url: options.url,
                    type: "GET",
                    timeout: 15,
                    success: function (html) {
                        showHtml(html);
                    },
                    error: opts.error
                });
            }
            else {
                showHtml();
            }
        };

        this.close = function (opts) {
            opts = $.extend({
                closed: function () { }
            }, opts);

            This.hide();
            beforePage.zepto.show();
            $(window).scrollTop(beforePage.scrolledTop);
            opts.closed();
        };

        return this;
    }
});

$(function () {
    //$(window).bind("touchstart", function () { }).bind("touchend", function () { });
    //$H.browser.hideAddressBar();
    $(".listview li")
        .add(".btn")
        .add("ul.toolbar li")
        .add("a")
        .add("header .header-btn").touchActive();
});