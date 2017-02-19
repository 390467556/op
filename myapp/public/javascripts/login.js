/*
 * @Author: zhumaohua 
 * @Date: 2017-02-18 14:28:56 
 * @Last Modified by: zhumaohua
 * @Last Modified time: 2017-02-19 17:22:46
 * @Simple Description:  Javascript file for login page
 */

require(['jquery'], function($) {
    // 提交表单之前进行必要校验
    /**
     * 1. 用户名非空
     * 2. 密码非空
     * 无法通过校验的，focus第一个错误栏
     */
    var $submit = $('#submit')

    function isEmpty(elem) {
        var $e = $(elem)
        if ($e.val() == '') {
            $e.focus()
            return true
        }
        return false
    }

    $submit.on('click', function() {
        var $pwd = $('#pwd'),
            $realSubmit = $('#loginSubmit'),
            $userName = $('#userName')

        // TODO: 提示框或者直接alert?
        if (isEmpty($userName)) {
            alert('用户名不能为空')
            return
        }

        if (isEmpty($pwd)) {
            alert('密码不能为空')            
            return
        }
        
        $realSubmit.click()
    })
})