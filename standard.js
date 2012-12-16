/**
 * @author Jay Lee
 */

var PI = 3.14;
var MAX_Value = 20000;

/**
 *  about this function
 * @method fn
 * @param {String} str
 * @param {number} nu
 * @return {String}
 * */
function fnName(str, nu) {
    alert("");
	return "";
}

/**
 * Constructs ClassName objects
 * @param {String} id
 * @return {Object}
 * */
ClassName = function(id){	
	this.publicProperty = "publicProperty";
	//private member
	var variable = "";
}
/**
 * Static function of ClassName
 * */
ClassName.staticFunction = function() {
	alert("this is static function");
}
/**
 * Public function of ClassName
 */
//$H.ext(publicFunction,null,{
//	publicFunction: function(){
//		
//	}
//});
function test(){
    var cla = new ClassName();
	cla.publicFunction();
	ClassName.staticFunction();
}
