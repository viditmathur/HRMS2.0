var express = require('express');
var app = express();
var getcontrollers=require('./routes/getcontrollers');
app.use('/',getcontrollers);
var postcontrollers=require('./routes//postcontrollers');
app.use('/',postcontrollers);

var cors = require('cors');
app.use(cors());

var sql = require('mssql');
console.log("I'm here");

//cors
 app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
       res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS,PATCH');
    
		 if (req.method === 'OPTIONS') {
			 res.send(200);
		 } else {
			 next();
		 }
    });
	
	app.get('/',(req,res)=>{
		res.sendFile('/views/'+process.env.PAGE,{root:__dirname});
	});
	app.use(express.static(__dirname +'/public'));
	app.use(express.static(__dirname +'/views'));
	

//app.use((req,res,next)=>{
//	res.header("Access-Control-Allow-Origin","*");
//	res.header("Access-Control-Allow-Headers",
//	"Origin,X-Requested-With,Content-Type,Accept,Authorization"
//	);
//	if(res.method==="OPTIONS")
//	{
//		res.header('Access-Control-Allow-Methods','PUT,POST,DELETE,PATCH,GET');
//		return res.status(200).json({}); 
//	}
//    next();
//});
//	





    // config for your database
   var dbURL=process.env.TUNNELEND;

    // connect to your database
    sql.connect(dbURL, function (err) {

        if (err) console.log(err);});

var port = process.env.PORT || 5000

var server = app.listen(port,()=> {
    console.log('Server is running..on port ',port);

});
