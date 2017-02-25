const express = require('express');
const db = require('../db/dbmanager')

const router = express.Router();


router.get('/', (req, res) => {
    res.render('config', { warn: undefined });
});


router.post('/', (req, res) => {
    console.log(`config : ${JSON.stringify(req.body)}`);
    db.findOneUserWithUsername(req.session.username,(error,user) => {
        const tasks = convertConfigModelToDBModel(user.uid, req.body);
        console.log(`task length : ${tasks.length}`);
        db.saveTasks(tasks, (error, taskResult) => {
            if (error) {
                res.render('config', {msg: '提交失败'});
            } else {
                const body = req.body;
                body.msg = '提交成功';
                res.render('config', body);
            }
        });
    });
});

function convertConfigModelToDBModel(uid, configModel) {
    const startTime = new Date(configModel.start);
    const endTime = new Date(configModel.end);
    const startTimestamp = startTime.getTime();
    const endTimestamp = endTime.getTime();
    const days = ((endTimestamp - startTimestamp) / (60 * 60 * 24 * 1000)) + 1;
    const tasks = [];
    const hours = [];
    for (let i = 0; i < 24; i += 1) {
        const hour = `value${i}`;
        if (configModel[hour].length > 0) {
            hours.push(i);
        }
    }
    const savedTime = new Date(configModel.start);
    for (let n = 0; n < days; n += 1) {
        savedTime.setDate(startTime.getDate() + n);
        for (let m = 0; m < hours.length; m += 1) {
            savedTime.setHours(hours[m]);
            console.log(`date : ${savedTime}`);
            const task = {};
            task.platform_name = configModel.name;
            task.app_name = configModel.appname;
            task.account_name = configModel.appusrname;
            task.account_password = configModel.apppwd;
            task.dt = savedTime.getTime();
            task.price = configModel[`value${hours[m]}`];
            task.uid = uid;
            tasks.push(task);
        }
    }
    return tasks;
}

// function saveTask(uid, task, handler) {
//     db.insertTask(uid, task.platformName, task.appUserName, task.appUserPwd,
//       task.appName, task.dt, task.price, true, handler);
// }

module.exports = router;
