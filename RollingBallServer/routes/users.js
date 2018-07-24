'use strict'

let express = require('express');
let request = require('request');
let router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    let code;
    let data;
    code = req.query.code;
    request('https://api.weixin.qq.com/sns/jscode2session?appid=wx2686a8d6bd284557&secret=6dd8127da3ee1aaa24b1d89af04723cb&js_code='+ code +'&grant_type=authorization_code', function (error, response, body) {
        if (!error && response.statusCode === 200) {
            data = JSON.parse(body);
            console.log(data)
            res.send(data);
        }
    })

});

module.exports = router;
