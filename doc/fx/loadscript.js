/// <reference path="../../zepto.js" />
/// <reference path="../../hobbit.js" />
$(function () {
    $H.dialog.show({
        title: "$H.loadscript",
        content: "你现在运行的脚本是来自另外一段 js 中的脚本！",
        buttons: [{
            text: "确定",
            callback: function () {
                $H.dialog.close();
            }
        }],
        mask: true,
        scrollable: false
    });
});