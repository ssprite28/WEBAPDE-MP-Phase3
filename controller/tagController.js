const tagModel = require('../model/tagModel');
const formidable = require('formidable'); 
const fs = require('fs');

function TagModule(server){
    
  server.get('/tags', function(req, resp){
    tagModel.viewTags(function(list){
      const data = { list:list };
        const user = req.session.user;
        

    resp.render('./pages/tags', { data:data, user:user});
 
        
      console.log(list.length);
    });
  });
    
}

module.exports.Activate = TagModule;
