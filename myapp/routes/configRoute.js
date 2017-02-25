const express = require('express');
const db = require('../db/dbmanager')

const router = express.Router();


router.get('/', (req, res) => {
    res.render('config', { warn: undefined });
});


router.post('/', (req, res) => {
    console.log(`config : ${JSON.stringify(req.body)}`);
    db.findOneUserWithUsername(req.session.username,(error,user) => {

        let tasks = convertConfigModelToDBModel(req.body);
        let taskNumber = 0;
          db.saveTasks(tasks, (error, data) => {
            const configData = req.body;
            data.msg = '提交成功';
            res.render('config', data);
          })  
      });
    });

function convertConfigModelToDBModel(configModel) {
    let startTime = new Date(configModel.start);
    let endTime = new Date(configModel.end);
    let startTimestamp = startTime.getTime();
    let endTimestamp = endTime.getTime();
    let days = (endTimestamp - startTimestamp) / (60 * 60 * 24 * 1000);
    let tasks = [];
    let hours = [];
    for (let i = 0; i < 24; i += 1) {
        let hour = `value${i}`;
        if (configModel[hour].length > 0) {
          hours.push(i);
        }
    }
    for (let n = 0; n < days; n += 1) {
        startTime.setDate(n);
        for (let m = 0; m < hours.length; m += 1) {
            startTime.setHours(hours[m]);
            let task = {};
            task.platformName = configModel.name;
            task.appName = configModel.appname;
            task.appUserName = configModel.appusrname;
            task.appUserPwd = configModel.apppwd;
            task.dt = startTime.getTime();
            task.price = configModel[`value${hours[m]}`];
            tasks.push(task);
        }
    }
    return tasks;
}

function saveTask(uid, task, handler) {
    db.insertTask(uid, task.platformName, task.appUserName, task.appUserPwd,
      task.appName, task.dt, task.price, true, handler);
}

module.exports = router;
