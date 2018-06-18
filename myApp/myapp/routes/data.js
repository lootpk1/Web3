var express = require('express');
var router = express.Router();
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require('fs');
var csv = require('fast-csv');
var sequelize = require('sequelize');
var stream = require('stream');


function getData() {
	var stream = fs.createReadStream('data/reported_maleria_cases.csv');
 
	var csvStream = csv()
    .on("data", function(data){
		//for loop here
		//save this data to the db
        console.log(data);
    })
    .on("end", function(){
         console.log("done");
    });
	stream.pipe(csvStream);
}
/* GET data page. */
router.get('/create', function(req, res, next) {
	getData();
  res.render('data', { title: 'Express' }); //does not matter what you return/do here... NOT the display page
});

router.get('/display', function(req, res, next) {
//differet function here to fetch data
//res.json to return the data in a json format 
  res.json('data', { title: 'Express' }); //return the data... don't render the template, just return the json
});

module.exports = router;
