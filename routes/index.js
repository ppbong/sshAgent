var express = require('express');
var router = express.Router();

var { dbservice } = require('../service/dbservice')

/* GET home page. */
router.get('/', function(req, res, next) {
  var product = ''
  var version = ''

  dbservice.selectByParam('product', (row1) => {
    product = row1.value

    dbservice.selectByParam('version', (row2) => {
      version = row2.value

      res.render('index', { title: 'Express', product, version });
    })
  })
  
});

module.exports = router;
