var express = require('express');
var router = express.Router();

function getData() {
sequelize.sync()
	var stream = fs.createReadStream('data/reported_maleria_cases.csv');
 
	var csvStream = csv()
    .on("data", function(data){
		//for loop here
		//still have to add a page to call the getData()
        console.log(data);
    })
    .on("end", function(){
         console.log("done");
    });
	stream.pipe(csvStream);
}
/* GET data page. */
router.get('/', function(req, res, next) {
getData();
  res.render('data', { title: 'Express' });
});
module.exports = router;
