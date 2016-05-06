/**
 * Copyright 2015 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

var express = require('express'),
    app = express(),
    watson = require('watson-developer-cloud');

var Twitter = require('twitter');

// Bootstrap application settings
require('./config/express')(app);

// Create the service wrapper
var toneAnalyzer = watson.tone_analyzer({
	url : 'https://gateway.watsonplatform.net/tone-analyzer-beta/api/',
	username : '<username>',
	password : '<password>',
	version_date : '2016-11-02',
	version : 'v3-beta'
});

app.get('/', function(req, res) {
	res.render('index', {
		ct : req._csrfToken,
		ga : process.env.GOOGLE_ANALYTICS
	});
});

function get_twitter_text(twitter_id) {

	var client = new Twitter({
		consumer_key : 'lHzz6GTeKurYrkm4jvLDaHmBC',
		consumer_secret : 'NpZuYSfwiqlphVhcWpj4zihJo1P3V2OX9RdsSU2WIPS4PtQKwV',
		access_token_key : '78811456-veOvkBTw28fujh1NZZYzHLxE8RVJlJ7ffdsz3xHk3',
		access_token_secret : 'zrHu5XqVbqqda5Fo6aPRYBXGMPfqfVnYhHJC2f1GGoJgq'
	});

	var params = {
		screen_name : twitter_id,
		count : 50,
		exclude_replies : false,
		include_rts : true
	};

	
	client.get('statuses/user_timeline', params, function(error, tweets, response) {

		if (!error) {

			var twitter_text = '';
			
			for (var i=0; i < tweets.length; i++){
					twitter_text = twitter_text + ' ' + tweets[i].text;
			}
			
			console.log('twitter_text1=' + twitter_text);
			return twitter_text;
			
		} else
			console.log(error);

		
	});

}

app.get('/api/twitter/:twitter_id', function(req, res) {

	res.send("<pre>" + get_twitter_text(req.params.twitter_id) + "</pre>");

});


app.post('/api/tone', function(req, res, next) {

	// first get twitter feed

	// console.log('body=' + req.body);

	if (req.body.type == 'twitter') {
		var client = new Twitter({
			consumer_key : 'lHzz6GTeKurYrkm4jvLDaHmBC',
			consumer_secret : 'NpZuYSfwiqlphVhcWpj4zihJo1P3V2OX9RdsSU2WIPS4PtQKwV',
			access_token_key : '78811456-veOvkBTw28fujh1NZZYzHLxE8RVJlJ7ffdsz3xHk3',
			access_token_secret : 'zrHu5XqVbqqda5Fo6aPRYBXGMPfqfVnYhHJC2f1GGoJgq'
		});

		var params = {
			screen_name : req.body.text,
			count : 50,
			exclude_replies : true,
			include_rts : false
		};

		var twitter_text = '';

		client.get('statuses/user_timeline', params, function(error, tweets, response) {

			if (!error) {

				for (var i=0; i < tweets.length; i++){
					twitter_text = twitter_text + ' ' + tweets[i].text;
				}

				console.log('twitter_text1=' + twitter_text);

				toneAnalyzer.tone({
					"text" : twitter_text
				}, function(err, data) {
					if (err)
						return next(err);
					else
						return res.json(data);
				});
			} else
				console.log(error);
				return error;

		});

	} else {

		toneAnalyzer.tone({
			"text" : req.body.text
		}, function(err, data) {
			if (err)
				return next(err);
			else
				return res.json(data);
		});

	}

});

// error-handler application settings
require('./config/error-handler')(app);

module.exports = app;
