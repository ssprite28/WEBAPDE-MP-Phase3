const postModel = require('../model/postModel');
const formidable = require('formidable');
const fs = require('fs');
const mv = require('mv');
//const invetoryModel = require('../model/invetoryModel');

const tagModel = require('../model/tagModel');

function PostModule(server){
  
  server.get('/home', function(req, resp){
    postModel.viewPosts('temp',function(list){
      const data = { list:list };
        
      if (req.session.user === undefined)
          resp.render('./pages/home', {data:data});
          
      else
          resp.render('./pages/home-user',{ data:data });
    });
  });
    
    server.post('/search-tags', function(req, resp){
        postModel.viewPosts(req.session.user, function(list){

            console.log("Search Bar: " + req.body.searchbar);
            var search = req.body.searchbar;
            
            var arr1 = new Array();
            
            for (var i=0;i<list.length;i++)
                if (list[i].tags.includes(search))
                    arr1.push(list[i]);
                
            console.log("Arr1: " + arr1[0]);
            
            const data = {list:arr1};
            
            
            if (req.session.user === undefined)
                resp.render('./pages/home', {data:data});
            else
                resp.render('./pages/home-user',{ data:data });
        
        
        });
    });
    
    server.get('/link-tags', function(req, resp){
       var search = req.query.id;
       console.log("Query: " + search);
        
       postModel.find({}, function (err, post){
           
       });
    });
    
    server.post('/delete-post', function(req, resp){
        var search = req.query.id;
        postModel.deletePost(search) 
            resp.redirect('/profile'); 
        
    });
    
    
    
  //For showing the create-post page      
  server.get('/create-post', function(req, resp){
      resp.render('./pages/createpost');
  });
    
 
    
  server.post('/system-processing/createpost-result', function(req, resp){

      var form = new formidable.IncomingForm();
      form.parse(req, function (err, fields, files) {
          var oldpath = files.picture.path;
          var newpath = __dirname + '/../public/upload/' + files.picture.name;
//          fs.rename(oldpath, newpath, function (err) {

            mv(oldpath, newpath, function(err) {
              console.log('file transfer started');
              if (err) throw err;
                
                        
              var Tags = fields.tags;
              var allTags = Tags.split(',');

              var Shared = fields.shareuser;
              var allShared = Shared.split(',');

              for (var i=0;i<allTags.length;i++){
              tagModel.addTag(req.session.user, allTags[i], fields.title, function(list){
                  const data = {list:list};
              });
              }
              
               postModel.createPost(req.session.user, fields.title, allTags, files.picture.name, new Date(), fields.privacy, allShared, function(list){
                    const data = {list: list};
                    resp.redirect('/home');               
                });//createPost
              
          });//rename
      });//parse
      
  });
}

module.exports.Activate = PostModule;
