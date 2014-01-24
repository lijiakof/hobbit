
(function ($) {
    $.extend($.fn, {
        pager: function (options) {
            options = $.extend({
                index: 0,
                count: 1,
                displayText: function (state) {
                	return (state.index + 1) + "/" + state.count;
               	}
            }, options);

            var This = this;
            var pre = $("<div class='pre arrow left'></div>");
            var nxt = $("<div class='nex arrow'></div>");
            var cot = $("<select class='count'>");
            var sel;
            
            this.index = function (idx) {
                if (idx === undefined) {
                    return options.index;
                }
                else {
                    change({
                        index: options.index
                    }, {
                        index: idx
                    });
                    //todo: 判断最大的index
                    return idx;
                }
            };
            this.count = function (count) {
                if (count === undefined) {
                    return options.count;
                }
                else {
                    options.count = count;
                    return count;
                }
            };
            
            var change = function (to) {
                var from = {
                	index: options.index
                };
                var to = {
                	index: to.index
                };

                This.trigger("before", [from, to]);

                if (to.index <= 0)
                    pre.addClass("disabled");
                else
                    pre.removeClass("disabled");

                if (to.index >= options.count - 1)
                    nxt.addClass("disabled");
                else
                    nxt.removeClass("disabled");

                if (options.index != to.index) {
                    options.index = to.index;
                    //只有select改变的时候触发change事件
                    sel.selected({
                        value: options.index
                    });
                	This.trigger("changed", [from, to]);
                }
            };

            var init = function () {
                This.append(pre).append(cot).append(nxt).touchActive();
                pre.touchActive();
                nxt.touchActive();

                for (var i = 0; i < options.count; i++) {
                    var opt = $("<option>");
                    opt.val(i);
                    opt.text(i + 1);
                    if (i == options.index) {
                        opt.attr("selected", "selected");
                    }
                    cot.append(opt);
                }
                sel = cot.select({
                    displayText: function (opt) {
                        return options.displayText({
							index: opt.index,
							count: options.count
						});
                    }
                });

                change({ index: options.index });

                pre.on("tap", function (state) {
                    if (!$(this).hasClass("disabled")) {                         
                        change({ index: options.index - 1 });
                    }
                });
                nxt.on("tap", function (state) {
                    if (!$(this).hasClass("disabled")) {
                        change({ index: options.index + 1 });
                    }
                });
                cot.on("change", function (e) {
                    change({ index: sel.selected().index });
                });
            };
            
            init();

            return this;
        }
    });
})(Zepto);