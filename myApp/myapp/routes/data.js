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
  //country: sequelize.STRING,
  data: sequelize.TEXT
});


function getData() {
	var stream = fs.createReadStream('data/reported_maleria_cases.csv');
 
	var csvStream = csv
	.fromString(stream, {headers : true})
    .on("data", function(data){
		console.log(data);
		 //tempCountry = data["country"]
		 
		//console.log(tempCountry);
			/*countryData = {}
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
			
        console.log(data);*/
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
