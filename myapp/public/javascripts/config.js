$(function () {
			$(".menu li").click(function(){
				$(this).addClass("border").siblings().removeClass("border");
			});
			
			$( ".start" ).datepicker({
             defaultDate: "+1w",
             changeMonth: true,
             numberOfMonths: 2,
             onClose: function( selectedDate ) {
            $( ".end" ).datepicker( "option", "minDate", selectedDate );
            }
           });
           $( ".end" ).datepicker({
            defaultDate: "+1w",
            changeMonth: true,
            numberOfMonths: 2,
            onClose: function( selectedDate ) {
           $( ".start" ).datepicker( "option", "maxDate", selectedDate );
           }
          })
})