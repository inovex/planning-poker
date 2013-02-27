var http = require('http');
var fs = require('fs');
var url = require('url');
var express = require('express');

var app = express();
app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);

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

app.listen(1337, '127.0.0.1');
console.log('Server running at http://127.0.0.1:1337/');

/*
http.createServer(function (req, res) {
	var path,
		output;

	path = url.parse(req.url).pathname;
	output = '';

	switch(path) {
		case '/':
			
			break;

		default:
			if ((/\.(css)$/).test(path)) {
				res.writeHead(200, {'Content-Type': 'text/css'});
				output = readFile(path);
			} else if (supportedImages.test(path)) {
				image = path.match(supportedImages)
				res.writeHead(200, {'Content-Type': 'image/' + image[1]});
				output = readFile(path);
			} else {
				res.writeHead(404, {'Content-Type': 'text/html'});
				output = '404!!!1';
			}
	}

	
}).listen(1337, '127.0.0.1');
*/