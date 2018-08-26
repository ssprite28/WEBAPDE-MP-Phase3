const tagModel = require('../model/tagModel');
const formidable = require('formidable'); 
const fs = require('fs');

function TagModule(server){
    
  server.get('/tags', function(req, resp){
    tagModel.viewTags(function(list){
      const data = { list:list };
        
      if (req.session.user === undefined)
          resp.render('./pages/tags', { data:data });
      else
          resp.render('./pages/tags-user', {data:data});
        
      console.log(list.length);
    });
  });
    
  server.post('/search-tags', function(req, resp){
    tagModel.viewTags(function(list){
//      const data = { list:list };
        
      console.log("Search bar: " + req.body.searchbar);
      var search = req.body.searchbar;
        
      var arr1 = new Array();
        
      console.log(list.length);
        
      for (var i=0;i<list.length;i++)    
        if (list[i].tags.includes(search))
            arr1.push(list[i]);
        
      const data = { list:arr1 };
        
      if (req.session.user === undefined)
          resp.render('./pages/home', { data:data });
      else
          resp.render('./pages/home-user', {data:data});
        
      console.log(list.length);
    });
  });
    
  
    
//  server.get('/addInvetory', function(req, resp){
//    resp.render('./pages/addInventory');
//  });
//
//  server.post('/system-processing/addinvetory-result', function(req, resp){
//    var form = new formidable.IncomingForm();
//    form.parse(req, function (err, fields, files) {
//      var oldpath = files.image.path;
//      var newpath = __dirname + '/../public/upload/' + files.image.name;
//      fs.rename(oldpath, newpath, function (err) {
//        console.log('file transfer started');
//        if (err) throw err;
//        console.log('NUMBER: '+fields.price);
//        var num = Number(fields.price);
//        if(isNaN(num))
//          num = 500;
//        invetoryModel.addInvetory(fields.item, files.image.name, num ,function(){
//          resp.redirect('/home');
//        });//addInv
//      });//rename
//    });//parse
//  });//post
}

module.exports.Activate = TagModule;