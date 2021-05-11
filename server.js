
const express = require('express')
const app = express()
const mongoose = require('mongoose')


const fs = require('fs');
const path = require('path');
require('dotenv/config');


// Step 2 - connect to the database

const PORT = process.env.PORT || 8000;

//! database name and url
const DB_NAME = process.env.DB_NAME
const DB_URL = process.env.MongoDB_Link + DB_NAME
mongoose.connect(DB_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true
})
    .then(() => console.log('MongoDB database is successfully connected'))
    .catch(() => console.log('Database connection failed!'))

// Step 3 - code was added to User.js in Models. 

// Step 4 - set up EJS

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

// Set EJS as templating engine
//! Settings
app.use(express.static(__dirname + '/public'))
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

// Step 8 - the POST handler for processing the uploaded file
 
app.post('/', upload.single('image'), (req, res, next) => {
    console.log('data coming from: ', req.file)
    const obj = {
        name: req.body.name,
        desc: req.body.desc,
        img: {
            data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
            contentType: 'image/png'
        }
    }
    imgModel.create(obj, (err, item) => {
        if (err) {
            console.log(err);
        }
        else {
            // item.save();
            res.redirect('/');
        }
    });
});

// Step 9 - configure the server's port

//! listen app with port
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`)
})