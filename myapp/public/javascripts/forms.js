/*
 * @Author: zhumaohua 
 * @Date: 2017-02-19 20:02:15 
 * @Last Modified by: zhumaohua
 * @Last Modified time: 2017-02-26 02:15:35
 * @Simple Description:  Javascript for forms page
 */

$(function () {
    'use strict';
    var moment = window.moment

    $(".menu li").click(function () {
        $(this).addClass("border").siblings().removeClass("border");
    });
    $(".date").datepicker();
    $(".start").datepicker({
        defaultDate: "+1w",
        changeMonth: true,
        numberOfMonths: 2,
        onClose: function (selectedDate) {
            $(".end").datepicker("option", "minDate", selectedDate);
        }
    });
    $(".end").datepicker({
        defaultDate: "+1w",
        changeMonth: true,
        numberOfMonths: 2,
        onClose: function (selectedDate) {
            $(".start").datepicker("option", "maxDate", selectedDate);
        }
    });

    var Form = function (n, formData, hidden, type) {
        this.days = n
        this.data = formData
        this.app = formData['appName']
        this.type = type
        this.hidden = hidden
    }

    Form.prototype = {
        formatHeader: function () {
            var headerStr = '<tr><td></td>'
            for (var i = 0; i < 24; i++) {
                headerStr += ['<td>', i, '</td>'].join('')
            }
            this.header = headerStr + '</tr>'
            return this.header
        },

        formatData: function () {
            var tmp = []
            var dataStr
            for (var j = this.days - 1; j >= 0; j--) {
                dataStr = '<tr><td>' + moment(this.data['units'][j][0]['time']).format('YYYY-MM-DD') + '</td>'
                for (var i = 0; i < 24; i++) {
                    dataStr += '<td>' + this.data['units'][j][i][this.type] + '</td>'
                }
                dataStr += '</tr>'
                tmp.push(dataStr)
            }
            this.tableStr = tmp.join('')
            return this.tableStr
        },

        createTable: function () {
            var headStr = this.formatHeader(),
                dataStr = this.formatData()
            var tableStr = headStr + dataStr
            var tmp
            if (this.hidden) {
                tmp = ['<div class="table', '" data-app="', this.app, '" data-days="', this.days, '" ><table class="showTable hidden" style="margin-top: 20px"', ' data-type="', this.type, '">'].join('')
            } else {
                tmp = ['<div class="table', '" data-app="', this.app, '" data-days="', this.days, '" ><table class="showTable" style="margin-top: 20px"', ' data-type="', this.type, '">'].join('')
            }
            tableStr = tmp + tableStr + '</table></div>'
            $('.menu').after(tableStr)
        }
    }

    function formsGenerator(data) {
        var n = data['n'],
            forms = data['showData']
        var ctr = new Form(n, forms, true, 'price'),
            hourPrice = new Form(n, forms, false, 'hourUse'),
            price = new Form(n, forms, true, 'ctr')
        ctr.createTable()
        hourPrice.createTable()
        price.createTable()
    }
   
    window.opdata && formsGenerator(window.opdata)

    $('.selectOne').on('change', function () {
        var type = $(this).find('option:selected').val()
        $('.table[class!="hidden"] .showTable').each(function () {
            var $this = $(this)
            if ($this.data('type') === type) {
                $this.removeClass('hidden')
            } else {
                $this.addClass('hidden')
            }
        })
    })

    var hasCache = {}
    $('.days').on('change', function () {
        var $this = $(this),
            days = $this.val()
        if (hasCache['' + days]) {
            $('.table').each(function () {
                var $this = $(this)
                if ($this.data('days') === days) {
                    $this.removeClass('hidden')
                } else {
                    $this.addClass('hidden')
                }
            })
            return
        }
    })
    // $.ajax({
    //         url: '',
    //         data: {days: days},
    //     }).done(function(data){
    //         hasCache[''+days] = true
    //         $('.table').each(function(){
    //             $(this).addClass('hidden')
    //         })
    //         formsGenerator(data)
    //     })
})