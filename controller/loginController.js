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
    var date = new Date();
    loginModel.register(req.body.user, req.body.pass, date, req.body.description, function(){
      resp.redirect('/');
    });
  });
    
  server.get('/profile', function(req, resp){
      loginModel.findUser(req.session.user, function(list){
         const data = {list:list}
         resp.render('./pages/profile', {data: data}); 
      }); 
  });
    
   //Placeholder
   server.get('/edit-profile', function(req, resp){
      loginModel.findUser(req.session.user, function(list){
         const data = {list:list}
         resp.render('./pages/edit-profile', {data: data}); 
      }); 
  });
    
  server.get('/user-profile', function(req, resp){
    loginModel.findAllUsers(function(list){
    const data = {list:list}
    var split = req.query.id.split(",");
    
    //console.log("Title: " +split[1]);
    console.log("Uploaded By: " +split[0]);
    
    const searchQuery = {uploadedBy: split[0]}
    
    resp.render('./pages/user-profile', {data:data, uploadedBy:searchQuery}); 
    });

  });

server.get('/system-processing/edit-profile', function(req, resp){
    loginModel.editDescription(req.session.user, req.body.description, function(req, resp){
       resp.redirect('/profile');
    });
});

    
  server.post('/system-processing/login-authentication', function(req, resp){
    loginModel.checkLogin(req.body.user,req.body.pass,function(result){
      if(result) {

        req.session.user = req.body.user; 
        console.log(req.session);
        console.log(req.session.user);
          
        resp.redirect('/home');
      }
      else
        resp.redirect('/?login=failed');
    });
  });
    
server.get('/logout', function(req, resp){
  if(req.session.user === undefined){
    resp.redirect('/?login=unlogged');
  }else{
    req.session.destroy(function(err) {
      resp.redirect('/home');
    });
  }
});
    
  
    
}

module.exports.Activate = LoginModule;
