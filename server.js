/*
* @Author: Yuk
* @Date:   2016-05-08 14:00:18
* @Last Modified by:   Yuk
* @Last Modified time: 2016-05-08 15:37:23
*/

'use strict';
var express = require('express');
var path = require('path');
var app = express();
var port = 4000;

app.use(express.static(__dirname + '/src'));
app.get('/',function (req,res) {
})
app.listen(port);
console.log('server listening on port ' + port);
