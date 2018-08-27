const loginModel = require('../model/loginModel');
const postModel = require('../model/postModel');
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
    
//  server.get('/profile', function(req, resp){
//      loginModel.findUser(req.session.user, function(list){
//         const data = {list:list}
//         console.log(list);
//          
//         resp.render('./pages/profile', {data: data}); 
//         
//      });
//      
//  });
    
  server.get('/profile', function(req, resp){
      
  var postData, data, user;
      
      loginModel.findUser(req.session.user, function(list){
         data = {list:list}
      });
      
      postModel.viewPosts(req.session.user, function(list){
          postData = list;
          user = req.session.user;
          resp.render('./pages/profile', { data: data, postData: postData, user:user });
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
      var postData, data, user;
      var split = req.query.id.split(",");
      var search = split[0];
      
      loginModel.findUser(search, function(list){
         data = {list:list}
      });
      
      postModel.viewPosts(search, function(list){
          postData = list;
          user = search;
          
          if(req.session.user == search){
              resp.render('./pages/profile', { data: data, postData: postData, user:user });
          }else if(req.session.user === undefined){
              resp.render('./pages/guest-profile', { data: data, postData: postData, user:user });
          }
          else{
              resp.render('./pages/user-profile', { data: data, postData: postData, user:user });
          }
          
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
