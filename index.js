// dependencies
'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const http = require('https');
var unirest = require("unirest");
let errorResponse = {
    results: []
};
var port = process.env.PORT || 8080;
var apiKey = 'dc7a99af9cc6432e9791af434a6f1328';
// create serve and configure it.
const server = express();
server.use(bodyParser.json());

server.post('/get', function (request, response) {
    var param = request.body.result.parameters;
    switch (param['test']) {
        case test1:
            console.log('test 1');
            break;
        case test2:
            console.log('test 2');
            break;
        default:
            console.log('test default');
    }
    response.setHeader('Content-Type', 'application/json');
    response.send(JSON.stringify({
        "speech": "Hello from /get :)",
        "displayText": "Hello from /get :)"
    }));
})

server.post('/', function (request, response) {
    var param = request.body.result.parameters;
    response.setHeader('Content-Type', 'application/json');
    response.send(JSON.stringify({
        "speech": "Hello from /get :)",
        "displayText": "Hello from /get :)"
    }));
})

server.post('/getNews', function (request, response) {
    console.log(request);
    var url = "https://newsapi.org/v2/"
        + (request.body.result.parameters['top-headline']!="" 
        || request.body.result.parameters['source']=="" ? "top-headlines" : "everything")
        + "?apiKey=" + apiKey;
    var req = unirest("GET", url);
    req.query({
        "pageSize": "4",
        "page": request.body.result.parameters['page'] || "1",
    });
    (request.body.result.parameters['top-headline']!="" 
    || request.body.result.parameters['source']=="" ?
            req.query({ "category" : request.body.result.parameters['category'] || "general",
                        "country": request.body.result.parameters['language'] || "fr"
            })
            :req.query({"sources": request.body.result.parameters['source'], 
                        "language" : request.body.result.parameters['language'] || "fr" }) );
    console.log(req);
    req.send("{}");
    req.end(function (res) {
        if (res.error) {
            console.log(res.error);
            response.setHeader('Content-Type', 'application/json');
            response.send(JSON.stringify({
                "speech": "Error. Can you try it again ? ",
                "displayText": "Error. Can you try it again ? "
            }));
        } else if (res.body.totalResults > 0) {
            let article = res.body.articles;
            let text = "Voici les news";
            if(request.body.result.parameters['source']!= "" && request.body.result.parameters['source']!= undefined ) {
                text += " de " + request.body.result.parameters['source'];
            }else if(request.body.result.parameters['category']!= "") {
                text += " correspondates"
            }
                text += " :\n";
            let output = Array(article.length);
            for (let i = 0; i < article.length; i++) {
                output[i] = {
                    "type": "card",
                    "title": article[i].title,
                    "image": article[i].urlToImage,
                    "subtitle" : article[i].description,
                    "buttons": [{
                        "type": "link",
                        "text": "Voir en détail",
                        "value": article[i].url
                    }]
                };
            }

            response.setHeader('Content-Type', 'application/json');
            response.send(JSON.stringify({
                "speech": text,
                "posts": output
            }));
        }
    });
});
/*
server.get('/getNewsName',function (req,res){
  var req = unirest("GET", "https://newsapi.org/v2/sources?"+apiKey);
  req.query({
      "category": request.body.result.parameters['category'],
      "language": request.body.result.parameters['language'],
      "country": requesst.body.result.parameters['country']
  });
  req.send("{}");
  req.end(function(res) {
      if(res.error) {
        console.log('getNewsName : res error')
          response.setHeader('Content-Type', 'application/json');
          response.send(JSON.stringify({
              "speech" : "Error. Can you try it again ? ",
              "displayText" : "Error. Can you try it again ? "
          }));
      } else if(res.body.results.length > 0) {
          let result = res.body.results;
          console.log('result ' + result);
          let output = '';
          for(let i = 0; i<result.length;i++) {
              output += result[i].title;
              output+="\n"
          }
          console.log('output : ' + output);
          response.setHeader('Content-Type', 'application/json');
          response.send(JSON.stringify({
              "speech" : output,
              "displayText" : output
          })); 
      }
  });  
}); */

server.listen(port, function () {
    console.log("Server is up and running...");
});