/*
 * @Author: zhumaohua 
 * @Date: 2017-02-18 13:53:07 
 * @Last Modified by: zhumaohua
 * @Last Modified time: 2017-02-18 14:19:29
 * @Simple Description:  Javascript file for register page
 */


require(['jquery'], function($) {
    'use strict';

    // 提交表单之前进行必要校验
    /**
     * 1. 用户名非空
     * 2. 密码非空
     * 3. 确认密码非空
     * 4. 密码和确认密码一致
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
            $pwdCheck = $('#pwdCheck'),
            $realSubmit = $('#registerSubmit'),
            $userName = $('#userName')

        // TODO: 提示框或者直接alert?
        if (isEmpty($userName)) {
            return
        }

        if (isEmpty($pwd)) {
            return
        }

        if (isEmpty($pwdCheck)) {
            return
        }
        
        if ($.trim($pwd.val()) != $.trim($pwdCheck.val())) {
            alert('两次输入的密码不同，请确认后重新输入')
            return
        }
        
        $realSubmit.submit()
    })
})