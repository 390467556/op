var casper = require('casper').create();



  var cookie = '[{"domain":".oppomobile.com","expires":"周日, 12 2月 2017 18:09:10 GMT","expiry":1486922950,"httponly":false,"name":"STORE_USERNAME","path":"/","secure":false,"value":"%E5%9C%9F%E8%B1%86%E6%97%A0%E7%BA%BF"},{"domain":".oppomobile.com","expires":"周日, 12 2月 2017 18:09:10 GMT","expiry":1486922950,"httponly":false,"name":"OPPOSID","path":"/","secure":false,"value":"1983e7f83fa04110bccc619c8aa882d7"},{"domain":"open.oppomobile.com","expires":"周日, 12 2月 2017 18:09:10 GMT","expiry":1486922950,"httponly":false,"name":"PHPSESSID","path":"/","secure":false,"value":"bk5usd96nih48ac9q0i54pa786"}]';
        var cookieObj = JSON.parse(cookie);
        for(i = 0; i<cookieObj.length; i++){
          if (cookieObj[i].name == "OPPOSID") {
            console.log("name" + cookieObj[i].name);
            console.log("value" + cookieObj[i].value);
          }
        }

casper.run();