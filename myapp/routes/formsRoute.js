var express = require('express');
var router = express.Router();
var db = require('../db/dbmanager');

router.get('/', (req, res) => {

    // var data = JSON.stringify(formData());
    // res.render('forms', {data: data});
    db.findDefaltSpiderDataForFormsWithUsername(req.session.username,function(error,data){
        var result = JSON.stringify(data);
        console.log(result);
        res.render('forms', {data: result});
    });
});


// function formData() {
//   var tmparr = []
//   for (var i = 0; i < 24; i++)
//     tmparr.push([{"time" : 2016010101,
//             "price":2,
//             "hourUse":4,
//             "ctr":5
//           },{"time" : 2016010101,
//             "price":2,
//             "hourUse":4,
//             "ctr":5
//           },{"time" : 2016010101,
//             "price":2,
//             "hourUse":4,
//             "ctr":5
//           }])
//    return {
//     "showData": {
//         "units": tmparr,
//       "appName": "laifeng"
//     },
//   "n": 3
//   }
// }

module.exports = router
