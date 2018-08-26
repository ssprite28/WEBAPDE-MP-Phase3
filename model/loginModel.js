//This is the LoginModel.
//All connections to the collection called login will be done using this class.

//Contain all Mongoose code that will be used for the login
const mongoose = require('./connectionBase').connection;

const loginSchema = new mongoose.Schema({
  user: { type: String },
  pass: { type: String },
  picture: { type: String },
  description: { type: String },
  dateRegistered: {type: String },
    
},{ versionKey: false });

const loginModel = mongoose.model('login', loginSchema);

function checkLogin(username, password, callback){
  const searchQuery = { user: username, pass: password };

  loginModel.findOne(searchQuery, function (err, login) {
    if(err) return console.error(err);
    callback(login != undefined && login._id != null);
  });
}

module.exports.checkLogin = checkLogin;

function findAllUsers (callback){
    
    loginModel.find({}, function (err, login){
        if (err) return console.error(err);
        callback(login);
    });
}

module.exports.findAllUsers = findAllUsers;


function register(username, password, date, description, callback){
  const instance = loginModel({ user: username, pass: password, picture: './imgs/Blank.png', dateRegistered: date, description: description });
    
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

