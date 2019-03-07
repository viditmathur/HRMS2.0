var sql = require('mssql');
var express = require('express');
var bodyParser=require('body-parser');
const router=express.Router();
const multer = require('multer');
const sgMail = require('@sendgrid/mail');
const bcrypt=require('bcrypt');
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
    extended:true

}));

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, '../uploads');
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    // reject other file formats.

    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },

    fileFilter: fileFilter
});
//to change image
router.patch('updateimage/:id', upload.single('ProfilePicUrl'), (req,res,next)=>{
res.header("Access-Control-Allow-Origin","*");
    var EmployeeId=req.params.id;
    // create Request object
    var request = new sql.Request();
    request.query("exec updateImage @ProfilePicUrl='"+req.file.path+"',@EmployeeId='"+EmployeeId+"';", function (err, recordset){
        if (err){
            console.log(err);}
        else
            // send records as a response

            res.send("profile pic has been changed");

    });
});
//to add a new skill
router.post('/skill', function (req, res) {
	res.header("Access-Control-Allow-Origin","*");



    // create Request object
    var request = new sql.Request();
    request.query("exec stpAddNewSkill @SkillName='"+req.body.SkillName+"',@Category='"+req.body.Category+"';", function (err, recordset){

        if (err){
            console.log(err);}
        else
        {
            res.send("skill has  been added");
            console.log(recordset);}



    });
});
//to add a skill in tech stack

router.post('/addskillbyid/:id', function (req, res) {

res.header("Access-Control-Allow-Origin","*");

    // create Request object
    var request = new sql.Request();
    request.query("exec addSkillById @SkillId="+req.body.SkillId+",@EmployeeId="+req.params.id+";", function (err, recordset){

        if (err){
            console.log(err);}
        else
        {
            res.send("skill added in techstack");
            console.log(recordset);
		}
    });
});
//to fill details in login table as credentials psased from auth.
//passes basic data in employee table as well
/*router.post('/addcredentials', function (req, res) {



        // create Request object
        var request = new sql.Request();
		console.log(req.body.Status);
		request.query("exec createCredentials @FirstName='"+req.body.FirstName+"',@LastName='"+req.body.LastName+"' ,@Email='"+req.body.Email+"',@Password='"+req.body.Password+"',@Status='"+req.body.Status+"',@Role='"+req.body.Role+"',@Department='"+req.body.Department+"',@DateOfJoining='"+req.body.DateOfJoining+"',@Location='"+req.body.Location+"';", function (err, recordset){

            if (err){
			console.log(err);}
			else
			{
         res.send("credentials added");
		 sgMail.setApiKey('');
     const msg = {
               to: req.body.Email,
               from: 'admin12@cygrp.com',
                subject: 'Accounted created',
                 text: 'your account has been created.',
                  html: '<h1 style="color:red;">welcome to cyber group</h1><br><p>hi ' +req.body.FirstName+' <br> please login to your account</p> <strong>your email id is: ' +req.body.Email+' and password is:'  +req.body.Password+' </strong>',
};
                  sgMail.send(msg);
			console.log(recordset);}



    });
});*/

router.delete("/techstack/:userId/:skillId", (req, res, next)=>{
		var request = new sql.Request();
		request.query("Delete from TechStack where SkillId=" + req.params.skillId + " and Employeeid=" + req.params.userId + ";", function(err, data){
				if(err){
					res.status(500).send("Cannot Delete");
				}
				else{
					res.status(201).send("Record Deleted");
				}
		});
});

