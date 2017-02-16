exports.currentTime = function(){
        var now = new Date();

        var year = now.getYear();       //年
        var month = now.getMonth() + 1;     //月
        var day = now.getDate();            //日

        var hh = now.getHours();            //时

        year = year.toString().substr(1, 2);
        var clock = year;


        if(month < 10)
            clock += "0";

        clock += month;

        if(day < 10)
            clock += "0";

        clock += day ;

        if(hh < 10)
            clock += "0";

        clock += hh ;
        return(clock);
};
