const sql = require("mysql");
require("dotenv").config();

const config = {
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  host: process.env.DATABASE_URL,
  database: process.env.MYSQL_DATABASE,
  options: {
    encrypt: true,
    enableArithAbort: true,
  },
};
console.log(config)
const con = new sql.createPool(config);


exports.execQuery = async function (query) {
    return new Promise(function(resolve, reject){
        con.query(query, function(err, rows){
            if(err){
              console.log(config)
                reject(err)
            }                                                
            if(rows === undefined){
                reject(new Error("Error rows is undefined"));
            }else{
                resolve(rows);
            }
        }
    )})
};

exports.execRegister = async function (userDetails) {
  return new Promise(function (resolve, reject) {
    let query =
      "insert into users (first_name, last_name, email, password) values (?,?,?,?)";
    let values = [
      userDetails.fname,
      userDetails.lname,
      userDetails.email,
      userDetails.password,
    ];
    con.query(query, values, function (err, rows) {
      if (err) {
        reject(err);
      }
      if (rows === undefined) {
        reject(new Error("Error rows is undefined"));
      } else {
        resolve(rows);
      }
    });
  });
};

exports.userByEmail = async function (email) {
    return new Promise(function (resolve, reject){
        let query = "SELECT * FROM users WHERE email = " + con.escape(email);
        con.query(query, function (err, rows){
            if (err) {
                reject(err);
            }
            if (rows === undefined) {
                reject(new Error("Error rows is undefined"));
            } else {
                resolve(rows);
            }
        })
    })
}