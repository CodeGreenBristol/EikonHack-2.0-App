var express = require('express');
var MSF = require('../MSF');
var router = express.Router();
var unirest = require('unirest');


var username = "eikonstudent2@thomsonreuters.com";
var password = "Secret123";
var msf = new MSF(true);

var marketFeed={
   "Entity": {
       "E": "TATimeSeries",
       "W": {
           "Tickers": [
               "AAPL.O"
           ],
           "Currency": "USD",
           "NoInfo": true,
           "Interval": "Daily",
           "IntervalMultiplier": 1,
           "DateRange": "Month",
           "DateRangeMultiplier": 1,
           "StartDate": "2014-01-15T05:17:12",
           "EndDate": "2014-05-01T00:00:00"
           
       }
   }
}

function callback(newsfeed,res){
    msf.getData(marketFeed, function(error, response) {
     // for(var i = 0; i <response.R.length ; i++)
     //  for(var j = 0; j <response.R[i].Data.length ; j++){
     //  console.log(response.R[i].Data[j]);       
     // }
     
     console.log(newsfeed);
        res.render('index.ejs', { news: JSON.stringify(newsfeed).toString(), marketdata: JSON.stringify(response, false, 2)});
    });       
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
       },
       "S": [
           "TopNews.Headline",
           "TopNews.StoryDateTime",
           "TopNews.Brief"
       ]
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
                          

              var moment = require('moment');
              var startDate = moment( new Date().toISOString(), 'YYYY-MM-DDTHH:mm:ss');
              var endDate = moment(response.TopNews[i].StoryDateTime, 'YYYY-MM-DDTHH:mm:ss');
              var secondsDiff = endDate.diff(startDate, 'seconds');
              var dateQuery = (new Date(secondsDiff%86400*1000)).toUTCString().replace(/.*(\d{2}):(\d{2}):(\d{2}).*/, "$1h") + " ago";
        
              console.log(dateQuery)  
              response.TopNews[i].date  =  dateQuery; 

             response.TopNews[i].Keywords =[];
             var words = headline.replace(/[\.,-\/#!$%\^&\*;:{}=\-_`~()]/g,"").split(" ");
             
               for(var j = 0; j < words.length; j++)
               {
                 if(words[j][0] <="Z" && words[j][0]>="A" ){
                   response.TopNews[i].Keywords.push(words[j]);
                             }
               }
                   
             
             //console.log(response.TopNews[i].Headline +"\n"+ response.TopNews[i].Keywords);
           }
            
            callback(response,res);
                 //  res.render('index.ejs', { news: JSON.stringify(response, false, 2)});
                 
           });       

       } else {
           console.log("Error Login: "+error);
           res.render('index.ejs', { news: "error"});
       }
   });
 

 
});

module.exports = router;