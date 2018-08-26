//This is the LoginModel.
//All connections to the collection called login will be done using this class.

//Contain all Mongoose code that will be used for the login
const mongoose = require('./connectionBase').connection;
var crypto = require('crypto');
var mykey = crypto.createCipher('aes-128-cbc', 'mypassword');

const loginSchema = new mongoose.Schema({
  user: { type: String },
  pass: { type: String },
  picture: { type: String },
  description: { type: String },
  dateRegistered: {type: String },
    
},{ versionKey: false });

const loginModel = mongoose.model('login', loginSchema);

function checkLogin(username, password, callback){
    
  const searchQuery = { user: username};
    
  loginModel.findOne(searchQuery, function (err, login) { 
      if(err) return console.error(err);
    
      if(login != undefined && login._id != null) {
        var cipher = crypto.createDecipher('aes-128-cbc','mypassword');
        var decipheredPass = cipher.update(login.pass,'hex','utf8') + cipher.final('utf8');
        
        console.log(decipheredPass);
      }
  });
  
    
  //const searchQuery = { user: username, pass: password };

  loginModel.findOne(searchQuery, function (err, login) {
    if(err) return console.error(err);
    callback(login != undefined && login._id != null);
  });
}

module.exports.checkLogin = checkLogin;


function register(username, password, date, description, callback){
  const instance = loginModel({ user: username, pass: password, picture: './imgs/Blank.png', dateRegistered: date, description: description });
    
    instance.pass = mykey.update(password, 'utf8','hex') + mykey.final('hex');
    
    console.log(instance.pass);
    
  instance.save(function (err, login) {
    if(err) return console.error(err);
    callback();
  });
}

module.exports.register = register;

function findUser(username, callback){
    const searchQuery = {user: username};
    
    loginModel.findOne(searchQuery, function (err, login) {
        if (err) return console.error(err);
        callback(login);
    });
}

module.exports.findUser = findUser;


function editDescription(username, descript, callback){
    loginModel.findOneAndUpdate({user: username}, {$set:{description: descript}}, {new:true}, function(err, doc){
        if(err){
            console.log("update went wrong");
        }
        console.log(doc);
    });
    
}

module.exports.editDescription = editDescription;
