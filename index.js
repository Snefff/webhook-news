// dependencies
'use strict';
const express = require('express');
const bodyParser = require('body-parser');
var unirest = require("unirest");
var moment = require("moment");


var port = process.env.PORT || 8080;


// create server and configure it.
const server = express();
server.use(bodyParser.json());


// entry point
server.post('/cocktail', function (request, response) {
    var param = request.body.intent.inputs;
    console.log("List of your entities : ");
    Object.keys(param).forEach(element => { console.log(element + " - " + param[element]) });
    var url = "https://www.thecocktaildb.com/api/json/v1/1/"
    if (param["alcohol"]) {
        url += "filter.php?i=" + param["alcohol"];
    } else if (param["Random cocktail"]) {
        url += "random.php";
    } else if (param["Cocktail name"]) {
        url += "/search.php?s=" + param["Cocktail name"];
    }else if (param["ggwg/number"]) {
        url += "/lookup.php?i=" + param["ggwg/number"];
    }
        var req = unirest("GET", url);
    console.log(req);
    req.send("{}");
    req.end(function (res) {
        if (res.error) {
            console.log(res.error);
            response.setHeader('Content-Type', 'application/json');
            response.send(JSON.stringify({
                "speech": "Error. Can you try it again ? ",
                "posts": []
            }));
        } else if (res.body.drinks.length > 0) {
            let drink = res.body.drinks;
            let output = Array(drink.length);
            let text = "";
            if(param["alcohol"] || param["Cocktail name"]) {
                text += "Voici les cocktails correspondants : \n"
            }else if(param["ggwg/number"]) {
                text += "Voici les détail du cocktail :\n"
            }else  {
                text += "Voici un cocktail que tu devrais tester !\n"
            }
            if(param["ggwg/number"]) {
                output[0] = {
                    "type": "card",
                        "title": drink[0].strDrink,
                        "image": drink[0].strDrinkThumb,
                        "text" : drink[0].strInstructions,
                }
                for(let i = 1; i < 20 ; i++) {
                    console.log(drink[0]["strIngredient" + i]);
                    if(drink[0]["strIngredient" + i]) {
                        output[i] = {
                            "type":"card",
                            "title": drink[0]["strIngredient"+i],
                            "text": drink[0]["strMeasure"+i]
                        }
                    }
                }
            }else {
                for (let i = 0; i < drink.length; i++) {
                    output[i] = {
                        "type": "card",
                        "title": drink[i].strDrink,
                        "image": drink[i].strDrinkThumb,
                        "buttons": [{
                            "type": "button",
                            "text": "Voir en détail",
                            "value": "Detail " + drink[i].idDrink
                        }]
                    };
                }
            }
            console.log(output[0]);
            console.log(output);
            response.setHeader('Content-Type', 'application/json');
            response.send(JSON.stringify({
                "speech": text,
                "posts": output
            }));
        }
    });
});

server.post('/meal', function (request, response) {
    var param = request.body.intent.inputs;
    console.log("List of your entities : ");
    Object.keys(param).forEach(element => { console.log(element + " - " + param[element]) });
    var url = "https://www.themealdb.com/api/json/v1/1/"
    if (param["Category"]) {
        url += "filter.php?c=" + param["Category"];
    } else if (param["Area"]) {
        url += "filter.php?a=" + param["Area"];
    } else if (param["Random meal"]) {
        url += "random.php";
    }else if(param["ggwg/number"]) {
        url += "lookup.php?i=" + param["ggwg/number"];
    }   
        var req = unirest("GET", url);
    console.log(req);
    req.send("{}");
    req.end(function (res) {
        if (res.error) {
            console.log(res.error);
            response.setHeader('Content-Type', 'application/json');
            response.send(JSON.stringify({
                "speech": "Error. Can you try it again ? ",
                "posts": []
            }));
        } else if (res.body.meals.length > 0) {
            let meal = res.body.meals;
            let output = Array(meal.length);
            let text = "";
            if(param["Category"] || param["Area"]) {
                text +="Voici les recettes correspondantes : \n";
            }else if(param["ggwg/number"]){
                text += "Voici le détail de la recette : \n";
            }else {
                text += "Voici une recette que tu devrais tester !\n";
            }
            if(param["ggwg/number"]) {
                output[0] = {
                    "type": "card",
                        "title": meal[0].strMeal,
                        "image": meal[0].strMealThumb,
                        "text" : meal[0].strInstructions,
                }
                for(let i = 1; i < 20 ; i++) {
                    console.log(meal[0]["strIngredient" + i]);
                    if(meal[0]["strIngredient" + i]) {
                        output[i] = {
                            "type":"card",
                            "title": meal[0]["strIngredient"+i],
                            "text": meal[0]["strMeasure"+i]
                        }
                    }
                }
            }else {
                for (let i = 0; i < meal.length; i++) {
                    output[i] = {
                        "type": "card",
                        "title": meal[i].strMeal,
                        "image": meal[i].strMealThumb,
                        "buttons": [{
                            "type": "button",
                            "text": "Voir en détail",
                            "value": "Detail " + meal[i].idMeal
                        }]
                    };
                }
            }
            console.log(output);
            response.setHeader('Content-Type', 'application/json');
            response.send(JSON.stringify({
                "speech": text,
                "posts": output
            }));
        }
    });
});

server.post('/reservation', function (request, response) {
    var param = request.body.intent.inputs;
    console.log("List of your entities : ");
    Object.keys(param).forEach(element => { console.log(element + " - " + param[element])});
    let date = moment(param["ggwg/datetime"]).format("D/M");
    let text = "Nous vous confirmons l'enregistrement de votre réservation "
                +(param["typeResa"] == "Restaurant" ? "d'une table pour "
                 : param["typeResa"] == "Hotel" ? "d'une chambre pour "
                 : param["typeResa"] == "Visio" ? "d'une salle de visio pour "
                 : "pour ")
                +param["ggwg/number"] + " personnes pour le " + date;
    console.log(date);
    response.setHeader('Content-Type', 'application/json');
    response.send(JSON.stringify({
        "speech": text,
        "posts": []
    }));
})

server.post('/support', function (request, response) {
    var param = request.body.intent.inputs;
    console.log("List of your entities : ");
    Object.keys(param).forEach(element => { console.log(element + " - " + param[element])});
    let text = "Nous vous confirmons l'enregistrement de votre problème "
                +(param["typeMateriel"] != "Ordinateur" ? "concernant un périphérique "
                 : param["typeMateriel"] ? "concernant votre ordinateur " 
                 : param["typeService"] == "Connection" ? "concernant la connexion à un serivce "
                 : param["typeService"] ? "concernant l'accés à un serivce " : ".");

    response.setHeader('Content-Type', 'application/json');
    response.send(JSON.stringify({
        "speech": text,
        "posts": []
    }));
})

server.post('/movie', function (request, response) {
    var param = request.body.intent.inputs;
    console.log("List of your entities : ");
    Object.keys(param).forEach(element => { console.log(element + " - " + param[element])});
    let text = "";
    response.setHeader('Content-Type', 'application/json');
    response.send(JSON.stringify({
        "speech": text,
        "posts": []
    }));
})



server.listen(port, function () {
    console.log("Server is up and running...");
});