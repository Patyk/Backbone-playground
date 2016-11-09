var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/People_Table')

var Schema = mongoose.Schema;

var PersonSchema = new Schema({
    name: String,
    age: Number,
    occupation: String,
    gender: String
})

mongoose.model('Person', PersonSchema);

var Person = mongoose.model('Person');

// var person = new Person({
//     name: 'Gosia',
//     age : 21,
//     occupation: 'It gal',
//     gender: 'F'
// });
// person.save();

var app = express();

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
// ROUTES

app.get('/api/person', function (req, res) {
    Person.find(function (err, docs) {
        docs.forEach(function (item) {
            console.log('Received a GET request for _id: ' + item._id);
        });
        res.send(docs);
    })
});

app.post('/api/person', function (req, res) {
    console.log('Received a POST request');
    for (var key in req.body) {
        console.log(key + ': ' + req.body[key]);
    }
    var person = new Person(req.body);
    person.save(function (err, doc) {
        res.send(doc);
    })
});

app.delete('/api/person/:id',
    function (req, res) {
        console.log('DELETE request for id: ' + req.params.id);
        Person.remove({_id: req.params.id},
            function (err, doc) {
                console.log('removed');
                res.send({_id: req.params.id});
            });
    });


var port = 16667;

app.listen(port, '0.0.0.0');
console.log('server on ' + port);

