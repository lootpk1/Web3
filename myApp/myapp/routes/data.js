var express = require('express');
var router = express.Router();
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require('fs');
var csv = require('fast-csv');
var Sequelize = require('sequelize');
var stream = require('stream');

const Data = Sequelize.define('Data', {
  country: Sequelize.STRING,
  data: Sequelize.TEXT
});


function getData() {
	var stream = fs.createReadStream('data/reported_maleria_cases.csv');
 
	var csvStream = csv
	.fromString(stream, {headers : true})
    .on("data", function(data){
		tempCountry = data["country"]
			countryData = {}
			for (i = 1990; i <= 2006; i++) 
				year = str(i)
				reported_cases = data[year]
				countryData[year] = reported_cases
		//for loop here
		//save this data to the db
		Data.create({
			country:tempCountry, 
			data:countryData
		})
			
        console.log(data);
    })
    .on("end", function(){
         console.log("done");
    });
}
/* GET data page. */
router.get('/create', function(req, res, next) {
	getData();
  res.render('data', { title: 'Express' }); //does not matter what you return/do here... NOT the display page
});

router.get('/display', function(req, res, next) {
//differet function here to fetch data
//res.json to return the data in a json format 
  data = data.objects()
  res.json('data', { title: 'Express' }); //return the data... don't render the template, just return the json
});

module.exports = router;
