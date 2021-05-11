
const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const mongoose = require('mongoose')


const fs = require('fs');
const path = require('path');
require('dotenv/config');


// Step 2 - connect to the database

mongoose.connect(process.env.MONGO_URL,
    { useNewUrlParser: true, useUnifiedTopology: true }, err => {
        console.log('connected')
    });

// Step 3 - code was added to User.js in Models. 

// Step 4 - set up EJS

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Set EJS as templating engine
app.set("view engine", "ejs");

// Step 5 - set up multer for storing uploaded files
 
const multer = require('multer');
 
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now())
    }
});
 
const upload = multer({ storage: storage });

// Step 6 - load the mongoose model for Image
 
const imgModel = require('./models/User');

// Step 7 - the GET request handler that provides the HTML UI
 
app.get('/', (req, res) => {
    imgModel.find({}, (err, items) => {
        if (err) {
            console.log(err);
            res.status(500).send('An error occurred', err);
        }
        else {
            res.render('imagesPage', { items: items });
        }
    });
});