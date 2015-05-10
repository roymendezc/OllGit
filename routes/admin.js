var express = require('express');
var router = express.Router();
var mysql = require('mysql');


var connection = mysql.createConnection({

	host		: 'localhost',
	user		: 'root',
	password	: 'root',
	database	: 'oll_serviciosilimitados'
});

connection.connect();

/* GET home page. */
router.get('/', function(req, res, next) {
  connection.query('SELECT * FROM projects', function(err, rows, fields){

  	if(err) throw err;

  	res.render('dashboard', {
  		"rows": rows,
  		layout: 'layout2'
  	});
  });
});

router.get('/new', function(req, res, next) {

	res.render('new');
});

router.post('/new', function(req, res, next){

	var title = req.body.title;
	var description = req.body.description;
	var service = req.body.service;
	var client = req.body.client;
	var projectDate = req.body.projectDate;

	//Check Image
	
	if (req.files.projectImage) {

		//File Info
		var projectImageOriginalName = req.files.projectImage.originalname;
		var projectImageName = req.files.projectImage.name;
		var projectImageMime = req.files.projectImage.mimetype;
		var projectImagePath = req.files.projectImage.path;
		var projectImageExt = req.files.projectImage.extension;
		var projectImageSize = req.files.projectImage.size;
	} else {
		var projectImageName = 'noimage.png';
	}

	// form field validation

	req.checkBody('title', 'el titulo es requerido').notEmpty();
	req.checkBody('service', 'el servicio es requerido').notEmpty();

	var errors = req.validationErrors();

	if (errors) {

		res.render('new', {
			errors: errors,
			title: title,
			description: description,
			service: service,
			client: client
		});
	} else {
		var project = {
			title: title,
			description: description,
			service: service,
			client: client,
			date: projectDate,
			image: projectImageName
		};

		var query = connection.query('INSERT INTO projects SET ?', project, function(err, result){

			//Project Inserted
		});

		req.flash('success', 'Project Added');

		res.location('/admin');
		res.redirect('/admin');
	} 
});

module.exports = router;
