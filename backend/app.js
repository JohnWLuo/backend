const express = require('express');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();




// Set-up middleware stack
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'jade');


var Contact = require('./models/contact')
var Week = require('./models/week')


const dbuser = 'admin'
const dbpass = 'admin'


// TODO
//Replace this connection string with your own instance
// const mongoDB = `mongodb+srv://${dbuser}:${dbpass}@teaching-adb1b.mongodb.net/lectureExamples?retryWrites=true`;
const mongoDB = `mongodb+srv://${dbuser}:${dbpass}@cluster0.rgarh.mongodb.net/myFirstDatabase?retryWrites=true`;
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

mongoose.set('useFindAndModify', false);


app.get('/', function (req, res) {
  res.status(200)
});

app.post("/logIn", (req, res) => {
    let contact = new Contact(req.body)
    contact._id = req.body.fname+req.body.lname;
    Contact.findById(req.body.fname+req.body.lname, (err, res2) => {
      // console.log(res2)
      if(res2 == null){
        contact.save()
        console.log()
        res.status(200).json(contact)
        // .render('index', {fname: req.body.fname, lname: req.body.lname, birthday: "", journal:"", list:"", loginerror:""});
      }
      else {
        res.status(400).send("Login post Fail")
      }
    })
})

app.get("/logIn", (req, res) => {
  // console.log(req.query)
  Contact.findById(req.query.fname+req.query.lname, (err, contact) => {
    // console.log(contact)
    if(contact != null)
    {
      console.log(contact)
      res.status(200).json(contact)
      // .render('index', {fname: req.query.fname, lname: req.query.lname, birthday: contact.birthday, journal:"", list:"", loginerror:""})
    }
    else {
      res.status(404).send("Login get Fail")
      // .render('index', {fname: "", lname: "", birthday: "", journal:"", list:"", loginerror: "Not registered"});
    }
 })
})

app.put("/dateUpdate", (req, res) => {
  // console.log(req.body)
  Contact.findByIdAndUpdate(req.body._id, req.body, function (err, docs) {
    res.status(204).send("eh")
  })

})

app.put("/weekUpdate", (req, res) => {
  // console.log("Test update")
  let week = new Week(req.body)
  Week.findOneAndUpdate({ weekNum: req.body.weekNum}, req.body, (err, contact) => {
    // console.log(req.body)
    if(contact == null)
    {
      week.save()
      // console.log("test" + req.body.fname+req.body.lname)
      Contact.findByIdAndUpdate(req.body.fname+req.body.lname, {$push: {information: week._id}},function(err, model) {
       console.log(err);
     })
    }
  })
  // console.log(req.body.fname+req.body.lname)
  res.status(200).send("eh");
})

app.get("/weekGet", (req, res) => {

  // console.log("test Get")
  Week.findOne({ weekNum: req.query.weekNum+ req.query.fname+req.query.lname}, (err, contact) => {
    // console.log(contact)
    if(contact != null){
      res.status(200).json({journal: contact.journal, list:contact.list})
    }
    else {
      res.status(404).send("Get no entry");
    }
  })
})

app.delete("/delete", (req, res) => {
  Contact.findById(req.body.fname+req.body.lname, (err, contact) => {
    if(contact != null)
    {
      // console.log(contact.information)
      Week.deleteMany({_id: { $in: contact.information}}, function(err) {})
    }
  })
  Contact.deleteOne({_id: req.body.fname+req.body.lname}, (err, contact) => {})

  res.status(205).send("deleted")

})

module.exports = app;
