/*
* @Author: Yuk
* @Date:   2016-05-08 14:00:18
* @Last Modified by:   yingyuk
* @Last Modified time: 2016-05-12 19:39:36
*/

'use strict';
var express = require('express');
var path = require('path');
var app = express();
var port = 4000;

app.use(express.static(__dirname + '/dist'));
app.get('/',function (req,res) {
})
app.listen(port);
console.log('server listening on port ' + port);
