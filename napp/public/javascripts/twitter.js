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
    console.log(tweet);
    // stream.stop();
})
