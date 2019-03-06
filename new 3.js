const multer = require('multer');

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, '../uploads');
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  // reject a file
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


app.patch('/', upload.single('userImage'), (req,res,next)=>{
    
    //const updateOps={};
    //for (const ops of req.body) {
        //updateOps[ops.propName] = ops.value;
    //}
    Employee.update({ _id: id }, { skills:req.body.skills, userImage:req.file.path })
    .exec()
    .then(result => {
      res.status(200).json({
          message: 'Employee updated'
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});




const sgMail = require('@sendgrid/mail');
sgMail.setApiKey('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');
const msg = {
  to: 'gauravthexavier@gmail.com',
  from: 'gauravsg211@gmail.com',
  subject: 'lets go this is the greatest plan',
  text: 'i dont know how to be a part of all that, even with Node.js',
  html: '<strong>hello this is the graetest idea </strong>',
};
sgMail.send(msg);