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
        sys.language : // fr(default)|en
        pageSize : number of news returned per page
        category : //category of the news general(default)|business|entertainment|health|science|sports|technology
      }
    }
  }
}

The response will be like :
response {
  speech : "",
  displayText : "",
  data : [{
      Anything you want here.
  }]
}
