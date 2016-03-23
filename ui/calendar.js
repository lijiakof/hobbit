/// <reference path="../zepto.js" />
/// <reference path="../hobbit.js" />
/// <reference path="dateextend.js" />

$.extend($.fn, {
    calendar: function (options) {
        options = $.extend({
            mindate: new Date(1970, 0, 1), maxdate: new Date(2050, 12, 31),
            validdate: 0, //自定义哪些日期是可用的函数
            now: new Date(),
            cross: 0,
            showing: 0, showed: 0,
            picking: 0, picked: 0,
            hiding: 0, hided: 0,
            print: 0,
            datasource: undefined,
            format: "yyyy-MM-dd",
            monthcount: 1, //多月日历
            firstday: 0,
            animate: 1,
            delay: 300,
            onlytag: 1,
            autohide: 1,
            //bgmonth: 1,
            monthstart: 2,//0不显示，1每月都显示，2仅下月显示
            predatedisabled: 1,
            sufdatedisabled: 1,
            monthbutton: 1,
            lng: {
                week: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
                title: "yyyy年M月",
                next: "下一月",
                prev: "上一月",
                today: "今天",
                months: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
                tag: {
                    "1-1": ["元旦"],//如果需要定义特殊样式，形如：["元旦","yuandan"]
                    "2-14": ["情人节"],
                    "3-8": ["妇女节"],
                    "5-1": ["劳动节"],
                    "6-1": ["儿童节"],
                    "10-1": ["国庆"],
                    "12-24": ["平安夜"],
                    "12-25": ["圣诞"]
                }
            },
            customtag: {
                "2015-2-18": ["除夕"],
                "2015-2-19": ["春节"],
                "2015-3-5": ["元宵节"],
                "2015-4-5": ["清明"],
                "2015-6-20": ["端午节"],
                "2015-8-20": ["七夕"],
                "2015-9-27": ["中秋节"],
            }
        }, options);

        //私有属性
        var $this = this, cards = {}, value = Date.parseDate(options.now), crosser, id = this.attr("id") || ("_" + Math.floor(Math.random() * 1e6));
        //私有方法
        var div = function (cl, parent, prepend) {
            return prepend ? $("<div>").addClass(cl).prependTo(parent) : $("<div>").addClass(cl).appendTo(parent);
        };
        var check = function (v) { return (v >= options.mindate && v <= options.maxdate && (!options.validdate || options.validdate(v))); };

        //构建日历卡片DOM
        var buildCard = function (initClass, date, prepend) {
            date.setDate(1);
            //构建卡片整体框架
            var card = {
                date: new Date(date),
                wrap: div("card " + (options.monthcount == 1 && options.animate ? "animate " : "") + initClass, $this, prepend)
            };
            card.head = { wrap: div("head", card.wrap) };
            card.head.title = div("title", card.head.wrap);
            card.head.week = $("<table>").addClass("week").appendTo(card.head.wrap);
            card.body = $("<table>").addClass("body").appendTo(card.wrap);

            //填充head内容
            card.head.title.html(date.format(options.lng.title))

            if (options.monthbutton) {
                card.head.prev = div("prev", card.head.wrap);
                card.head.next = div("next", card.head.wrap);
                //上一月按钮
                card.head.prev.html(options.lng.prev);
                if (date > options.mindate)
                    card.head.prev.tap(function (e) { e.preventDefault(); $this.prev(); }).touchActive();
                else
                    card.head.prev.addClass("disabled");
                //下一月按钮
                card.head.next.html(options.lng.next);
                if (date.add(date.daysInMonth(), 3) < options.maxdate)
                    card.head.next.tap(function (e) { e.preventDefault(); $this.next(); }).touchActive();
                else
                    card.head.next.addClass("disabled");
            }
            //星期
            var week = [];
            for (var i = 0; i < 7; i++)
                week.push(options.lng.week[options.firstday + i]);
            card.head.week.html("<tr><td>" + week.join("</td><td>") + "</td></tr>");

            //填充body内容
            //按背景：pre,suf,disabled,today,value
            var value = $this.val(),
                pre = (date.getDay() + options.firstday) % 7 || 7,
                suf = pre + date.daysInMonth(),
                tr, item, tmp;
            date.setDate(-1 * pre);

            for (var i = 0; i < 42; i++) {
                date.setDate(date.getDate() + 1);
                if (i % 7 == 0)
                    tr = $("<tr>").appendTo(card.body);
                item = { "class": ["w" + ((i + options.firstday) % 7)], disabled: !1, date: date, dom: null, tags: [] };

                if (i < pre) {
                    item["class"].push("pre");
                    item.disabled = options.predatedisabled;
                } else if (i >= suf) {
                    item["class"].push("suf");
                    item.disabled = options.sufdatedisabled;
                }

                if (item.disabled || !check(date)) {
                    item["class"].push("disabled");
                    item.disabled = 1;
                }

                if (date.equal(value, 3))
                    item["class"].push("value");

                //添加日期内容标记
                item.tags.push({ text: date.getDate(), "class": "day" });

                //添加今天标记
                if (date.equal(options.now, 3))
                    item.tags.push({ text: options.lng.today, "class": "today" });

                //添加自定义标记
                tmp = options.customtag[[date.getFullYear(), date.getMonth() + 1, date.getDate()].join("-")];
                if (tmp)
                    item.tags.push({ text: tmp[0], "class": tmp[1] || "" });

                //添加固定节日标记
                tmp = options.lng.tag[[date.getMonth() + 1, date.getDate()].join("-")];
                if (tmp)
                    item.tags.push({ text: tmp[0], "class": tmp[1] || "" });

                //添加月第一天标记
                if ((options.monthstart == 1 || (options.monthstart == 2 && i >= suf)) && date.getDate() == 1)
                    item.tags.push({ text: options.lng.months[date.getMonth()], "class": "first" });

                //如果有多个标记，判断是否不显示日期标记
                if (options.onlytag && item.tags.length > 1)
                    item.tags.shift();

                item.dom = $("<td>");

                if (options.print)
                    item = options.print(item);

                item["class"].push("r" + item.tags.length);

                tmp = [];
                for (var j = 0; j < item.tags.length && j < 3; j++)
                    tmp.push(["<span class='line l", j + 1, " ", item.tags[j]["class"], "'>", item.tags[j].text, "</span>"].join(""));

                item.dom.addClass(item["class"].join(" ")).html(tmp.join("")).attr({ "data-value": date.getTime() }).appendTo(tr);

                if (!item.disabled) {
                    item.dom.tap(function () {
                        $this.find(".value").removeClass("value");
                        $this.find(".newvalue").removeClass("newvalue");
                        var v = $(this).attr("data-value");
                        $this.find("td[data-value='" + v + "']").addClass("value").addClass("newvalue");
                        $this.val(v);
                    }).touchActive();
                }
            }

            return card;
        };

        //获取日历的日期值
        this.val = function (date) {
            if (date == undefined) {
                switch (typeof options.datasource) {
                    case "undefined": break;
                    case "function": value = options.datasource(); break;
                    default: value = Date.parseDate(typeof options.datasource.length == 'number' ? options.datasource.val() : options.datasource, value); break;
                }
                return value;
            } else {
                date = Date.parseDate(date);
                //执行picking回调，并判断是否继续
                var ifContinue = !options.picking || options.picking(date);
                if (ifContinue) {
                    value = date;
                    //给数据源赋值
                    switch (typeof options.datasource) {
                        case "undefined": break;
                        case "function": options.datasource(value); break;
                        default:
                            if (typeof options.datasource.length == 'number')
                                options.datasource.val(value.format(options.format));
                            else
                                options.datasource = value;
                            break;
                    }
                    //自动关闭日历
                    if (options.autohide)
                        $this.hide();
                    //执行picked回调
                    !options.picked || options.picked(date);
                }
            }
        };

        //转到指定月份的卡片
        this.switchTo = function (date, buildAll) {
            if (!buildAll && !cards.actcard[0].date.equal(date, 2)) {
                if (Math.abs(date.diff(cards.actcard[0].date, 2)) <= 1) {//只差一个月,只需构建1个card
                    if (cards.actcard[0].date < date) {//向后
                        //删除前卡片
                        cards.precard.wrap.remove();
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
                        cards.sufcard.wrap.remove();
                        //将最后一个激活的卡片转为后卡片
                        cards.sufcard = cards.actcard[cards.actcard.length - 1];
                        cards.sufcard.wrap.removeClass("actcard").addClass("sufcard");
                        //将激活的卡片依次转为后一个
                        for (var i = cards.actcard.length - 1; i > 0; i--)
                            cards.actcard[i] = cards.actcard[i - 1];
                        //将前卡片转为第一个激活卡片
                        cards.precard.wrap.removeClass("precard").addClass("actcard");
                        cards.actcard[0] = cards.precard;
                        //创建一个新的新卡片
                        cards.precard = buildCard("precard", cards.precard.date.add(-1, 2), true);
                    }
                }
                else { //相差多余1个月，需重新构建所有card
                    buildAll = true;
                }
            }

            if (buildAll) {
                $this.empty();
                //构建不可见的日历卡片(上一月)
                cards.precard = buildCard("precard", date.add(-1, 2));
                //构建可见日历卡片
                cards.actcard = [];
                for (var i = 0; i < options.monthcount; i++)
                    cards.actcard.push(buildCard("actcard", date.add(i, 2)));
                //构建不可见的日历卡片(下一月)     
                cards.sufcard = buildCard("sufcard", date.add(options.monthcount, 2));
            }
        };

        //修改日历配置信息
        this.setOptions = function (opt) { options = $.extend(options, opt); };

        this.prev = function () { $this.switchTo(cards.actcard[0].date.date(2).add(-1, 2)); };

        this.next = function () { $this.switchTo(cards.actcard[0].date.date(2).add(1, 2)); };

        this.show = function () {
            var ifContiune = !options.showing || options.showing();
            if (ifContiune) {
                //单月日历，如果val与当前card不一致，应switchTo后在show
                if (options.monthcount == 1) {
                    var v = $this.val();
                    if (!v.equal(cards.actcard[0].date, 2))
                        $this.switchTo(v);
                }
                $this.addClass("show");
                !options.showed || options.showed();
            }
        };

        this.hide = function () {
            var ifContiune = !options.hiding || options.hiding();
            if (ifContiune) {
                setTimeout(function () {
                    $this.removeClass("show");
                    !options.hided || options.hided();
                    //单月日历，如果val与当前card不一致，应hide后switchTo一下
                    if (options.monthcount == 1) {
                        var v = $this.val();
                        if (!v.equal(cards.actcard[0].date, 2))
                            $this.switchTo(v);
                    }
                }, options.delay);
            }
        };

        //初始化
        var init = (function () {
            if (!$this.hasClass("calendar"))
                $this.addClass("calendar");

            options.mindate = Date.parseDate(options.mindate);
            options.maxdate = Date.parseDate(options.maxdate);

            var v = $this.val().date(2);
            $this.switchTo(v, true);

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
                    }, 1e3);
                };
                crosser = {
                    date: t1.getDate(),
                    timer: setTimeout(tfn, Date.MSINDAY - t1.getTime())
                };
            } //end options.cross
        })(); //end init

        return this;
    }
});
