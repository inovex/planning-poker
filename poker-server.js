var http = require('http');
var fs = require('fs');
var url = require('url');
var express = require('express');

var app = express();
app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);

// App Variables
var currentUsers = {};

var readFile = function(filename) {
	var output = '';
	try {
		output = fs.readFileSync(__dirname + '/' + filename, 'utf-8');
	} catch (e) {
		console.log(e);
	}
	return output;
}

app.get('/', function(req, res) {
	res.render('index.html');
	res.end();
});

app.get('/login', function(req, res) {
	currentUsers;
	res.end();
});

app.listen(1337, '127.0.0.1');
console.log('Server running at http://127.0.0.1:1337/');