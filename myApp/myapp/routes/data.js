var express = require('express');
var router = express.Router();
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require('fs');
var csv = require('fast-csv');
var Sequelize = require('sequelize');
var stream = require('stream');

//Instantiate sequelize
const sequelize = new Sequelize('test', 'lootpk1', 'P@ssw0rd', {
  host: 'localhost',
  //dialect: 'mysql'|'sqlite'|'postgres'|'mssql',
  dialect: 'postgres',

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },

  // http://docs.sequelizejs.com/manual/tutorial/querying.html#operators
  operatorsAliases: false
});
// You can use the .authenticate() function like this to test the connection.
sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });



const Data = sequelize.define('Data', {
  country: Sequelize.STRING,
  data: Sequelize.TEXT
});

Data.sync();


function getData() {
	console.log("i am now here");
	var stream = fs.createReadStream('data/reported_maleria_cases.csv');
	console.log("and i am now here");
	var csvStream = csv
	.fromStream(stream, {headers : true})
    .on("data", function(data){
		console.log("here????");
		tempCountry = data["country"];
		countryData = {}
		for (var i = 1990; i <= 2006; i++) {
			year = i.toString();
			reported_cases = data[year];
			countryData[year] = reported_cases;
		}
		console.log("and now I am here part 2");
		//for loop here
		//save this data to the db
		Data.create({
			country:tempCountry, 
			data:JSON.stringify(countryData)
		})
		console.log("and now I am the son of here");
    })
    .on("end", function(){
         console.log("done");
    });
}
/* GET data page. */
router.get('/create', function(req, res) {
	console.log("yo, i am here");
	getData();
  res.render('data', { title: 'Express' }); //does not matter what you return/do here... NOT the display page
});

router.get('/display', function(req, res) {
  //differet function here to fetch data
  //res.send to return the data in a json format 
  //var jsonObj = JSON.parse(jsonString);
  Data.findAll().then(data => {
	    res.send(data); //return the data... don't render the template, just return the json
  });
});

module.exports = router;
