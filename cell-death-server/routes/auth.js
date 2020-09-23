var express = require("express");
var router = express.Router();
const fs = require("fs");
const bcrypt = require("bcrypt");
var ConvertTiff = require("tiff-to-png");
var DButils = require('../DB/DButils')


var options = {
  logLevel: 1,
};

var converter = new ConvertTiff(options);

router.post("/Register", async (req, res, next) => {
    // missing parameters
    try{
      if (
        !req.body.firstname ||
        !req.body.lastname ||
        !req.body.email ||
        !req.body.password
        ) {
          throw { status: 500, message: "one or more of the details is missing" };
        }
        DButils.execQuery("SELECT email FROM users").then((users)=>{
          if (users.find((x) => x.email === req.body.email))
          throw { status: 422, message: "Email already exists!" };
          let hash_password = bcrypt.hashSync(
            req.body.password,
            // parseInt(process.env.bcrypt_saltRounds)
            parseInt(13)
            );
            const userDetails = {
              fname: req.body.firstname,
              lname: req.body.lastname,
              email: req.body.email,
              password: hash_password
            };
            DButils.execRegister(userDetails).then((results)=>{
              res.status(200).send({ message: "User created!", success: true });
            }).catch((err)=>{
              throw { status: 500, message: "Error occurred" };
            })
          }).catch((error)=>{
            next(error)
          })
    }catch(error){
      next(error)
    }
});

router.post("/Login", async (req, res, next) => {
  try {
    if(!req.body.email || !req.body.password){
      throw { status: 500, message: "credentials must be provided" };
    }
    // check that username exists
    DButils.execQuery("SELECT email FROM users").then((users)=>{
    if (!users.find((x) => x.email === req.body.email))
      throw { status: 401, message: "Email or Password incorrect" };
    DButils.userByEmail(req.body.email).then((user)=>{
      if(user.length > 1){
        throw { status: 401, message: "Error occurred, Please contact us" };
      }else if(user.length == 0){
        throw { status: 401, message: "Email or Password incorrect" };
      }else{
        user = user[0]
          if (!bcrypt.compareSync(req.body.password, user.password)) {
            throw { status: 401, message: "Username or Password incorrect" };
          }else{
            res
              .status(200)
              .send({ status: 200, message: "User authentication succeeded" });
          }
      }
    }).catch((error)=>{
      next(error)
    })
    }).catch((error)=>{
      next(error)
    })
  } catch (error) {
    next(error);
  }
});

router.get("/img", async (req, res, next) => {
  let serial = req.query.serial
  let location = "../data/" + serial + "/images/";
  let save_location = "../data/"+serial+"/images/images_png";
  fs.readdir("../data/"+serial+"/images", (err, files) => {
    if(err){
      console.log(err)
      res.status(500).send('No files found for given serial')
    }else{
      // Filter tif files from others
      let tif_array = []
      const tifFiles = files.filter((el) => /\.tif$/.test(el));
      tifFiles.forEach((file) => {
        tif_array.push((location+file));
      });
      converter.convertArray(tif_array, save_location).then((data) => {
          console.log(data);
        })
        .catch((err) => {
          console.log(err);
        });
      res.send('okey')
    }
  });
});
module.exports = router;
