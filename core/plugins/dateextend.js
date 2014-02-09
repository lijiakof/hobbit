//日期扩展
$.extend(Date.prototype, {
    //格式化输出日期
    format: function (fmt) { fmt = fmt || "yyyy-MM-dd"; var t = this.toArray(), o = { "M+": t[1] + 1, "d+": t[2], "h+": t[3], "m+": t[4], "s+": t[5], "q+": Math.floor((t[1] + 3) / 3), "S": t[6] }; if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (t[0] + "").substr(4 - RegExp.$1.length)); for (var k in o) { if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length)); } return fmt; },
    //是否是闰年
    isLeapYear: function () { var y = this.getFullYear(); return (0 == y % 4 && ((y % 100 != 0) || (y % 400 == 0))); },
    //该月有多少天
    daysInMonth: function () { return [31, 0, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][this.getMonth()] || (this.isLeapYear() ? 29 : 28); },
    //返回这一天是这一年的第几天
    dayOfYear: function () { return Math.ceil((this.getTime() - new Date(this.getFullYear(), 0, 1).getTime()) / Date.MSINDAY); },
    //返回添加相应时间后的时间(默认不指定mode=7则按毫秒为单位)
    //mode:1-年，2-月，3-日，4-时，5-分，6-秒，7-毫(默认)
    add: function (v, mode) { if (mode < 3) { var r = new Date(this); if (mode == 1) r.setYear(r.getFullYear() + v); else r.setMonth(r.getMonth() + v); return r; } else return new Date(this.getTime() + [1, 0, 0, Date.MSINDAY, Date.MSINHOUR, Date.MSINMINUTE, Date.MSINSECOND, 1][mode || 7] * v); },
    //返回日期的部分，默认年月日，可以通过mode参数指定精度
    //mode:1-年，2-月，3-日(默认)，4-时，5-分，6-秒，7-毫
    date: function (mode) { var t = this.toArray(); for (var i = mode || 3; i < 7; i++) t[i] = i == 2 ? 1 : 0; return new Date(t[0], t[1], t[2], t[3], t[4], t[5], t[6]); },
    //将时间转换为数组
    toArray: function () { return [this.getFullYear(), this.getMonth(), this.getDate(), this.getHours(), this.getMinutes(), this.getSeconds(), this.getMilliseconds()]; },
    //判断两个时间是否相等，可以通过mode参数指定判断的精度
    //mode:1-年，2-月，3-日，4-时，5-分，6-秒，7-毫(默认)
    equal: function (date, mode) { if (typeof this != typeof date) return false; var t = this.toArray(); date = date.toArray(); for (var i = 0; i < (mode || 7) ; i++) if (t[i] != date[i]) return false; return true; }
});

$.extend(Date, {
    //转换对象、字符串或数字为日起对象
    parseDate: function (v, d) { switch (typeof v) { case "object": case "number": v = new Date(v); break; case "string": v = new Date(isNaN(v) ? v.trim().replace(/\-/g, "/") : parseInt(v)); break; } return v == "Invalid Date" ? d : v; },
    MSINSECOND: 1e3, MSINMINUTE: 6e4, MSINHOUR: 36e5, MSINDAY: 864e5
});