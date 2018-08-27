//Create a module made only for the base connection. This way there is only 1
//major connection created
const mongoose = require('mongoose');
mongoose.connect('mongodb://admin:r12345@ds133252.mlab.com:33252/dankmems');

module.exports.connection = mongoose;

