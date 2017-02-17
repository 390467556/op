脚本调用：node index.js 账号 密码

------------------------------------------------------

### 注册、登录：

账号:username
密码:passwd

-------------------------------------------------------

### 编辑信息页面:

    uid
    营销平台：ad_channel
    账号：ad_username
    密码：ad_passwd

------------------------------------------------------

### 编辑应用分发出价页面： 写入预设置数据的接口

输入：

      app_name:产品名称
      [
      {
      start_date：起始日期
      end_date:结束日期
      },...
      ]
      day_data: 一天的price
      dayBudget:日限额(一天的) //不加

输出：

       {
        "errno":0,
        "errmsg":"ok",
        "time":11111111
       }
 ------------------------------------------------------

### 展示报表页面： 接口 获取该用户下所有表数据

输入：

      uid
      app_name(可选)
      日期 数组(可选，可多选)
      //默认查找三天的数据

输出：

      多天数据

      multi_data[
      {
       day_data:day_data, //一天的数据
       date:20161212 //数据对应的那一天
      }，
      {
       day_data:day_data,
       date:20161212
      },
      ....
      ]


      每天的数据(24小时的数据)
      day_data[
        hour_data1, //每小时单位model
        hour_data2,
        ....
      ]


      单个小时的数据
      hour_data{
        hour:1, //几点
        price:2, //单价
        hourUse:3 //每小时消耗
        ctr:4//下载量
      }

------------------------------------------------------
### 预设置出价表单
输入：(一个app下的出价设置)

      app_name  //产品名称
      start_date //生效时间起始日期
      end_date //生效时间结束日期
      day_data//一天设置的出价规则

> 多个app下的出价设置：上面数据的数组


------------------------------------------------------

### API:
1、注册:

2、登录:

3、填写营销平台相关账号信息(目前只支持一个就可以):

4、获取一个app对应某个日期区间的应用分发数据:

5、获取多个app名称:

6、设置出价数据表:


--------------------------------------------------------

### 数据表

##### 用户信息表 users

      username:用户名
      passwd:密码
      task:task_id
      show:show_id

##### app信息表 apps

[app1,app2,app3....]


##### 设置任务信息表

task {
  ad_channel:{
    channel_type:
    oppo_username:oppo用户名
    oppo_passwd:oppo密码
  }
app:{date: 12:00
     price : 5
    appname: lf
}
}


##### 设置爬虫任务表

show_task{
  uid:111
  oppo_username:111
  oppo_passwd:222
}

##### 展示信息表

show:{
  app_name:[
  hour_data,
  ....
  ]
}


hour_data:{
  time:2016010101,
  price:2,
  hourUse:4,
  ctr:5
}
