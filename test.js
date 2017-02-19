var timer = require('./presetTimer');
var timer2 = require('./showTimer');


for (var i = 0; i < 1; i++) {
  var date = new Date();
  timer2.schedule(i);
}
