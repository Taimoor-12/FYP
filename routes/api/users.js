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
module.exports = router;