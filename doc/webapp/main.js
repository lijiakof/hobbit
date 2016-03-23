/// <reference path="../../core/hobbit.js" />
/// <reference path="../../ui/hobbit.ui.js" />
require.config({
    baseUrl: "../../core",
    paths: {
        zepto: "zepto",
        hobbit: "hobbit",
        ui: "../ui/hobbit.ui"
    }
});

require(["zepto", "hobbit", "ui"], function () {
    $("#btnRun").tap(function () {
        $H.ajax({
            url: "../core/browser.htm",
            type: "GET",
            timeout: 15,
            beforeSend: function () {
                $H.loader.show();
            },
            success: function (data) {
                alert(data);
            },
            error: function (xhr, errorType, error) {
                alert(error);
            },
            complete: function () {
                $H.loader.close();
            }
        });
    });
});