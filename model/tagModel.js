//This is the LoginModel.
//All connections to the collection called login will be done using this class.

//Contain all Mongoose code that will be used for the login
const mongoose = require('./connectionBase').connection;

const tagSchema = new mongoose.Schema({
    user: { type: String },
    body: { type: String },
    parentPostID: {type: String },
},{ versionKey: false });

const tagModel = mongoose.model('tag', tagSchema);

//function addInvetory(itemV, imageV, priceV, callback){
//  const instance = inventoryModel({ item: itemV, image: imageV, price: priceV });
//  
//  instance.save(function (err, inv) {
//    if(err) return console.error(err);
//    callback();
//  });
//}

//module.exports.addInvetory = addInvetory;

//function viewTags(callback){
//  tagModel.find({}, function (err, list) {
//    if(err) return console.error(err);
//    callback(list);
//  });
//}

function addTag(username, tag, parent, callback){
    const instance = tagModel({ 
        user: username, 
        body: tag, 
        parentPostID: parent, 
    });
    
    instance.save(function (err, inv){
        if (err) return console.error(err);
        callback();
    });
}

module.exports.addTag = addTag;

function deleteTag(body, parentPostID){
    var data;
    const searchQuery = {body:body, parentPostID: parentPostID}
    tagModel.findOne(searchQuery, function (err, tag){
        data = {tag: tag};
    });
    
    tagModel.deleteOne({_id: data.tag.id }, function (err) {});
    
}

module.exports.deleteTag = deleteTag;

function viewTags(callback){
  //Aggregate is the closest thing in Mongo to Join in SQL
  tagModel.aggregate([
   {
    $lookup: {
           from: "tags",
           localField: "items",
           foreignField: "_id",
           as: "itemNames" }
    }
  ]).exec(function (err, list) {
    if(err) return console.error(err);
    callback(list);
  });
    
}

module.exports.viewTags = viewTags;

