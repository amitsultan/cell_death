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
                reject(new Error("Error: rows is undefined"));
            } else {
                resolve(rows);
            }
        })
    })
}

exports.projectById = async function (projectId) {
  return new Promise(function (resolve, reject){
      let query = "SELECT * FROM experiments WHERE experiment_id = " + con.escape(projectId);
      con.query(query, function (err, rows){
          if (err) {
              reject(err);
          }
          if (rows === undefined) {
              reject(new Error("Error: rows is undefined"));
          } else {
              resolve(rows);
          }
      })
  })
}

exports.experimentDetails = async function (experimentID) {
  return new Promise(function (resolve, reject){
    let query = "SELECT * FROM experiments WHERE experiment_id = "+ con.escape(experimentID);
    con.query(query, function (err, rows){
      if(err){
        reject(err);
      }
      if(rows === undefined){
        reject(new Error("Error: rows is undefined"));
      } else {
        resolve(rows);
      }
    })
  })
}

exports.addExperiment = async function (experiment_details, parent_id) {
  return new Promise(function (resolve, reject){
    if(!experiment_details  || !experiment_details.experiment_id || !experiment_details.num_pictures || !experiment_details.date ||
      !experiment_details.width || !experiment_details.height || !experiment_details.user_id){
        // Missing information for addition of experiment
        reject({message: "Missing information for experiment"})
      }else{
        let query = ''
        let inserts = [experiment_details.experiment_id, experiment_details.date, experiment_details.num_pictures,
        experiment_details.width, experiment_details.height, experiment_details.user_id];
        if(parent_id != '-'){
          query = "INSERT INTO experiments (experiment_id,date,num_pictures,width,height,user_id, second_ch) VALUES(?, ?, ?, ?, ?, ?, ?)";
          inserts.push(parent_id)
        }else{
          query = "INSERT INTO experiments (experiment_id,date,num_pictures,width,height,user_id) VALUES(?, ?, ?, ?, ?, ?)";
        }
        query = sql.format(query, inserts);
        con.query(query, function (err, rows){
          if(err){
            reject(err);
          }
          if(rows === undefined){
            reject(new Error("Error: rows is undefined"));
          } else {
            resolve(rows);
          }
        })
    }
  })
}

exports.addContactRequest = async function (Name, from_email, subject, message) {
  return new Promise(function (resolve, reject){
    if(!Name || !from_email || !subject || !message){
      reject("Missing fields!")
    }else{
      let date = new Date();
      let query = "INSERT INTO contactRequests (date, email, name, subject, message) VALUES(?, ?, ?, ?, ?)";
      let inserts = [date, from_email, Name,subject, message];
      query = sql.format(query, inserts);
      con.query(query, function (err, rows){
          if(err){
            reject(err);
          }
          if(rows === undefined){
            reject(new Error("Error: rows is undefined"));
          } else {
            resolve(rows);
          }
      })
    }
  })
}


exports.addPremissions = async function (user_id, projectId) {
  return new Promise(function (resolve, reject){
    if(!user_id || !projectId){
      reject("Missing fields!")
    }
    let query = 'insert into permissions (user_id, experiment_id) values (?,?)';
    let inserts = [user_id, projectId];
    query = sql.format(query, inserts);
    con.query(query, function (err, rows){
      if(err){
        reject(err);
      }
      if(rows === undefined){
        reject(new Error("Error: rows is undefined"));
      } else {
        resolve(rows);
      }
  })
})  
}

async function checkInExperiments(user_id, project_id)
{
  return new Promise(function(resolve, reject){
    let query2 = "select * from experiments where user_id=? and experiment_id=?"
    let inserts = [user_id, project_id];
    query2 = sql.format(query2, inserts);
    con.query(query2, function (err, rows){
      if(err)
        reject(err);
      if(rows && rows.length > 0)
        resolve(true);
      else
        resolve(false)
    })
  });
}
exports.checkForPermissions = async function(user_id, project_id){
  try{
    let exp = await checkInExperiments(user_id, project_id)
    if(exp){
      return true
    }
    else{
      return false
    }
  }catch(error){
    return false
  }    
}

exports.getExperimantForUser = async function(userId){
  return new Promise(function (resolve, reject){
    if(!userId)
      reject("Missing fields!")
    else{
      let query = 'select * from permissions where user_id=' + con.escape(userId);
      con.query(query, function (err, rows){
        if(err){
          reject(err);
        }
        if(rows === undefined){
          reject(new Error("Error: rows is undefined"));
        } else {
          resolve(rows);
        }
      })
    }
  })
}

exports.deletePremissions = async function (user_id, projectId) {
  return new Promise(function (resolve, reject){
    if(!user_id || !projectId){
      reject("Missing fields!")
    }
    let query = 'delete from permissions where user_id=? and experiment_id=?;';
    let details = [user_id, projectId];
    query = sql.format(query, details);
    con.query(query, function (err, rows){
      if(err){
        reject(err);
      }
      if(rows === undefined){
        reject(new Error("Error: rows is undefined"));
      } else if(rows.affectedRows === 1) {
          resolve("success!");
      }
      else{
        resolve(rows)
      }
  })
})  
}