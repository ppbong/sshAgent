var express = require('express');
var router = express.Router();

var { dbservice } = require('../service/dbservice')

router.get('/', function(req, res, next) {
  dbservice.selectConfigAll((rows) => {
    res.send(rows);
  })
});

module.exports = router;
