var express = require('express');
var bodyParser = require('body-parser');
var router = require('./router.js');
var app = express();

app.use("/cdn", express.static("public"));

app.use(bodyParser.urlencoded({ extended: true, }));
app.use(bodyParser.json());

app.use("/", router);

app.listen(process.env.PORT || 8000);
console.log("Express server running on port: " + process.env.PORT);
