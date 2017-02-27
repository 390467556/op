$(function () {
    $(".menu li").click(function () {
        $(this).addClass("border").siblings().removeClass("border");
    });

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
    })


    function msgHelper (msg) {
        return '请输入' + msg
    }

    var msgMap = {
        name: msgHelper('平台名称'),
        appusrname: msgHelper('平台用户名'),
        apppwd: msgHelper('用户名密码'),
        appname: msgHelper('app名称'),
        end: msgHelper('终止时间'),
        start: msgHelper('开始时间')
    }
    $('#submitButton').on('click', function () {
        var allRight = true
        $('.nonEmpty').each(function () {
            var $this = $(this)
            if (!$this.val()) {
                allRight = false
                alert(msgMap[$this.attr('name')])
            }
        })
        allRight && $('#realSubmit').click()
    })
})