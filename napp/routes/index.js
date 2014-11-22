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
           "LoadImages": false
       },
       "S": [
           "TopNews.Headline"
       ]
   }
}

var liveNews={
   "Entity": {
       "E": "TopNews",
       "W": {
           "Codes": [
               "urn:newsml:reuters.com:20020923:SPDOC_119827232002"
           ],
           "LoadImages": false,
           "F": {
               "AND": [
                   {
                       "field": "TopNews.StoryDateTime",
                       "AND": [
                           {
                               "value": new Date(),
                               "operator": "eq"
                           }
                       ]
                   }
               ]
           }
       }
   },
   "St": [
       {
           "F": "StoryDateTime",
           "O": "asc"
       }
   ]
}


/* GET home page. */
router.get('/test', function(req, res) {
 res.render('index.ejs', { title: 'Express' });
});

router.get('/', function(req, res) {
   msf.login(username, password, function(error) {
       if (!error) {
           msf.getData(liveNews, function(error, response) {

           for(var i = 0; i <response.TopNews.length ; i++){
           var headline = response.TopNews[i].Headline;
                            
            
             response.TopNews[i].Keywords =[];
             var words = headline.split(" ");
             
               for(var j = 0; j < words.length; j++)
               {
                 if(words[j][0] <="Z" && words[j][0]>="A" ){
                   response.TopNews[i].Keywords.push(words[j]);
                             }
               }
                   
             
             console.log(response.TopNews[i].Headline +"\n"+ response.TopNews[i].Keywords);
           }
             res.render('index.ejs', { news: JSON.stringify(response, false, 2)});
                 
               
           });
       } else {
           console.log("Error Login: "+error);
           res.render('index.ejs', { news: "error"});
       }
   });
 

 
});

module.exports = router;