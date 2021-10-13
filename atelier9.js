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
console.log("le serveur est lance sur le port 8080");