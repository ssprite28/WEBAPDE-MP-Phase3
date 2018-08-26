const postModel = require('../model/postModel');
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
//            const data = {list: list};
            
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
    

    
//
//  server.get('/addTransactions', function(req, resp){
//    invetoryModel.viewInvetory(function(list){
//      const data = { list:list };
//      resp.render('./pages/addTrans',{ data:data });
//    });
//  });
//
    
    
  //For showing the create-post page      
  server.get('/create-post', function(req, resp){
      resp.render('./pages/createpost');
  });
    
 
    
  server.post('/system-processing/createpost-result', function(req, resp){
//    var IDList = [];
//    var qtyList = [];
//    var total = 0;
      
      var Tags = req.body.tags;
      var allTags = Tags.split(',');
      
      var Shared = req.body.shareuser;
      var allShared = Shared.split(',');
      
      for (var i=0;i<allTags.length;i++){
          tagModel.addTag(req.session.user, allTags[i], req.body.title, function(list){
              const data = {list:list};
          });
      }
          
//    for(var key in req.body){
//        var val = Number(req.body[key]);
//        
//        if(!isNaN(val) && req.body[key].length>0){
//            IDList.push(key);
//            qtyList.push(val);
//        }//end of if statement
//        
//    }//end of for loop
            
//    postModel.addTransaction(
//    'temp',IDList,qtyList,function(){
//        resp.redirect('/home');
//    });
      
      postModel.createPost(req.session.user, req.body.title, allTags, req.body.picture, new Date(), req.body.privacy, allShared, function(list){
          
            const data = {list: list};
            resp.redirect('/home');               
      });
      
  });
}

module.exports.Activate = PostModule;
