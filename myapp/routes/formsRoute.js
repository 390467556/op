var express = require('express');
var router = express.Router();
var db = require('../db/dbmanager');

router.get('/', (req, res) => {
    console.log(`formBody: ${JSON.stringify(req.query)}`);
    // var data = JSON.stringify(formData());
    // res.render('forms', {data: data});
    if (!req.query || !req.query.start || !req.query.end) {
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
