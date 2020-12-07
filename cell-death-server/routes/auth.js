var express = require("express");
var router = express.Router();
const bcrypt = require("bcrypt");
var DButils = require('../DB/DButils')


// middleware function to check for logged-in users
// throws user back to home page if logged-in
var sessionChecker = (req, res, next) => {
    if (req.session.email && req.cookies.user_sid) {
      console.log('already logged in')
        res.redirect('/');
    } else {
        next();
    }    
};

router.post("/Register", sessionChecker, async (req, res, next) => {
  // missing parameters
  try {
    if (
      !req.body.firstname ||
      !req.body.lastname ||
      !req.body.email ||
      !req.body.password
    ) {
      throw { status: 500, message: "one or more of the details is missing" };
    }
    DButils.execQuery("SELECT email FROM users")
      .then((users) => {
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
          password: hash_password,
        };
        DButils.execRegister(userDetails)
          .then((results) => {
            res.status(200).send({ message: "User created!", success: true });
          })
          .catch((err) => {
            throw { status: 500, message: "Error occurred" };
          });
      })
      .catch((error) => {
        next(error);
      });
  } catch (error) {
    next(error);
  }
});

router.post("/Login", sessionChecker, async (req, res, next) => {
  try {
    if (!req.body.email || !req.body.password) {
      throw { status: 500, message: "credentials must be provided" };
    }
    // check that username exists
    DButils.execQuery("SELECT email FROM users")
      .then((users) => {
        if (!users.find((x) => x.email === req.body.email))
          throw { status: 401, message: "Email or Password incorrect" };
        DButils.userByEmail(req.body.email)
          .then((user) => {
            if (user.length > 1) {
              throw {
                status: 401,
                message: "Error occurred, Please contact us",
              };
            } else if (user.length == 0) {
              throw { status: 401, message: "Email or Password incorrect" };
            } else {
              user = user[0];
              if (!bcrypt.compareSync(req.body.password, user.password)) {
                throw {
                  status: 401,
                  message: "Username or Password incorrect",
                };
              } else {
                req.session.userID = user.id
                req.session.email = user.email
                res
                  .status(200)
                  .send({
                    status: 200,
                    message: "User authentication succeeded",
                  });
              }
            }
          })
          .catch((error) => {
            next(error);
          });
      })
      .catch((error) => {
        next(error);
      });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
