var MSF = require("./MSF");

var username = "XXX";
var password = "YYY";
var msf = new MSF(true);

msf.login(username, password, function(error) {
	if (!error) {
		msf.getData({
		    "entity": {
		        "e": "TATimeSeries",
		        "w": {
		            "Tickers": [
		                "GOOG.O"
		            ],
		            "NoInfo": true,
		            "Interval": "Daily",
		            "IntervalMultiplier": 1,
		            "DateRangeMultiplier": 1,
		            "StartDate": "2014-01-01T00:00:00",
		            "EndDate": "2014-09-20T00:00:00"
		        }
		    }
		}, function(error, response) {
			if (!error) {
				console.log(JSON.stringify(response,false,2));
			} else {
				console.log("Error Getting Data: "+error);
			}
		});
	} else {
		console.log("Error Login: "+error);
	}
});