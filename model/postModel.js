//This is the LoginModel.
//All connections to the collection called login will be done using this class.

//Contain all Mongoose code that will be used for the login
const mongoose = require('./connectionBase').connection;

const postSchema = new mongoose.Schema({
    title: { type: String },
    tags: [ { type: String } ],
    picture: { type: String },
    comments: [ { type: String } ],
    likes: { type: Number },
    timestamp: { type: String },
    privacy: { type: String },
    shareuser: [ { type: String } ],
},{ versionKey: false });

const postModel = mongoose.model('post', postSchema);

function viewPosts(username, callback){
  //Aggregate is the closest thing in Mongo to Join in SQL
  postModel.aggregate([
   { '$match': { userID:'temp' } },{
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

function createPost(id, title, tagsList, picture, timestamp, privacy, shareuserList, callback){
  const instance = postModel({
      userID: id,
      title: title,
      tags: tagsList,
      picture: picture,
      timestamp: timestamp,
      privacy: privacy,
      shareuser: shareuserList,
      
    });
  
  instance.save(function (err, trans) {
    if(err) return console.error(err);
    callback();
  });
}
//
//module.exports.addTransaction = addTransaction;
