/*
**  file              labo3.js
**  brief             Laboratoire 3 
**  author            Matis Goulet
**  version           1.00
**  date              2021/15/9

**  mainpage          Labo3.js
**  author            Matis Goulet
**  description       ce fichier gere toutes les pages (accueil, contact, controle et module) ainsi que les exeptions (404)
*/

var express = require('express');
var app = express();
app.set('view engine', 'ejs');
var mqtt = require('mqtt');
var client  = mqtt.connect('mqtt://172.22.185.86:1883');
var moduleState = [0,0,0,0,0,0];

app.get('/', function(req, res, next){
    res.render('pages/accueil');
});

app.get('/contact', function(req, res, next){
    res.render('pages/contact');
});

app.get('/controle', function(req, res, next){
    res.render('pages/controle',{state: moduleState});
});

app.get('/reset', function(req, res, next){
    for(var i = 0; i < 6; i++)
        moduleState[i] = 0;
    res.render('pages/controle',{state: moduleState});
});

app.get('/change/:nbModule', function(req, res, next){
    if(req.params.nbModule<=6 && req.params.nbModule>0)
    {
        moduleState[req.params.nbModule] = !moduleState[req.params.nbModule];
        res.render('pages/controle',{state: moduleState});
    }
    else
    {
        next();
    }
    
});

app.get('/module/:nbModule', function(req, res, next){
    if(req.params.nbModule<=6 && req.params.nbModule>0)
    {
        moduleState[req.params.nbModule] = !moduleState[req.params.nbModule];
        res.render('pages/module',{nbModule: req.params.nbModule, state: moduleState[req.params.nbModule]});
    }
    else
    {
        next();
    }
    
});

app.use(function(req, res, next){
    res.status(404).render('pages/404');
});

app.listen(8080);

client.on('connect', function () {
    console.log("MQTT connecté !");
    client.publish('MODULE', 'le serveur js vous dit bonjour');
});

client.subscribe('MODULE/#');

client.on('message', function (topic, message) {
    console.log(topic.toString());
    console.log(message.toString());
    if(topic.indexOf("MODULE") !== -1)
    {
        var mySplit = topic.split("/");
        var numModule = mySplit[mySplit.length-1];          
        var state = message; 
    }
    if(numModule < 7 && numModule > 0)
    {
        if(message == "on")
        {
            moduleState[numModule] = 1;
        }
        else if(message == "off")
        {
            moduleState[numModule] = 0;
        }
    }
});
  
console.log("le serveur est lance sur le port 8080");