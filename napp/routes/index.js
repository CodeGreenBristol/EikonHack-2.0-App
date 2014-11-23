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

          response.TopNews[0].Brief = "WASHINGTON - The Pentagon said on Friday it had awarded Lockheed Martin Corp a contract valued at $4.7 billion for an eighth batch of F-35 fighter jets that lowered the average price per jet by 3.5 percent from the last contract, and 57 percent from the first batch.";
          response.TopNews[0].Headline ="Lockheed, Pentagon ink $4.7 billion deal for eighth batch of F-35 fighters";
          response.TopNews[0].Keywords[0] = "Lockheed";
          response.TopNews[0].Keywords[0] = "Pentagon";
          response.TopNews[0].Keywords[0] = "F-35";
          response.TopNews[0].date ="05h ago";

          response.TopNews[1].Brief ="Visa Inc , the world's largest credit and debit card company, said it might have to pay more than $10 billion to buy its London-based European licensee, Visa Europe Ltd, if its owners exercise their option to sell it.";
          response.TopNews[1].Headline ="Visa sees Visa Europe option now costing more than $10 billion";
          response.TopNews[1].Keywords[0] ="Visa";
          response.TopNews[1].Keywords[1]="Europe";
          response.TopNews[1].Keywords[2]="credit";
          response.TopNews[1].date = "06h ago";

          response.TopNews[2].Brief = "FRANKFURT - ThyssenKrupp would consider a sale of the group's military submarine business under certain conditions, the German steel maker's chief executive told daily Sueddeutsche Zeitung.";
          response.TopNews[2].Headline ="Thyssen CEO says sale of submarine unit possible: Sueddeutsche";
          response.TopNews[2].Keywords[0] ="Thyssen";
          response.TopNews[2].Keywords[1] ="Sueddeutsche";
          response.TopNews[2].Keywords[1] ="military";
          response.TopNews[2].date = "07h ago";
           

            
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