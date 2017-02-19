/*
 * @Author: zhumaohua 
 * @Date: 2017-02-19 20:02:15 
 * @Last Modified by: zhumaohua
 * @Last Modified time: 2017-02-19 23:40:45
 * @Simple Description:  Javascript for forms page
 */


define('formsGen', ['jquery', 'moment'], function($, moment) {
    'use strict';
    $(function () { 
        $(".menu li").click(function(){
			$(this).addClass("border").siblings().removeClass("border");
		});
		$( ".date" ).datepicker();
    });

    var Form = function(n, formData, className) {
        this.days = n
        this.data = formData
        this.className = className
        this.app = formData['appName']
    }

    Form.prototype = {
        formatHeader: function() {
            var headerStr = '<tr><td></td>'
            for (var i = this.days - 1; i >= 0; i--) {
                headerStr += ['<td>', moment().substract(i, 'days').calendar(), '</td>'].join('')
            }
            this.header = headerStr + '</tr>'
        },

        formatData: function() {
            var tmp = new Array(24)
            var dataStr
            for (var i = 0; i < 24; i++) {
                dataStr = '<tr><td>' + i + '</td>'
                for (var j = 0; j < 3; j++) { 
                    dataStr += '<td>' + this.data['units'][i][j][this.type] + '</td>'
                }
                dataStr += '</tr>'
                tmp.push(dataStr)
            }
            this.tableStr = tmp.join('')
        },

        createTable: function() {
            var headStr = this.formatHeader(),
                dataStr = this.formatData()
            var tableStr = headStr + dataStr
            var tmp = ['<div class=', this.className, ' data-app=', this.app, '><table style="margin-top: 20px">'].join('')
            tableStr = tmp + tableStr + '</table></div>'
            $('.menu').after(tableStr)
        }
    }

    function formsGenerator(n, forms) {
        var ctr = new Form(n, forms, 'active'),
            hourPrice = new Form(n, forms, 'hidden'),
            price = new Form(n, forms, 'hidden')           
    }
})

