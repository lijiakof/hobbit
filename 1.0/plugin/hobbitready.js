//DOM加载事件顺序
var $H = (function () {
    var $H = function (onready, onload, ondelay) {
        if (onready) $H.onreadys.push(onready);
        if (onload) $H.onloads.push(onload);
        if (ondelay) $H.ondelays.push(ondelay);
    }
    $H.onreadys = [];
    $H.onloads = [];
    $H.ondelays = [];
    return $H;
})();