router.post("/employee", (req, res, next) => {
	res.header("Access-Control-Allow-Origin","*");

    var request = new sql.Request();
    request
        .query("select Email from employee where Email='"+req.body.Email+"'",function (err, recordset){
        
        if (recordset.length >= 1) {
            return res.status(409).json({
                message: "Mail exists"
            });
        } 
        else {
            bcrypt.hash(req.body.Password, 10, (err, hash) => {
                if (err) {
                    return res.status(500).json({
                        error: err
                    });
                } 
                else {
                    // create Request object
                    var request = new sql.Request();
					
                    console.log(req.body.Status);
                    request.query("exec createCredentials @FirstName='"+req.body.FirstName+"',@LastName='"+req.body.LastName+"' ,@Email='"+req.body.Email+"',@Password='"+hash+"',@Status='"+req.body.Status+"',@Role='"+req.body.Role+"',@Department='"+req.body.Department+"',@DateOfJoining='"+req.body.DateOfJoining+"',@Location='"+req.body.Location+"';", function (err, recordset){
                        if (err){
                            console.log(err);}
                        else
                        {
                            sgMail.setApiKey(process.env.SENDGRID);
                            const msg = {
                                to: req.body.Email,
                                from: 'admin12@cygrp.com',
                                subject: 'Accounted created',
                                text: 'your account has been created.',
                                html: '<h1 style="color:red;">welcome to cyber group</h1><br><p>hi ' +req.body.FirstName+' <br> please login to your account</p> <strong>your email id is: ' +req.body.Email+' and password is:'  +req.body.Password+' </strong>',
                            };
                            sgMail.send(msg);
                            console.log(recordset);
                            
                            res.send("credentials added ");
                        }
                    });
                }
            });
        }
    });
});



//soft delete change the status to inactive
router.patch('/delete/:id', function (req, res) {
    res.header("Access-Control-Allow-Origin","*");
    
    var EmployeeId=req.params.id;
    var request = new sql.Request();
    request.query("exec softDeleteEmployee @EmployeeId="+EmployeeId+";", function (err, recordset){

        if (err){
            console.log(err);}
        else
        {
            res.send(recordset);
        }



    });
});

router.patch('/employee/update/:id', function (req, res) {
	res.header("Access-Control-Allow-Origin","*");
	

    var EmployeeId=req.params.id;
    var request = new sql.Request();
	

	request.query("exec updateByUser @EmployeeId="+EmployeeId+", @NickName='"+req.body.NickName+"',@PastExpreience="+req.body.Experience+", @DateOfBirth='"+req.body.DateOfBirth+"';", function (err, recordset){
        if (err){
            console.log(err);
			}
        else
        {
            res.send(recordset);
        }
    });
});

//update employee details
router.patch('/employee/:id',  (req,res,next)=>{
	res.header("Access-Control-Allow-Origin","*");
	res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE,PATCH');

    var EmployeeId=req.params.id;

    // create Request object
    var request = new sql.Request();



    request.query("exec updateByAdmin @EmployeeId="+EmployeeId+",@FirstName='"+req.body.FirstName+"',@LastName='"+req.body.LastName+"',@NickName='"+req.body.NickName+"',@Email='"+req.body.Email+"',@Location='"+req.body.Location+"',@DateOfJoining='"+req.body.DateOfJoining+"',@Designation='"+req.body.Designation+"',@Department='"+req.body.Department+"';", function (err, recordset){


        if (err){
            console.log(err);}
        else

            res.status(201).send("Employee details has been updated!!!");



    });
});
/*router.patch('employee/:id', upload.single('ProfilePicUrl'), (req,res,next)=>{

    var EmployeeId=req.params.id;


    var request = new sql.Request();
    request.query("exec updateEmployeeDetailsByAdminId @EmployeeId="+EmployeeId+",@FirstName='"+req.body.NickName+"',@LastName='"+req.body.LastName+"',@Location='"+req.body.Location+"'@DateOfBirth='"+req.body.DateOfBirth+"',@DateOfJoining='"+req.body.DateOfJoining+"',@pastExperience="+req.body.PastExperience+",@Department='"+req.body.Department+"';", function (err, recordset){

        if (err){
            console.log(err);}
        else
            res.send("employee details has been added");



    });
});*/
module.exports=router;
