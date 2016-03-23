/// <reference path="../../zepto.js" />
/// <reference path="../../hobbit.js" />
/// <reference path="../../plugin/webapp.js" />
$(function () {
    $("header .back").touchActive();
    $("header .menu").touchActive();
    $("header > .back").bind("click", function () {
        history.back();
    });

    $("#search").on("click", function () {
        $H.app.changePage({
            url: "hotellist.htm"
        });
    });
});