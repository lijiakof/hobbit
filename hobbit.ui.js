/// <reference path="zepto.js" />
/// <reference path="hobbit.js" />
$(function () {
    $(window).bind("touchstart", function () { }).bind("touchend", function () { });
    //$H.browser.hideAddressBar();
    $(".listview li").each(function () {
        if (!$(this).hasClass("active")) {
            $(this).bind("touchstart mousedown", function () {
                var zpt = $(this);
                zpt.addClass("active");
                if (!$H.browser.isIOS)
                    setTimeout(function () { zpt.removeClass("active"); }, 800);
            }).bind("touchcancel touchend mouseup", function () {
                $(this).removeClass("active");
            });
        }
    });
});


$H.ui = {
    base: $H.klass(null, {
        struct: function (options) { }
    }),
    button: null,
    checkbox: $H.klass($H.ui.base, {
        struct: function (options) {
            if ($(options.sel).length == 0)
                return null;

            this.ckb = $(options.sel);

            this.box = $("<span></span>");
            this.$ = this.ckb.parent().attr("for", this.ckb.attr("id")).append(this.box);
            if (this.ckb.attr("disabled"))
                this.$.addClass("disabled");
            this.refresh();

            var self = this;
            //使用onchange事件，防止onclick事件将会引发事件冒泡
            this.ckb.change(function () { self.refresh(); });
            //绑定onclick事件，触屏设备才能激活change
            this.$.bind("click", function () { });
        },
        refresh: function () {
            if (this.ckb[0].checked)
                this.box.addClass("checked");
            else
                this.box.removeClass("checked");
        },
        checked: function () {
            if (!this.ckb[0].checked) {
                this.ckb[0].checked = true;
                this.ckb.trigger("change");
            }
        },
        unchecked: function () {
            if (this.ckb[0].checked) {
                this.ckb[0].checked = false;
                this.ckb.trigger("change");
            }
        },
        val: function (v) {
            return this.ckb.val(v);
        },
        ischecked: function () {
            return this.ckb[0].checked;
        }
    }),
    radio: $H.klass($H.ui.base, {
        struct: function (selector) {
            if ($(selector).length == 0)
                return null;

            this.rad = $(selector);
            this.circle = $("<span></span>");
            this.$ = this.rad.parent().attr("for", this.rad.attr("id")).append(this.circle);
            if (this.rad.attr("disabled"))
                this.$.addClass("disabled");
            this.name = this.rad.attr("name");
            this.refresh();
            var self = this;
            //使用onchange事件，防止onclick事件将会引发事件冒泡
            this.rad.change(function () { self.refresh(); });
            //绑定onclick事件，触屏设备才能激活change
            this.$.bind("click", function () { });
        },
        refresh: function () {
            $("input[name=" + this.name + "]").each(function () {
                if ($(this)[0].checked)
                    $(this).next().addClass("checked");
                else
                    $(this).next().removeClass("checked");
            });
        },
        checked: function () {
            if (!this.rad[0].checked) {
                this.rad[0].checked = true;
                this.rad.trigger("change");
            }
        },
        unchecked: function () {
            if (this.rad[0].checked) {
                this.rad[0].checked = false;
                this.rad.trigger("change");
            }
        },
        val: function (v) {
            return this.rad.val(v);
        },
        ischecked: function () {
            return this.rad[0].checked;
        }
    }),
    select : $H.klass($H.ui.base, {
        struct: function (selector) {
            if ($(selector).length == 0)
                return null;

            this.sel = $(selector);
            if (this.sel.parent("label").length == 0)
                this.sel = $(selector).wrap("<label class='select'></label>");

            this.$ = this.sel.parent();
            this.txt = this.$.children("span");
            if (this.txt.length == 0)
                this.txt = $("<span>").appendTo(this.$);
            this.refresh();
            var self = this;
            this.sel.change(function () { self.refresh(); });
        },
        refresh: function () {
            this.txt.html(this.text());
        },
        addOption: function (key, value) {
            this.sel.append("<option value='" + key + "'>" + value + "</option>");
        },
        clearAll: function () {
            this.sel[0].options.length = 0;
        },
        index: function (v) {
            var ov = this.sel[0].selectedIndex;
            if (v !== undefined) {
                if (ov != v) {
                    this.sel[0].selectedIndex = v;
                    this.sel.trigger("change");
                }
            }
            else
                return ov;
        },
        text: function (v) {
            var idx = this.index();
            var ov = idx < 0 ? null : this.sel[0].options[idx].innerHTML;
            if (v !== undefined) {
                if (ov != v) {
                    for (var i = 0; i < this.sel[0].options.length; i++) {
                        if (this.sel[0].options[i].text == v) {
                            this.sel[0].selectedIndex = i;
                            this.sel.trigger("change");
                            break;
                        }
                    }
                }
            }
            else
                return ov;
        },
        val: function (v) {
            var ov = this.sel.val();
            if (v !== undefined) {
                if (ov != v) {
                    this.sel.val(v);
                    this.sel.trigger("change");
                }
            } else
                return ov;
        }
    }),
    input: null,
    suggestion: null,
    listview: null,
    tabs: null
};


