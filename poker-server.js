var http = require('http');
var fs = require('fs');
var url = require('url');
var supportedImages = /\.(css|png)$/;

var readFile = function(filename) {
	var output = '';
	try {
		output = fs.readFileSync(__dirname + '/' + filename, 'utf-8');
	} catch (e) {
		console.log(e);
	}
	return output;
}

http.createServer(function (req, res) {
	var path,
		output;

	path = url.parse(req.url).pathname;
	output = '';

	switch(path) {
		case '/':
			res.writeHead(200, {'Content-Type': 'text/html'});
			output = readFile('templates/index.html');
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

	res.write(output);

	res.end();
}).listen(1337, '127.0.0.1');
console.log('Server running at http://127.0.0.1:1337/');