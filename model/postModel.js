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
    description: { type: String },
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

module.exports.viewPosts = viewPosts;

function viewOne(id, callback){
    const searchQuery = {_id: id};
    
    postModel.findOne(searchQuery, function (err, post) {
        if (err) return console.error(err);
        callback(post);
    });
}

module.exports.viewOne = viewOne;

function viewMeme(title, picture, callback){
    const searchQuery = {title: title, picture: picture}
    postModel.findOne(searchQuery, function (err, post){
        if (post != undefined && post._id != null){
            const passData = { post: post };
            console.log("Id: " + post._id);
        }
       
        if (err) return console.error(err);
        callback(post);
    });
}

module.exports.viewMeme = viewMeme;

function deletePost(id){
    console.log("Id to delete: " + id);
    postModel.deleteOne({ _id: id }, function (err) {});

}


module.exports.deletePost = deletePost;


function editPost(user, title, tagsList, picture, privacy, shareuserList, description, id){
    console.log("ID: " + id);
    
//    postModel.findOneAndUpdate({ _id: id }, 
//    {
//        title,
//        user,
//        tagsList,
//        picture,    
//        privacy,
//        shareuserList
//        
//    });
    
    postModel.update({_id: id}, {
        user: user,
        title: title,
        picture: picture,
        privacy: privacy,
        shareuser: shareuserList,
        tags: tagsList,
        description: description
        
    }, function(err){
        
    });
    
//   postModel.updateOne(
//        { _id: id },
//        { $set: { title : title } }
//        
//   );
    
}

module.exports.editPost = editPost;

function createPost(user, title, tagsList, picture, timestamp, privacy, shareuserList, description,  callback){
  const postInstance = postModel({
      uploadedBy: user,
      title: title,
      tags: tagsList,
      picture: picture,
      comments: undefined,
      likes: 0,
      timestamp: timestamp,
      privacy: privacy,
      shareuser: shareuserList,
      description: description,
    });

    //save tags to tags table also
    
  
  postInstance.save(function (err, trans) {
    if(err) return console.error(err);
    callback();
  });
}
//
module.exports.createPost = createPost;
