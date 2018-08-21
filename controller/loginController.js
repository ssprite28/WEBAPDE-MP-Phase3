const loginModel = require('../model/loginModel');

function LoginModule(server){
  
  server.get('/', function(req, resp){
    const data = { failedLogin:false }
    if(req.query.login !== undefined && req.query.login === 'failed')
      data.failedLogin = true;
    resp.render('./pages/login',{data:data});
  });

  server.get('/addLogin', function(req, resp){
    resp.render('./pages/addLogin');
  });

  server.post('/system-processing/addlogin-result', function(req, resp){
    loginModel.addLogin(req.body.user,req.body.pass,function(){
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
