
var express = require('express');
var bodyParser = require('body-parser');
var api = require('./dbconfig.js');
var orch = require('orchestrate')(api.dbkey);
var path = require('path');
var logger = require('morgan');

// function Listdb() {
// orch.list("tasks").then(function (response) {
//    response.body.results.map( function(e,i) {
//       console.log(e.value);
//    });
//    // console.log(response.body.results);
// });
// }
//
// orch.put("tasks", "2", {
//   "title": "eat a snack",
//   "description": "healthy one",
//   "creator": "do",
//   "assignee": "do",
//   "status": "New"
// }).then(function (res) {
//    Listdb();
// });

var app = express();
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : false}));
app.use(express.static(__dirname));

// app.use(express.static(path.join(__dirname, 'public')));

// var database = {};
//
// database.users = [
	// {"username":"do"},
	// {"username":"jesse"},
	// {"username":"mitch"}
// ];
//
// database.tasks =
// [
// 	{
// 	    "title": "finish project",
// 	    "description": "let's figure out backbone goddammit",
// 	    "creator": "mitch",
// 	    "assignee": "",
// 	    "status": "Unassigned"
// 	  },
// 	  {
// 	    title: 'eat a snack',
// 	    description: "healthy one",
// 	    creator: 'do',
// 	    assignee: 'do',
// 	    status: 'New'
// 	  },
// 	  {
// 	    title: 'Newest Task',
// 	    description: "healthy one",
// 	    creator: '',
// 	    assignee: '',
// 	    status: 'Unassigned'
// 	  }];

function showData(collname) {
	orch.list(collname).then(function (res) {
		console.log(collname+' data store is now: ', res.body.results);
	});
}

// function getOne(collname) {
// 	app.get('/'+collname+'/:id', function (req, res) {
// 		var id = req.params.id;
// 		console.log('Sending model #%s...',id);
// 		orch.get(collname, id)
// 		.then(function (data) {
// 			res.send(data.body.results.value);
// 		});
// 	});
// }

function putOne(collname) {
	app.put('/'+collname+'/:username/:id?', function (req, res) {
		var id = req.params.id;
		console.log('Receiving model #%s...',id);
		orch.put(collname, String(id), req.body).then(function (data) {
			res.send({"id":id});
		});
	});
}

function postOne(collname) {
	app.post('/'+collname+'/:username?', function (req, res) {
		console.log('Receiving new model...');
		orch.post(collname, req.body).then(function (data) {
			res.send({"id": data.path.key});
			showData(collname);
			console.log('Assigning id of %s',data.path.key);
		});
	});
}

function getAll(collname) {
	app.get('/'+collname, function (req, res) {
		console.log('Sending all models...');
		orch.list(collname).then(function (data) {
			res.send(parseData(data));
		});
	});
}

function getUserTasks() {
	app.get('/tasks/:username', function (req, res) {
		var uname = req.params.username;
		orch.search('tasks', 'value.creator:'+uname+' OR value.assignee:'+uname)
		.then(function (data) {
			res.send(parseData(data));
		});
	});
}

function getUnassigned() {
	app.get('/unassigned', function (req, res) {
		console.log("=====/unassigned route=====");
		orch.search('tasks', 'value.status:Unassigned')
		.then(function (data) {
			res.send(parseData(data));
			console.log("-----parseData-----", parseData(data));
		});
	});
}

function parseData(data) {
	var parsed = [];
	for (var i=0; i < data.body.count; i++) {
		parsed.push(data.body.results[i].value);
		if (!("id" in parsed[i])) {
			parsed[i].id = data.body.results[i].path.key;
		}
	}
	return parsed;
}

function makeRoutes(collname) {
	// getOne(collname);
	postOne(collname);
	putOne(collname);
	getAll(collname);
}

var database = ["tasks", "users"];

database.forEach(makeRoutes);
getUserTasks();
getUnassigned();

app.listen(3000);
database.forEach(showData);
