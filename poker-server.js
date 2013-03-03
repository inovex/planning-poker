var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var express = require('express');
var iniparser = require('iniparser');

console.log('Loading config');
var config = iniparser.parseSync('./config.ini');

var app = express();
app.use(express.static(__dirname + config.filesystem.public_files));
app.set('views', __dirname + config.filesystem.view_files);
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

app.post('/login', function(req, res) {
    var user;
    user = '';
    //res.set('Content-Type', 'application/json');
    req.on('data', function (data) {
        user += data;
        if (user.length > 1e6) {
            // FLOOD ATTACK OR FAULTY CLIENT, NUKE REQUEST
            request.connection.destroy();
        }
    });
    req.on('end', function () {
        user = qs.parse(user);
        // Create random id for user
        user.id = 0;
        //console.log(user);
        currentUsers[user.id] = user;
        res.json(user);
        //res.write(JSON.stringify(user));
    });

	//res.end();
});

app.listen(config.http.port, config.http.listen);
console.log('HTTP Server running at http://' + config.http.listen + ':' + config.http.port + '/');