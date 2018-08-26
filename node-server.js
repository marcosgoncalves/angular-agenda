var express = require('express');
var app = express();

var port = 41125;

app.use(express.static(__dirname + '/app'));

var server = app.listen(port, function () {
    console.log('Servidor node express rodando na porta: ' + port);
});