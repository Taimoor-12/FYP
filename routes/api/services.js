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
const express = require("express");
let router = express.Router();
var Product = require("../../models/ServiceProvider");
const validateProduct = require("../../middlewares/validateProduct");
const auth = require("../../middlewares/auth");
const admin = require("../../middlewares/admin");
const multer  = require('multer');
const app = require("../../app");


// storage
const Storage=multer.diskStorage({
  destination:"uploads",
  filename:(req,file,cb)=>{
    cb(null,file.originalname);
  },
});
const upload= multer({
  storage:Storage
}).single('testImage')



// image upload
router.post("/upload",(req,res)=>{
  upload(req,res,(err)=>{
if(err){
  console.log(err);

}else{
  const newImage =new Product({
    
    firstname:req.body.firstname,
    lastname:req.body.lastname,
    city:req.body.city,
    phone:req.body.phone,
  
    image:{
      data:req.file.filename,
      contentType:"image/png",
    }
  })
  newImage.save()
  .then(()=>res.send("successfully Uploaded"))
  .catch(err=>console.log(err));
}
  })
})
//Insert a record

//get products
router.get("/", auth, async (req, res) => {
  console.log(req.user);
  let page = Number(req.query.page ? req.query.page : 1);
  let perPage = Number(req.query.perPage ? req.query.perPage : 10);
  let skipRecords = perPage * (page - 1);
  let products = await Product.find().skip(skipRecords).limit(perPage);
  return res.json({products});
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
router.delete("/:id",auth,admin, async (req, res) => {
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
module.exports = router;