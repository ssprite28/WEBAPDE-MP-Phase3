const transModel = require('../model/transModel');
const invetoryModel = require('../model/invetoryModel');

function TransactionModule(server){
  
  server.get('/home', function(req, resp){
    transModel.viewTransactions('temp',function(list){
      const data = { list:list };
      resp.render('./pages/viewTrans',{ data:data });
    });
  });

  server.get('/addTransactions', function(req, resp){
    invetoryModel.viewInvetory(function(list){
      const data = { list:list };
      resp.render('./pages/addTrans',{ data:data });
    });
  });

  server.post('/system-processing/addtrans-result', function(req, resp){
    var IDList = [];
    var qtyList = [];
    var total = 0;
    for(var key in req.body){
        var val = Number(req.body[key]);
        if(!isNaN(val) && req.body[key].length>0){
            IDList.push(key);
            qtyList.push(val);
        }//end if
    }//end for
    transModel.addTransaction(
    'temp',IDList,qtyList,function(){
        resp.redirect('/home');
    });
  });
}

module.exports.Activate = TransactionModule;
