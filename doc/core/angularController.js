﻿/// <reference path="../core/zepto.js" />
/// <reference path="../core/hobbit.js" />
function ListCtrl($scope) {
	$scope.list = [
		{name:'北京国瑞百捷酒店', start:"三星级", area:"崇文区　崇文门",comm:"89%好评", price:"￥300",coupon:"￥10"},
		{name:'飘HOME连锁酒店-北京定慧桥店', start:"快捷酒店/客栈", area:"崇文区　崇文门",comm:"89%好评", price:"￥300",coupon:"￥10"},
		{name:'北京饭店', start:"五星级", area:"崇文区　崇文门",comm:"89%好评", price:"￥300",coupon:"￥10"},
		{name:'速8酒店（北京前门店）', start:"三星级", area:"崇文区　崇文门",comm:"89%好评", price:"￥300",coupon:"￥10"},
		{name:'北京国瑞百捷酒店', start:"快捷酒店/客栈", area:"崇文区　崇文门",comm:"89%好评", price:"￥300",coupon:"￥10"},
		{name:'北京康福瑞假日酒店（原艺海商务酒店）', start:"高档", area:"崇文区　崇文门",comm:"89%好评", price:"￥300",coupon:"￥10"},
		{name:'汉庭酒店（北京站店）原广渠门二店', start:"快捷酒店/客栈", area:"崇文区　崇文门",comm:"89%好评", price:"￥300",coupon:"￥10"},
		{name:'北京国瑞百捷酒店', start:"三星级", area:"崇文区　崇文门",comm:"89%好评", price:"￥300",coupon:"￥10"},
		{name:'北京亚奥国际酒店（原劳动大厦）', start:"四星级", area:"崇文区　崇文门",comm:"89%好评", price:"￥300",coupon:"￥10"},
		{name:'北京银洋酒店（首都机场新国展店）', start:"舒适", area:"崇文区　崇文门",comm:"89%好评", price:"￥300",coupon:"￥10"},
		{name:'北京国瑞之星宾馆30号', start:"三星级", area:"崇文区　崇文门",comm:"89%好评", price:"￥300",coupon:"￥10"},
		{name:'速8酒店（北京丰台火车站东大街店）', start:"三星级", area:"崇文区　崇文门",comm:"89%好评", price:"￥300",coupon:"￥10"},
		{name:'布丁酒店连锁（北京西站店）', start:"三星级", area:"崇文区　崇文门",comm:"89%好评", price:"￥300",coupon:"￥10"},
		{name:'速8酒店（北京锣鼓巷店）', start:"三星级", area:"崇文区　崇文门",comm:"89%好评", price:"￥300",coupon:"￥10"},
		{name:'北京鸿炜亿家连锁酒店（亚运村店）', start:"三星级", area:"崇文区　崇文门",comm:"89%好评", price:"￥300",coupon:"￥10"},
		{name:'北京考拉酒店', start:"三星级", area:"崇文区　崇文门",comm:"89%好评", price:"￥300",coupon:"￥10"},
		{name:'飘HOME-北京建国门店', start:"三星级", area:"崇文区　崇文门",comm:"89%好评", price:"￥300",coupon:"￥10"},
		{name:'北京春晖园温泉度假酒店（顺义-高丽营）', start:"三星级", area:"崇文区　崇文门",comm:"89%好评", price:"￥300",coupon:"￥10"},
		{name:'中安之家酒店连锁（北京中安宾馆）', start:"三星级", area:"崇文区　崇文门",comm:"89%好评", price:"￥300",coupon:"￥10"},
		{name:'速8酒店（北京宣武门店）', start:"三星级", area:"崇文区　崇文门",comm:"89%好评", price:"￥300",coupon:"￥10"},
		{name:'速8酒店北京东四店', start:"三星级", area:"崇文区　崇文门",comm:"89%好评", price:"￥300",coupon:"￥10"},
		{name:'飘HOME-北京王府井店', start:"三星级", area:"崇文区　崇文门",comm:"89%好评", price:"￥300",coupon:"￥10"}
	];
	
	$scope.addList = function() {
		$H.ajax({
			url: "angularJson.json",
			type: "GET",
			dataType: "json",
			timeout: 15,
			beforeSend: function () {
			    $H.loader.show({
			    	mask: true
			    });
			},
			success: function (data) {
				for(var i = 0; i < data.length;i++){
					$scope.list.push(data[i]);
				}
				//$scope.list.push({name:'飘HOME-北京王府井店', start:"三星级", area:"崇文区　崇文门",comm:"89%好评", price:"￥300",coupon:"￥10"});
			},
			error: function (xhr, errorType, error) {
			    alert(error);
			},
			complete: function () {
			    $H.loader.close();
			}
		});
	};
	
	$scope.listLength = function(){
		return $scope.list.length;
	};
}