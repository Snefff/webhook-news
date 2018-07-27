# webhook-news

A very simple webhook designed to interact with dialogFlow.

# How to use
send a post request to :
https://webhook-news-api.herokuapp.com/getNews

Request should have this data struct :
request {
  body : {
    result : {
      parameters : {
        top-headline : "" // anything else than blank means true
      }
    }
  }
}

The response will be like :
response {
  speech : "",
  displayText : "",
  message : [{
      type : 4,
      payload : Object
  }]
}
