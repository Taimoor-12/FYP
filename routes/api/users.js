/*const express = require("express");
let router = express.Router ();

router.get("/",async(req,res)=>{
return res.send(["pen","pencil"])
});
module.exports = router;*/
/*const express = require("express");
let router = express.Router();
//get products
router.get("/", async (req, res) => {
  return res.send (["Pen", "Pencil"]);
});
module.exports=router;*/
/*const express = require("express");
let router = express.Router();
var Product = require("../../models/user");
const validateProduct = require("../../middlewares/validateProduct");
//get products
router.get("/", async (req, res) => {
 // let page = Number(req.query.page ? req.query.page : 1);
 // let perPage = Number(req.query.perPage ? req.query.perPage : 10);
 // let skipRecords = perPage * (page - 1);
  //let products = await Product.find().skip(skipRecords).limit(perPage);
  let products = await Product.find()
  return res.send (products);
}); 

//get single products
router.get("/:id", async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);
    if (!product)
      return res.status(400).send("Product With given ID is not present"); //when id is not present id db
    return res.send(product); //everything is ok
  } catch (err) {
    return res.status(400).send("Invalid ID"); // format of id is not correct
  }
});
//update a record
router.put("/:id",  async (req, res) => {
  let product = await Product.findById(req.params.id);
  //product.name = req.body.name;
 // product.price = req.body.price;
  product.firstname=req.body.firstname
  product.lastname=req.body.lastname
  product.city=req.body.city
  await product.save();
  return res.send(product);
});
//Delete a record
router.delete("/:id", async (req, res) => {
  let product = await Product.findByIdAndDelete(req.params.id);
  return res.send(product);
});
//Insert a record
router.post("/",validateProduct, async (req, res) => {
  let product = new Product();
  product.firstname=req.body.firstname
  product.lastname=req.body.lastname
  product.city=req.body.city
  product.phone=req.body.phone
  await product.save();
  return res.send(product);
});
module.exports = router;*/
const express = require("express");
let router = express.Router();
let { User } = require("../../models/user");
var bcrypt = require("bcryptjs");
const _ = require("lodash");
const jwt = require("jsonwebtoken");
const config = require("config");

const mailgun=require("mailgun-js");
const DOMAIN='sandboxf26a5c38b52e4da68cd059e6c4d2daba.mailgun.org';
var api_key = 'XXXXXXXXXXXXXXXXXXXXXXX';
const mg=mailgun({apiKey:api_key,domain:DOMAIN})

var nodemailer = require('nodemailer');
router.post("/register", async (req, res) => {
  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User with given Email already exist");
  user = new User(); 
  user.name = req.body.name;
  user.email = req.body.email;
  user.password = req.body.password;
  
 
  await user.generateHashedPassword();
  //let salt=await bcrypt.genSalt(10)
 // user.password=await bcrypt.hash(user.password,salt);

  await user.save();
 // return res.send(user);
  return res.send(_.pick(user, ["name", "email"]));
});
router.post("/login", async (req, res) => {
  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("User Not Registered");
  let isValid = await bcrypt.compare(req.body.password, user.password);
  if (!isValid) return res.status(401).send("Invalid Password");
  let token = jwt.sign(
    { _id: user._id, name: user.name },
    config.get("jwtPrivateKey")
  );
  res.send(token);
});

router.put("/forgot", async(req,res)=>{
  //let user = await User.findOne({ email: req.body.email });
  //if (!user) return res.status(400).send("User with this email does not exit");
  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("User Not Registered");
  let token = jwt.sign(
    { _id: user._id, name: user.name },
    config.get("RESET_PASSWORD_KEY")
  );
  /*const data={
    from:'noreply@hello.com',
    to:req.body.email,
    subject:'Account Activation Link',
    
  

          
  };*/
 /* var transporter = nodemailer.createTransport({
   
    host: 'smtp.mail.yahoo.com',
            port: 465,
            service:'yahoo',
            secure: false,
    auth: {
      user: 'ameerhamza1710@yahoo.com',
      pass: 'aim3iCY8cFmr'
    },
    
  });*/
  let transporter = nodemailer.createTransport({
    //host: 'smtp.zoho.com',
 //   host: 'smtppro.zoho.com',

   // secure: true,
   // port: 465,
   host: 'smtp.office365.com', // Office 365 server
        port: 587,     // secure SMTP
        secure: false,
        requireTLS: true,
    auth: {
      user: 'ameerhamza1710@outlook.com',
      pass: 'ameerhamza1616'
      
      
    },
    tls: {
      ciphers: 'SSLv3'
  }
  });
 /* var mailOptions = {
    from: 'ameerhamzaasif5@gmail.com',
    to: req.body.email,
    subject: 'Sending Email using Node.js',
    text: 'That was easy!'
  };*/
  const mailOptions = {
    from:'ameerhamza1710@outlook.com', // sender address
    to: req.body.email,
    subject: 'hello Taimoor!!',// Subject line
    text: 'email sent using node js'
   };
  return  user.updateOne({ resetLink:token },function(err,success){
    

  if (err){
    return res.status(400).json({error:"reset password link"});
  } 
  else {
  /*  mg.messages().send(data,function(error,body) {
      if(error){
        return res.json({
           
        })
      }
      
      return res.json({message:'Email has been sent'});
    });*/
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
      //  console.log('Email sent: ' + info.response);
      return res.json({message:'Email has been sent'});
      }
    });
  }



  }).clone();
});
module.exports = router;