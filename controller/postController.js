const postModel = require('../model/postModel');
const tagModel = require('../model/tagModel');
const formidable = require('formidable');
const fs = require('fs');
const mv = require('mv');
//const invetoryModel = require('../model/invetoryModel');



function PostModule(server){
  
  server.get('/home', function(req, resp){
    postModel.viewPosts('temp',function(list){
      const data = { list:list };
      const user = req.session.user;
        
      console.log("Number of posts: " + data.list.length);
        
      if (req.session.user === undefined)
          resp.render('./pages/home', {data:data});
          
      else {
          resp.render('./pages/home-user',{ data:data, user:user });
          console.log("User: " + user);
      }
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
            const user = req.session.user;
            
            
            if (req.session.user === undefined)
                resp.render('./pages/home', {data:data});
            else
                resp.render('./pages/home-user',{ data:data, user:user });
        
        
        });
    });
    
    server.get('/link-tags', function(req, resp){
        postModel.viewPosts(req.session.user, function(list){
           var search = req.query.id;
           console.log("Query: " + search);

           var arr1 = new Array();

            for (var i=0;i<list.length;i++)
                if (list[i].tags.includes(search))
                    arr1.push(list[i]);
            
               const data = {list:arr1};
               const user = req.session.user;
            
            if (req.session.user === undefined)
                resp.render('./pages/home', {data:data});
            else
                resp.render('./pages/home-user', {data:data, user:user});
           
       });

    });
    
    server.post('/delete-post', function(req, resp){
        var search = req.query.id.split(",");
        var data;
        var arr1 = new Array();
        
        console.log("req.query.id: " + req.query.id);
        console.log("search[0]: " + search[0]); //post id
        console.log("search[1]: " +search[1]); //title
        
        postModel.viewPosts('temp', function(list){
            data = { list:list };
            console.log("Data.list: " + data.list.length);
            
            for (var i=0;i<data.list.length;i++){
                console.log("Data ID: " + data.list[i]._id);
                if (data.list[i]._id == search[0]){
                    arr1.push(list[i]); //push the post with the same id
                    
                }
            }
            
            console.log("Data.list: " + data.list.length);
            console.log("Arr1 Length: " + arr1.length);
            
            if (arr1.length > 0){
                console.log("arr1[0].tags: " + arr1[0].tags);
                console.log("arr1[0].title: " + arr1[0].title);
                tagModel.deleteTag(arr1[0].title);
            }
            
            postModel.deletePost(search[0]); 
            
        });
        

        

            resp.redirect('/profile'); 
        
        
        
    });
    
    server.get('/view-all', function(req, resp){
    postModel.viewPosts('temp',function(list){
      const data = { list:list };
      const user = req.session.user;
        
      console.log("Number of posts: " + data.list.length);
        
        resp.render('./pages/view-all', {data:data, user:user });
    });
  });

 server.get('/viewbig', function(req, resp){
    var split = req.query.id.split(",");
    
     
    console.log("Picture: " +split[0]);
    console.log("Title: " +split[1]);
    var title = split[1];
    var picture = split[0];
    const data = {title:title, picture:picture};
    
    postModel.viewMeme(title, picture,function(post){
        var passData = {post: post}
        const user = req.session.user;
        

    resp.render('./pages/viewbig', {data: passData, user:user});
        
         
    });
    
});
    
    server.post('/edit-post', function (req, resp){
       var id = req.query.id;
        
       postModel.viewOne(id, function(post) {
           const data = {post:post}
           
            resp.render('./pages/editpost', {data:data}); 
       });
        
      
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
    
  server.post('/system-processing/editpost-result', function(req, resp){
      
      var form = new formidable.IncomingForm();
      form.parse(req, function (err, fields, files) {
          const id = req.query.id;
          console.log("req.query.id: " +  id);
          var editID;
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
                
                    console.log("req.query.id: " +  id);
                    
//                    postModel.editPost(req.session.user, fields.title, allTags,                           files.picture.name, new Date(), fields.privacy, allShared,  id,                       function(list){
//                        
//                    const data = {list: list};
//                    resp.redirect('/profile');
                var title = fields.title;
                var user = req.session.user;
                var pic = files.picture.name;
                var privacy = fields.privacy;
                
                postModel.editPost(user, title, allTags, pic, privacy, allShared, id);
                resp.redirect('/profile');
          });//rename
          
          
          
          
          
      });//parse
      
  });
      
  
}

module.exports.Activate = PostModule;
