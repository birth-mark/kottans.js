var express = require('express');
var port = process.env.PORT || 3000;
var app = express();

app.use(express.static('./public'))
.listen(port, function() {

console.log('Example app listening on port ' + port);
});