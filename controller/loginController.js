const loginModel = require('../model/loginModel');
var crypto = require('crypto');
var mykey = crypto.createCipher('aes-128-cbc', 'mypassword');


function LoginModule(server){
  
  server.get('/', function(req, resp){
    const data = { failedLogin:false }
    if(req.query.login !== undefined && req.query.login === 'failed')
      data.failedLogin = true;
    resp.render('./pages/login',{data:data});
  });

  server.get('/register', function(req, resp){
    resp.render('./pages/register');
  });

  server.post('/system-processing/register-result', function(req, resp){
    loginModel.register(req.body.user,req.body.pass,function(){
      resp.redirect('/');
    });
  });

  server.post('/system-processing/login-authentication', function(req, resp){
    loginModel.checkLogin(req.body.user,req.body.pass,function(result){
      if(result)
        resp.redirect('/home');
      else
        resp.redirect('/?login=failed');
    });
  });
}

module.exports.Activate = LoginModule;
