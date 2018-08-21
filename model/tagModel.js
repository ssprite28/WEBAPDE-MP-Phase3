//This is the LoginModel.
//All connections to the collection called login will be done using this class.

//Contain all Mongoose code that will be used for the login
const mongoose = require('./connectionBase').connection;

const tagSchema = new mongoose.Schema({
    userID: { type: String },
    body: { type: String },
    timestamp: { type: String },
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

//function viewInvetory(callback){
//  inventoryModel.find({}, function (err, list) {
//    if(err) return console.error(err);
//    callback(list);
//  });
//}

//module.exports.viewInvetory = viewInvetory;

