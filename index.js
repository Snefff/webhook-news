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

server.post('/get',function (request,response) {
  var param = request.body.result;
  switch(param['test']) {
    case test1 :
      console.log('test 1');
    break;
    case test2 :
      console.log('test 2');
    break;
    default:
      console.log('test default');
  }
  response.setHeader('Content-Type', 'application/json');
    response.send(JSON.stringify({
    "speech" : "Hello from /get :)",
    "displayText" : "Hello from /get :)"
  })); 
})

server.post('/',function (request,response) {
    var param = request.body.result;
    console.log('test');
    switch(param['test']) {
      case test1 :
        console.log('test 1');
      break;
      case test2 :
        console.log('test 2');
      break;
      default:
        console.log('test default');
    }
    response.setHeader('Content-Type', 'application/json');
      response.send(JSON.stringify({
      "speech" : "Hello from /get :)",
      "displayText" : "Hello from /get :)"
    })); 
  })

server.post('/getNews',function (request,response)  {
    if(request.body.result.parameters['top-headline']) {
        var req = unirest("GET", "https://newsapi.org/v2/top-headlines?apiKey="+apiKey);
            req.query({
                "pageSize": "4" || request.body.result.parameters['page'],
                "country": "fr" || request.body.result.parameters['lang'],
                "category": "general" || request.body.result.parameters['category']
            });
            console.log(request);
            req.send("{}");
            req.end(function(res) {
                if(res.error) {
                    response.setHeader('Content-Type', 'application/json');
                    response.send(JSON.stringify({
                        "speech" : "Error. Can you try it again ? ",
                        "displayText" : "Error. Can you try it again ? "
                    }));
                } else if(res.body.totalResults > 0) {
                    let article = res.body.articles;
                    let text = "Voici les news :\n";
                    let output = Array(10);
                    for(let i = 0; i<5;i++) {
                        output[i] = {
                            "type" : "card",
                            "title" : article[i].title,
                            "image" : article[i].urlToImage,
                            "buttons" : [{
                                "type" : "button",
                                "text" : "Voir en détail",
                                "value" : article[i].url
                            }]
                        };
                    }
                    console.log(JSON.stringify({
                        "speech" : text,
                        "displayText" : text,
                        "payload" : {
                                        "gogowego" : {
                                            "attachments" : output                                           
                                        }
                        }
                    }));
                    response.setHeader('Content-Type', 'application/json');
                    response.send(JSON.stringify({
                        "speech" : text,
                        "displayText" : text,
                        "payload" : {
                                        "gogowego" : {
                                            "attachments" : output                                           
                                        }
                        }
                    })); 
                }
            });
    }
    /* else if(request.body.result.parameters['source-name']) {
     //   console.log('popular-movies param found');
        let movie = request.body.result.parameters['source-name'];
        var req = unirest("GET", "https://api.themoviedb.org/3/search/movie");
            req.query({
                "include_adult": "false",
                "page": "1",
                "query":movie,
                "language": "en-US",
                "api_key": ""
            });
            req.send("{}");
            req.end(function(res) {
                if(res.error) {
                    response.setHeader('Content-Type', 'application/json');
                    response.send(JSON.stringify({
                        "speech" : "Error. Can you try it again ? ",
                        "displayText" : "Error. Can you try it again ? "
                    }));
                } else if(res.body.results.length > 0) {
                let result = res.body.results[0];
                let output = "Average Rating : " + result.vote_average + 
                "\n Plot : " + result.overview + "url" + result.poster_path
                    response.setHeader('Content-Type', 'application/json');
                    response.send(JSON.stringify({
                        "speech" : output,
                        "displayText" : output
                    }));
                } else {
                    response.setHeader('Content-Type', 'application/json');
                    response.send(JSON.stringify({
                        "speech" : "Couldn't find any deatails. :(  ",
                        "displayText" : "Couldn't find any deatails. :(  "
                    }));
                }
            });

    } else if(request.body.result.parameters['theme-name']) {    
        var req = unirest("GET", "https://api.themoviedb.org/3/movie/popular");
            req.query({
                "page": "1",
                "language": "en-US",
                "api_key": ""
            });
            req.send("{}");
            req.end(function(res){
                if(res.error) {
                    response.setHeader('Content-Type', 'application/json');
                    response.send(JSON.stringify({
                        "speech" : "Error. Can you try it again ? ",
                        "displayText" : "Error. Can you try it again ? "
                    }));
                } else {
                    let result = res.body.results;
                    let output = '';
                    for(let i = 0; i < result.length;i++) {
                        output += result[i].title;
                        output+="\n"
                    }
                    response.setHeader('Content-Type', 'application/json');
                    response.send(JSON.stringify({
                        "speech" : output,
                        "displayText" : output
                    })); 
                }
            });
    } */
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