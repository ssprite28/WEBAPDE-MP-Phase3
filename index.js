//start mongo in
//ububtu: service mongod start
//windows: C:/-> mongo/bin/ -> mongod

const express = require('express');
const server = express();


const session = require('express-session');
const mongoStore = require('connect-mongo')(session);

const mongoose = require('./model/connectionBase');

server.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
//    store: new mongoStore({
//      mongooseConnection: mongoose.connect,
//      ttl: 2 * 24 * 60 * 60,
//      autoRemove: 'native'
//    })
}));

const bodyParser = require('body-parser')
server.use(express.json()); 
server.use(express.urlencoded({ extended: true }));

server.set('view engine', 'ejs');

server.use(express.static(__dirname + '/public'));

const controllers = ['login','post','tag'];
for(var i=0;i<controllers.length;i++){
  const mdl = require('./controller/'+controllers[i]+'Controller');
  mdl.Activate(server);
}

//const port = process.env.PORT | 9090;
const port = process.env.PORT || 9090;
server.listen(port);
