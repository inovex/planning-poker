var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
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

app.listen(1337, '127.0.0.1');
console.log('Server running at http://127.0.0.1:1337/');