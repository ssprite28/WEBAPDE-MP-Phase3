//This is the LoginModel.
//All connections to the collection called login will be done using this class.

//Contain all Mongoose code that will be used for the login
const mongoose = require('./connectionBase').connection;

const transSchema = new mongoose.Schema({
  userID: { type: String },
  items: [{ type: mongoose.Schema.ObjectId }],
  qtys: [{ type: Number }]
},{ versionKey: false });

const transModel = mongoose.model('transaction', transSchema);

function viewTransactions(username, callback){
  //Aggregate is the closest thing in Mongo to Join in SQL
  transModel.aggregate([
   { '$match': { userID:'temp' } },{
    $lookup: {
           from: "inventories",
           localField: "items",
           foreignField: "_id",
           as: "itemNames" }
    }
  ]).exec(function (err, list) {
    if(err) return console.error(err);
    callback(list);
  });
}

module.exports.viewTransactions = viewTransactions;

function addTransaction(id, itemList, qtyList, callback){
  const instance = transModel({
      userID: id,
      items: itemList,
      qtys: qtyList });
  
  instance.save(function (err, trans) {
    if(err) return console.error(err);
    callback();
  });
}

module.exports.addTransaction = addTransaction;
