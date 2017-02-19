/*
 * @Author: zhumaohua 
 * @Date: 2017-02-19 20:02:15 
 * @Last Modified by: zhumaohua
 * @Last Modified time: 2017-02-19 20:02:58
 * @Simple Description:  Javascript for forms page
 */


require(['jqurery'], function($) {
    $(function () { 
        $(".menu li").click(function(){
			$(this).addClass("border").siblings().removeClass("border");
		});
		$( ".date" ).datepicker();
    });
})
