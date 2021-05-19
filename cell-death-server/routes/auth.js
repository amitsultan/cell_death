var express = require("express");
var router = express.Router();
const bcrypt = require("bcrypt");
var DButils = require('../DB/DButils')
const mailController = require('../controllers/mailerController')

// middleware function to check for logged-in users
// throws user back to home page if logged-in
var sessionChecker = (req, res, next) => {
    if (req.session.email && req.cookies.user_sid) {
      console.log('already logged in')
      res.redirect('/');
    } else {
      res.status(200);
      next();
    }    
};

router.post("/Register", sessionChecker, async (req, res, next) => {
  // missing parameters
  try{
    if (!req.body.firstname ||
    !req.body.lastname ||
    !req.body.email ||
    !req.body.password)
      return res.status(500).send({message: "one or more of the details is missing" });
  }
  catch(error)
  {
    return res.status(500).send({message: "one or more of the details is missing" });
  }
  let users = 0 
  try{
    users = await DButils.userByEmail(req.body.email)
    if (users.length>0)
      return res.status(422).send({message: "Email already exists!" });
  }catch(error)
  {
    next(error)
  }
  let hash_password = bcrypt.hashSync(
    req.body.password,
      // parseInt(process.env.bcrypt_saltRounds)
    parseInt(13)
  );
  const userDetails = {
    fname: req.body.firstname,
    lname: req.body.lastname,
    email: req.body.email,
    password: hash_password,
  };
  try{
    await DButils.execRegister(userDetails)
    res.status(200).send({ message: "User created!", success: true });
    mailController.sendRegistrationMail(req.body.email, req.body.firstname, req.body.lastname)
  }catch(error){
    next(error)
  }
})
  
router.post("/Login", sessionChecker, async (req, res, next) => {
  try {
    if (!req.body.email || !req.body.password) {
      return res.status(500).send("credentials must be provided");
    }
    // check that username exists
    const users = await DButils.execQuery("SELECT * FROM users")
    if (!users.find((x) => x.email === req.body.email))
      return res.status(401).send("Email or Password incorrect");
    var user = await DButils.userByEmail(req.body.email)
    if (user.length == 0) {
      return res.status(401).send("Email or Password incorrect");
    }else {
      user = user[0];
      if (!bcrypt.compareSync(req.body.password, user.password)) {
        return res.status(401).send("Username or Password incorrect");
      }else {
      req.session.userID = user.id
      req.session.email = user.email
      // req.session.first_name = user.first_name,
      // req.session.last_name = user.last_name,
      return res.status(200).send({status: 200,message: "User authentication succeeded",});
              }
  }

} catch(error){
    console.log(error)
    return res.status(401).send("An error has occurred");
}
});

router.post("/getFullNameByEmail", async (req, res, next) => {
  try{
    if (!req.body.email) {
      // res.status(500).send({message: "email must be provided" });
      throw { status: 500, message: "email must be provided" };
    }
    fullName=[]
      DButils.userByEmail(req.body.email)
        .then((user) => {
          if (user.length == 0) {
            throw { status: 500, message: "Email is incorrect" };
          }else  { 
            fullName.push(user[0].first_name)
            fullName.push(user[0].last_name)
            req.session.firstName = fullName[0].first_name
            req.session.lastName = fullName[0].last_name
            res.status(200).send(fullName);
      }
    })
  }catch(error){
    next(error);
  }
});

router.post("/signout", async (req, res, next) => {
  req.session.destroy(function(err) {
    if(err){
      console.log(err)
      res.status(500).send({ message: "Failed to delete session", success: false });
    }else{
      res.status(200).send({ message: "successfully signed out", success: true });
    }
  })
});
module.exports = router;
