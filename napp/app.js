var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

 var port = process.env.PORT || 5000;
 app.listen(port, function() {
   console.log("Listening on " + port);
 });


var Twit = require('twit')

var T = new Twit({
    consumer_key: 'xsR8DlXbR60TTg7yt7zyOaICX', 
    consumer_secret: 'pGeoDOhj2RaD5rI9IvT8EUjsYPdi6gvEFRqJPzWkXQ30T0kqBu',
    access_token: '294332860-46oBWlPbvCexWJOaMzcFQgiTyVqt7Yp8ktmuojfP',
    access_token_secret: '3vrQBvPO5whgEOYOSUk0sjHzm18N1TgR56UjOOWGEVG57'
})

//
//  search twitter for all tweets containing the word 'banana' since Nov. 11, 2011
//
// T.get('search/tweets', { q: 'banana', count: 5 }, function(err, data, response) {
  // console.log(data)
// })

var keywords = ['thomson', 'reuters'];
var stream = T.stream('statuses/filter', { track: keywords, language: 'en' })

stream.on('tweet', function (tweet) {
    var fs = require('fs');
    fs.writeFile("./public/tweets/tweets.txt", JSON.stringify(tweet), function(err) {
        if(err) {
            console.log(err);
        } else {
            console.log("The file was saved!");
        }
    }); 
    // stream.stop();
})


//module.exports = app;z
