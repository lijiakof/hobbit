/*
var _hmt = _hmt || [];
(function() {
  var hm = document.createElement("script");
  hm.src = "//hm.baidu.com/hm.js?%3F05cce32de5e4df0ddcbabc963c03e3a5";
  var s = document.getElementsByTagName("script")[0]; 
  s.parentNode.insertBefore(hm, s);
})();
*/

if(typeof($) == "undefined"){

	if (document.addEventListener) {

		document.addEventListener("DOMContentLoaded", function () {

			var eles = document.querySelectorAll("[data-tj]");

			for (var i = 0; i < eles.length; i++) {

				var ele = eles[i];

				ele.addEventListener("click", function () {

					var mark = this.getAttribute("data-tj");

					if (mark.length > 0) {
						var point = mark;
					} else {
						var point = mark.innerText;
					}

					_hmt.push(['_trackEvent', point, 'click', '']);

        		}, false);

    		}

		}, false)

	}

}else{

	$(function(){

		var ele = $("*[data-tj]");

		if( "ontouchstart" in window ){

			ele.on("touchend", function (e) {

				var This = $(this);

				if (This.attr("data-tj").length > 0) {
					var point = This.attr("data-tj");
				} else {
					var point = This.text();
				}

				_hmt.push(['_trackEvent', point, 'click', '']);

			});

		}else{

			ele.on("click", function (e) {

				var This = $(this);

				if (This.attr("data-tj").length > 0) {
					var point = This.attr("data-tj");
				} else {
					var point = This.text();
				}

				_hmt.push(['_trackEvent', point, 'click', '']);

			});
		}

	});

}

