//Create a module made only for the base connection. This way there is only 1
//major connection created
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/shopping-cart');

module.exports.connection = mongoose;

