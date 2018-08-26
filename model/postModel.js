const mongoose = require('./connectionBase').connection;

const postSchema = new mongoose.Schema({
    title: { type: String },
    uploadedBy: { type: String },
    tags: [ { type: String } ],
    picture: { type: String },
    comments: [ { type: String } ],
    likes: { type: Number },
    timestamp: { type: Date },
    privacy: { type: String },
    shareuser: [ { type: String } ],
},{ versionKey: false });

const postModel = mongoose.model('post', postSchema);

function viewPosts(username, callback){
  //Aggregate is the closest thing in Mongo to Join in SQL
  postModel.aggregate([
   {
    $lookup: {
           from: "posts",
           localField: "items",
           foreignField: "_id",
           as: "itemNames" }
    }
  ]).exec(function (err, list) {
    if(err) return console.error(err);
    callback(list);
  });
    
}



//function viewPosts(username, callback){
//    
//    postModel.find({}, function(err, list){
//    const passData = {list:list};
//                   
//    });
//    callback(list);
//}

module.exports.viewPosts = viewPosts;

function createPost(user, title, tagsList, picture, timestamp, privacy, shareuserList, callback){
  const postInstance = postModel({
      uploadedBy: user,
      title: title,
      tags: tagsList,
      picture: picture,
      timestamp: timestamp,
      privacy: privacy,
      shareuser: shareuserList,
      
    });

    //save tags to tags table also
    
  
  postInstance.save(function (err, trans) {
    if(err) return console.error(err);
    callback();
  });
}
//
module.exports.createPost = createPost;