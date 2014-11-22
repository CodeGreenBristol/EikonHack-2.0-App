var express = require('express');
var MSF = require('../MSF');
var router = express.Router();
var unirest = require('unirest');


var username = "eikonstudent2@thomsonreuters.com";
var password = "Secret123";
var msf = new MSF(true);


var topNews= {
   "Entity": {
       "E": "TopNews",
       "W": {
           "Codes": [
               "urn:newsml:reuters.com:20020923:SPDOC_119827232002"
           ],
           "LoadImages": true
       },
       "S": [
           "TopNews",
           "TopNews.Headline",
           "TopNews.StoryDateTime",
           "TopNews.RelatedStories.CreationDateAndTime",
           "TopNews.RelatedStories.HeadLine",
           "TopNews.RelatedStories.TopicSet",
           "TopNews.Brief",
           "TopNews.StoryId"
       ]
   }
}


/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

router.get('/home', function(req, res) {
    msf.login(username, password, function(error) {
        if (!error) {
            msf.getData(topNews, function(error, response) {
                if (!error) {

                    res.render('index.ejs', { news: JSON.stringify(response,false,2)});
                } else {
                    console.log("Error Getting Data: "+error);
                     res.render('index.ejs', { news: "error"});
                }
            });
        } else {
            console.log("Error Login: "+error);
            res.render('index.ejs', { news: "error"});
        }
    });
   

  
});

module.exports = router;
