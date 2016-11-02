var express = require('express');

var app = express();

app.use(express.static(_dirname + '/public'));

var port = 6666;

app.listen(port);
console.log('server on '+ port);

