const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const Car = require('./models/Car');

/**
Creating instance of express app
*/
const app = express();

/**
Creating mongo connection using monggose odm
*/
mongoose.connect("mongodb://localhost/techcars");

/**
Configuring middlewares
*/
app.use(bodyParser.json());
app.use(morgan('tiny'));
app.use(cors());

/**
Handler at the route GET /get/cars
*/
app.get('/get/cars', (req,res) => {

    /**
    Retreiving all distict car names from DB
    */
    Car.distinct("carname",(err,cars) => {
        //console.log(cars.length);
        if(err){
            //for err
            res.status(500);
            res.send({"message" : "App Error"});
        }else if(cars.length > 0){
            //console.log(cars);
            //If cars found
            res.status(200);
            res.send(cars);
        }else{
            //If no cars found
            res.status(204);
            res.send({"message" : "No models"});
        }

    });

});

/**
Handler at the route GET /get/models/:carname
*/
app.get('/get/models/:carname',(req,res) => {
    let params = req.params;
    //console.log(params);
    //Getting all distict model names for a given car from DB
    Car.distinct("modelname", {"carname" :params.carname}, (err,models) => {
        //console.log(models.length);
        if(err){
            //If err
            res.status(500);
            res.send({"message" : "App Error"});
        }else if(models.length > 0){
            //console.log(models);
            //If models found
            res.status(200);
            res.send(models);
        }else{
            //If no models found for the given car
            res.status(204);
            res.send({"message" : "No models"});
        }
        
    })

});

/**
Handler at the route POST /save/car/details
*/
app.post('/save/car/details', (req,res) => {
    //console.log(req.body);
    //Creating new instance of Car schema with data form request body
    let newCar = new Car({
        carname : req.body.carname,
        modelname : req.body.modelname,
        carimageurl : req.body.carimageurl
    });

    /**
    Saving the newly created car instance in db
    */
    newCar.save((err) => {
        if(err){
            //If err
            res.status(500);
            res.send({message : "Server Error"});
        }else{
            //On successfull saving of data
            res.status(200);
            res.send({message : "Data saved"});
        }
    })
});

/**
Handler at the route GET /get/imageurl/:carname/:modelname
*/
app.get('/get/imageurl/:carname/:modelname', (req,res) => {

    //console.log(req.params);
    //Getting count of all the documents for Car schema
    Car.count().exec((err,count) => {

        //Generating a random number for skipping documents
        let randomOffset = Math.floor(Math.random() * count);

        //Finding a random car document with the given car and document name
        Car.findOne({
            "carname" : req.params.carname, 
            "modelname" : req.params.modelname}, 
            (err,car) => {

                if(err){
                    //if err
                    res.status(500);
                    res.send({message : "Server down"});
                }else if(car){
                    //On car found
                    res.status(200);
                    res.send(car);
                }else{
                    //On no car found
                    res.status(204);
                    res.send({message : "No Car"});
                }     
        });
    });
});

/**
Server listening at port 3000
*/
app.listen(3000, () => {
    console.log("Server running at port 3000");
});

module.exports = app;