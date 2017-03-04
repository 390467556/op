var express = require('express');
var router = express.Router();
var db = require('../db/dbmanager');

router.get('/', (req, res) => {
    console.log(`formBody: ${JSON.stringify(req.query.start)}`);
    // var data = JSON.stringify(formData());
    // res.render('forms', {data: data});
<<<<<<< d5001dbac3bc98cdabcc6ed6e90887effe0f7873
    if (!req.query || !req.query.start || !req.query.end) {
=======
    if (!req.query ||  (!req.query.start && !req.query.end) ) {
     
>>>>>>> restart
        db.findDefaltSpiderDataForFormsWithUsername(req.session.username,function(error,data){
            const result = JSON.stringify(data);
            // console.log(result);
            res.render('forms', { data: result });
        });
    } else {
        // db.findDefaltSpiderDataForFormsWithUsername(req.session.username,function(error,data){
        //     var result = JSON.stringify(data);
        //     // console.log(result);
        //     res.render('forms', {data: result});
        // });
        console.log(`query is : ${JSON.stringify(req.query)}`);
        db.findSpiderDataForForms(req.session.username, req.query.start, req.query.end,
          (error, data) => {
              const result = JSON.stringify(data);
              res.render('forms', { data: result });
          });
    }
});


function formData() {
  var tmparr = []
  for (var i = 0; i < 24; i++)
    tmparr.push({"time" : 2016010101,
            "price":2,
            "hourUse":4,
            "ctr":5
        })
   return {
    "showData": {
        "units": [tmparr, tmparr, tmparr],
      "appName": "laifeng"
    },
  "n": 3
  }
}

module.exports = router
