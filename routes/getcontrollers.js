var sql = require('mssql');
var express = require('express');
var router=express.Router();

router.get('/Employee/:id', function (req, res) {
	res.header("Access-Control-Allow-Origin","*");
	
	 var  EmployeeId=req.params.id;

        // create Request object
        var request = new sql.Request();
		request.query("exec getEmployeeDetailsById @EmployeeId="+EmployeeId+";", function (err, recordset){
			  
            if (err){
			console.log(err);}
			else
			{	
         res.status(201).json(recordset.recordset[0]);
			console.log(recordset);}  
			
		    
        
    });
});

router.get('/login', function (req, res) {
	res.header("Access-Control-Allow-Origin","*");
	
        var request = new sql.Request();
		
		
		request.query("select * from login", function (err, recordset){
		
           if (err) {
			   console.log(err)}
    res.status(201).json(recordset);
			 
		    
        
    });
});
   router.get('/techStack/:id', function (req, res) {
	res.header("Access-Control-Allow-Origin","*");
  
        var request = new sql.Request();
		
		
		request.query("select * from techStack where Employeeid="+req.params.id+";", function (err, data){
	 
            if (err) console.log(err)
          res.status(201).json(data.recordset);
			 
		    
        
    });
});

router.get('/count',(req,res,next)=>{
res.header("Access-Control-Allow-Origin","*");

	
	 var request = new sql.Request();
		
		
		request.query("select count(*) as count from employee",(err,recordset)=>{
			if(err){
		console.log(error);}
		else
   
        
       
       { res.status(201).send(recordset);
	   }
		
		})
});
router.get('/count2',(req,res,next)=>{
		res.header("Access-Control-Allow-Origin","*");

	
	 var request = new sql.Request();
		
		request.query("select count(*) as count from skills",(err,recordset)=>{
			if(err){
		console.log(error);}
		else
   
        
       
       { res.status(201).send(recordset);
	   }
		
		})
		
});


/*router.get('/employee', function (req, res) {
	
res.header("Access-Control-Allow-Origin","*");
        
        var request = new sql.Request();
		request.query("select * from employee", function (err, recordset){
		 
            if (err) console.log(err)
    res.status(201).json(recordset);
			 
		    
        
    });
});*/
router.get('/employee', (req,res,next)=>{
	res.header("Access-Control-Allow-Origin","*");
    var pagenum = parseInt(req.headers.pagenumber);
    var limit= parseInt(req.headers.limit);
    var skipValue = (pagenum-1)*limit;
    console.log(skipValue,limit);
	 var request = new sql.Request();
		
		
		request.query("select * from employee where EmployeeId BETWEEN "+(skipValue+1)+" and ("+limit+" *"+pagenum+")",function(err, employee){
        if(err){
            res.status(500).send("Error occured");
        }
        else{
            res.status(201).json(employee);
        }
    });
});

router.get('/skills/:id', (req,res,next)=>{
	res.header("Access-Control-Allow-Origin","*");
	 var request = new sql.Request();
		
		
		request.query("select * from skills where Id ="+req.params.id+";",function(err, skills){
        if(err){
            res.status(500).send("Error occured");
        }
        else{
            res.status(201).json(skills.recordset);
        }
    });
});

router.get('/skills', (req,res,next)=>{
	res.header("Access-Control-Allow-Origin","*");
    var pagenum = parseInt(req.headers.pagenumber);
    var limit= parseInt(req.headers.limit);
    var skipValue = (pagenum-1)*limit;
    console.log(skipValue,limit);
	 var request = new sql.Request();
		
		
		request.query("select * from skills where Id BETWEEN "+(skipValue+1)+" and ("+limit+" *"+pagenum+")",function(err, skills){
        if(err){
            res.status(500).send("Error occured");
        }
        else{
            res.status(201).json(skills);
        }
    });
});

router.get('/skill/getAll', (req,res,next)=>{
	res.header("Access-Control-Allow-Origin","*");
	 var request = new sql.Request();
		
		
		request.query("select * from skills",function(err, skill){
        if(err){
            res.status(500).send("Error occured");
        }
        else{
            res.status(201).json(skill.recordset);
        }
    });
});

module.exports=router;