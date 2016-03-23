/// <reference path="../zepto.js" />
/// <reference path="../hobbit.js" />
/// <reference path="dateextend.js" />

$.extend($.fn, {
    calendar: function (options) {
        options = $.extend({
            mindate: new Date(1970, 0, 1), maxdate: new Date(2050, 12, 31),
            validdate: 0,//自定义哪些日期是可用的函数
            //error: 0,
            now: new Date(),
            cross: 0,
            showing: 0, showed: 0,
            picking: 0, picked: 0,
            hiding: 0, hided: 0,
            print: 0,
            datasource: undefined,
            monthcount: 1,//多月日历
            firstday: 0,
            animate: 0,
            autohide: 1,
            onlytag: 0,
            bgmonth: 1,
            monthstart: 1,
            predatedisabled: 1,
            sufdatedisabled: 0,
            lng: {
                week: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
                title: "yyyy年M月",
                next: "下一月",
                prev: "上一月",
                today: "今天",
                months: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"]
            },
            customtag1: 0
        }, options);

        //私有属性
        var $this = this, ui = this[0], cards = {}, value = options.now, crosser, id = ui.attr("id") || ("_" + Math.floor(Math.random() * 1000000));
        //私有方法
        var div = function (cl, parent) { return $("<div>").addClass(cl).appendTo(parent); };
        var check = function (v) { return (v >= options.mindate && v <= options.maxdate && (!options.validdate || options.validdate(v))); };

        //构建日历卡片DOM
        var buildCard = function (initClass, date) {
            date.setDate(1);
            //构建卡片整体框架
            var card = {
                date: date,
                wrap: div("card " + initClass, ui)
            };
            card.head = { wrap: div("head", card.wrap) };
            card.head.title = div("title", card.head.wrap);
            card.head.prev = div("prev", card.head.wrap);
            card.head.next = div("next", card.head.wrap);
            card.head.week = $("<table>").addClass("week").appendTo(card.head.wrap);
            card.body = $("<table>").addClass("body").appendTo(card.wrap);

            //填充head内容
            card.head.title.html(date.format(options.lng.title))
            //上一月按钮
            card.head.prev.html(options.lng.prev);
            if (date > options.mindate)
                card.head.prev.on("tap", function () { $this.switchTo(date.add(-1, 2)); }).touchActive();
            else
                card.head.prev.addClass("disabled");
            //下一月按钮
            card.head.next.html(options.lng.next);
            if (date.add(date.daysInMonth(), 3) < options.maxdate)
                card.head.next.on("tap", function () { $this.switchTo(date.add(1, 2)); }).touchActive();
            else
                card.head.next.addClass("disabled");
            //星期
            var week = [];
            for (var i = 0; i < 7; i++)
                week.push(options.lng.week[option.firstday + i]);
            card.head.week.html("<table><tr><td>" + week.join("</td><td>") + "</td></tr></table>");

            //填充body内容
            //按背景：pre,suf,disabled,today,value
            var value = $this.val(),
                pre = (date.getDay() + option.firstday) % 7 || 7,
                tr, html, item = { "class": "day", disabled: 0, date: 0, dom: 0, tags: [] };
            //cl: null, inval: null, txt: null, show: null, id: null, date: date, pointer: null 
            date.setDate(-1 * pre);

            for (var i = 0; i < 42; i++) {
                date.setDate(date.getDate() + i);
                if (i % 7 == 0)
                    tr = $("<tr>").appendTo(card.body.wrap);
                item.date = date;

                if (i < pre) {
                    item["class"] = "pre";
                    item.disabled = options.predatedisabled;
                } else if (i >= (pre + date.daysInMonth())) {
                    item["class"] = "suf";
                    item.disabled = options.sufdatedisabled;
                } else {
                    item["class"] = "day";
                    item.disabled = 0;
                }

                if (!check(date)) {
                    item["class"] += " disabled";
                    item.disabled = 1;
                }

                if (value.equal(date, 3))
                    item["class"] += " value";

                if (date.equal(options.now, 3))
                    item.tags.push({ text: options.lng.today, "class": "today" });

                if (options.monthstart && date.getDate() == 1)
                    item.tags.push({ text: options.lng.months[date.getMonth()], "class": "monthstart" });

                if (options.print)
                    item = options.print(item);

                item.dom = $("<td>").attr({
                    "data-value": date.getTime(),
                    "data-tags": 0
                }).appendTo(tr);

                if (item.tags.length > 0) {
                    if (option.onlytag)
                        item.dom.html(["<span class='line1 ", item.tags[0]["class"], "'>", item.tags[0].text, "</span>"].join(""));
                    else
                        item.dom.html(["<span class='line1'>", date.getDate(), "</span><span class='line2 ", item.tags[0]["class"], "'>", item.tags[0].text, "</span>"].join(""));
                } else
                    item.dom.html("<span class='line1'>" + date.getDate() + "</span>");

                if (!item.disabled) {
                    item.dom.on("tap", function () {
                        $this.val($(this).attr("data-value"));
                    }).on("touchstart", function (e) {
                        e.preventDefault();
                        //构建变大的日期 todo
                    }).on("touchend", function () {
                        //回复变大的日期 todo
                    });
                }
            }
        };

        //获取日历的日期值
        this.val = function (date) {
            if (date == undefined) {
                switch (typeof options.datasource) {
                    case "undefined": return value;
                    case "function": return options.datasource();
                    default: return Date.parseDate(options.datasource, value);
                }
            } else {
                date = Date.parseDate(date);
                var ifContinue = !options.picking || options.picking(date);
                if (ifContinue) {
                    value = date;
                    if (options.autohide)
                        $this.hide();
                    !options.picked || options.picked(date);
                }
            }
        };

        //修改日历配置信息
        this.setOptions = function (opt) {
            options = $.extend(options, opt);
        };

        //转到指定月份的卡片
        this.switchTo = function (date) {
            if (!cards.actcard[0].date.equal(date, 2)) {
                if (date.date(2) - cards.actcard[0].date.date(2) < Date.MSINDAY * 32) {//只差一个月,只需构建1个card
                    if (cards.actcard[0].date < date) {//向后
                        //删除前卡片
                        cards.precard.wrap.empty();
                        delete cards.precard;
                        //将第一个激活的卡片转为前卡片
                        cards.precard = cards.actcard[0];
                        cards.precard.wrap.removeClass("actcard").addClass("precard");
                        //将激活的卡片依次转为前一个
                        for (var i = 0; i < cards.actcard.length - 1; i++)
                            cards.actcard[i] = cards.actcard[i + 1];
                        //将后卡片转为最后一个激活卡片
                        cards.sufcard.wrap.removeClass("sufcard").addClass("actcard");
                        cards.actcard[cards.actcard.length - 1] = cards.sufcard;
                        //创建一个新的后卡片
                        cards.sufcard = buildCard("sufcard", cards.sufcard.date.add(1, 2));
                    } else {//向前
                        //删除后卡片
                        cards.sufcard.wrap.empty();
                        delete cards.sufcard;
                        //将最后一个激活的卡片转为后卡片
                        cards.sufcard = cards.actcard[cards.actcard.length - 1];
                        cards.sufcard.wrap.removeClass("actcard").addClass("sufcard");
                        //将激活的卡片依次转为后一个
                        for (var i = cards.actcard.length - 1; i > 1; i--)
                            cards.actcard[i] = cards.actcard[i - 1];
                        //将前卡片转为第一个激活卡片
                        cards.precard.wrap.removeClass("precard").addClass("actcard");
                        cards.actcard[0] = cards.precard;
                        //创建一个新的新卡片
                        cards.precard = buildCard("precard", cards.precard.date.add(-1, 2));
                    }
                }
                else {//相差多余1个月，需重新构建所有card
                    if (cards.actcard[0].date < date) {//向后

                    } else {//向前

                    }
                }
            }
        };

        this.prev = function () { $this.switchTo($this.val().date(2).add(-1, 2)); };

        this.next = function () { $this.switchTo($this.val().date(2).add(1, 2)); };

        this.show = function () {
            var ifContiune = !options.showing || options.showing();
            if (ifContiune) {
                var v = $this.val();
                //如果val与当前card不一致，应switchTo餐后在show
                if (!v.equal(cards.actcard[0].date, 2))
                    $this.switchTo(v);
                ui.addClass("show");
                !options.showed || options.showed();
            }
        };

        this.hide = function () {
            var ifContiune = !options.hiding || options.hiding();
            if (ifContiune) {
                ui.removeClass("show");
                !options.hided || options.hided();
                //如果val与当前card不一致，应hide后switchTo一下
                var v = $this.val();
                if (!v.equal(cards.actcard[0].date, 2))
                    $this.switchTo(v);
            }
        };

        //初始化
        var init = (function () {
            options.mindate = Date.parseDate(options.mindate);
            options.maxdate = Date.parseDate(options.maxdate);

            var v = $this.val();
            //构建可见日历卡片
            cards.actcard = [];
            for (var i = 0; i < options.monthcount; i++)
                cards.actcard.push(buildCard("actcard", v.add(i, 2)));
            //构建不可见的日历卡片
            cards.precard = buildCard("precard", v.add(-1, 2));
            cards.sufcard = buildCard("sufcard", v.add(options.monthcount, 2));

            //跨天检查回调
            if (options.cross) {
                var t1 = new Date()
                var tfn = function () {
                    window.clearTimeout(crosser.timer);
                    crosser.timer = setInterval(function () {
                        var t2 = new Date();
                        if (crosser.date != t2.getDate()) {
                            crosser.date = t2.getDate();
                            options.cross();
                            window.clearInterval(crosser.timer);
                            crosser.timer = setTimeout(tfn, Date.MSINDAY - t2.getTime());
                        }
                    }, 1000);
                };
                crosser = {
                    date: t1.getDate(),
                    timer: setTimeout(tfn, Date.MSINDAY - t1.getTime())
                };
            }//end options.cross
        })();//end init

        return this;
    }
});
/*
——a)         [原有] 可设定日期可选范围，且可自定义日期是否可用。
——b)         [原有] 支持自定义输出日期格式。
——c)         [原有] 支持自定义空值选中的日期。
——d)         [原有] 支持浏览器后退可关闭日历。
——e)         [原有] 支持浏览器前进、后退后日历的值能够保持（手机Chrome浏览器除外）。
——f)          [原有] 支持使用JS打开、设置、获取、翻月、关闭、动态设定范围。
g)         [原有] 支持周末、当前所选日期或日期范围、今天、带标记、禁用、额外日期自定义样式。
h)         [升级] 自定义星期的第一天。
i)           暂时没有这个需求·[升级] 支持显示1个或多个月份的日历面板供用户选择日期。——原版仅支持1个月。
j)           很重要·[升级] 支持延迟加载JS——原版支持懒加载，但用户首次点开日历时依然会Loading，延迟加载在不影响页面加载速度的同时，用户首次点开日历时也无需等待。
k)         [升级] 支持初始化前后；开关日历前后；选择日期前后；更改日期前后；翻月前后；渲染日期；延迟加载完毕后触发回调函数。（多个日历联动就靠这些回调函数）
l)           [升级] 支持月份起始、今天、明天、后天、节日、自定义标记（自定义标记如：农历、深夜、入住、离店等）。
——m)       [升级] 支持一个页面中同时存在多个日历实例，但日历DOM元素使用单例。
——n)         [升级] 支持zepto，使用扩展zepto元素的新控件规范方式编写。
——o)         很重要·[新增] 支持自动根据服务器当前时间纠正日期值。——原版没此功能，因此页面放一天后显示的日期是昨天的。
q)         [新增] 支持打开、关闭、翻月动画效果，以及可配置的延迟时间（如点日期后多久自动关闭日历）。
r)         [新增] 点日期时命中提示，类似iphone/android键盘按下时字母放大的效果。
响应式设计解决日历在不同手机上高度自适应
年月可点击出select
+++++++++++++++++++++
http://www.oschina.net/news/41077/15-page-transitions-effects-tutorials-in-css3-and-jquery
翻转动画:http://www.zhangxinxu.com/wordpress/?p=565
http://tympanus.net/codrops/category/tutorials/page/2/
+++++++++++++++++++++
p)         暂时没有这个需求·[新增] 日期范围选择，即可以设置为在同一个日历面板上同时选入住日期和离店日期。
*/