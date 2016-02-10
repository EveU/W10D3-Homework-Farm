var express        = require('express');
var path           = require('path');
var bodyParser     = require('body-parser');
var expressLayouts = require('express-ejs-layouts');
var app            = express();

var Animal = require('./models/animal');
var Farm = require('./models/farm');

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/farm-manager');

Farm.find(function(err, farms){
  if(err) console.log(err);
  app.locals.farms = farms;
});

//App settings
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressLayouts);

//Serve js & css files from a public folder
app.use(express.static(__dirname + '/public'));

// ############ YOU CAN ADD YOUR ROUTES BELOW HERE
// INDEX
app.get('/', function(req, res){
  Animal.find(function(err, animals){
    if(err) console.log(err);
    res.render('index', { animals: animals });
  });
});

// CREATE
app.post('/', function(req, res){
  var newAnimal = new Animal(req.body);
  newAnimal.vetReport = {health: req.body.health, outlook: req.body.outlook};

  newAnimal.save(function(err, animal){
    if(err) console.log(err);
    console.log('New animal created');

    Farm.findById(req.body.farm_id, function(err, farm){
      if(err) console.log(err);
      farm.addAnimal(animal);
      farm.save(function(err){
        if(err) console.log(err);
        res.redirect('/');
      });
    });
  });
});

// SHOW
app.get('/:id', function(req, res){
  Animal.findById(req.params.id, function(err, animal){
    if(err) console.log(err);
    res.render('show', {animal: animal});
  });
});

app.listen(3000, function(){
  console.log("Welcome to the Farm Manager");
});