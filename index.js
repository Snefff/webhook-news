// dependencies
'use strict';
const express = require('express');
const bodyParser = require('body-parser');
var unirest = require("unirest");

var port = process.env.PORT || 8080;
var apiKey = 'dc7a99af9cc6432e9791af434a6f1328';
// create serve and configure it.
const server = express();
server.use(bodyParser.json());

server.post('/get', function (request, response) {
    var param = request.body.intent.inputs;
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
    var param = request.body.intent.inputs;
    response.setHeader('Content-Type', 'application/json');
    response.send(JSON.stringify({
        "speech": "Hello from /get :)",
        "displayText": "Hello from /get :)"
    }));
})
server.post('/example', function (request, response) {
    var param = request.body.intent.inputs;
    console.log(request.body);
    console.log("-----------------------------------------");
    console.log("List of your entities : ");
    Object.keys(param).forEach(element => { console.log(element + " - " + param[element])});
    response.setHeader('Content-Type', 'application/json');
    console.log("-----------------------------------------");
    console.log(response);
    response.send(JSON.stringify({
        "speech": "Hello from /example :)",
        "posts": []
        
    }));
})

server.post('/getNews', function (request, response) {
    console.log(request.body);
    console.log(request.body.intent.inputs);
    var url = "https://newsapi.org/v2/"
        + (request.body.intent.inputs['top-headline'] != ""
            || request.body.intent.inputs['source'] == "" ? "top-headlines" : "everything")
        + "?apiKey=" + apiKey;
    var req = unirest("GET", url);
    req.query({
        "pageSize": "4",
        "page": request.body.intent.inputs['page'] || "1",
    });
    (request.body.intent.inputs['top-headline'] != "" || request.body.intent.inputs['source'] == "" ?
        request.body.intent.inputs['category'] ?
            req.query({
                "category": request.body.intent.inputs['category'],
                "country": request.body.intent.inputs['language'] || "fr"
            })
            :
            req.query({
                "country": request.body.intent.inputs['language'] || "fr"
            })
        : 
            req.query({
            "sources": request.body.intent.inputs['source'],
            "language": request.body.intent.inputs['language'] || "fr"
        }));
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
            if (request.body.intent.inputs['source'] != "" && request.body.intent.inputs['source'] != undefined) {
                text += " de " + request.body.intent.inputs['source'];
            } else if (request.body.intent.inputs['category'] != "") {
                text += " correspondates"
            }
            text += " :\n";
            let output = Array(article.length);
            for (let i = 0; i < article.length; i++) {
                output[i] = {
                    "type": "card",
                    "title": article[i].title,
                    "image": article[i].urlToImage,
                    "subtitle": article[i].description,
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
      "category": request.body.intent.inputs['category'],
      "language": request.body.intent.inputs['language'],
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
