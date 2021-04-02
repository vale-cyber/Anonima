const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/off');

const app = express();

const bodyParser = require('body-parser');


var server = require('http').Server(app);
var io = require('socket.io')(server);
const fs = require('fs');
app.use(express.static(__dirname+"/public"));
app.use(bodyParser.urlencoded({extended: true}));

var gname ="";

// User Model
const Question = require('../models/Question')


//READ FILE FOR FILTER AND JSON
let rawdata = fs.readFileSync('badwords.json');
let badwords = JSON.parse(rawdata);

//LIST EXAMPLE REMEMBER TO CHANGE IT TO DATABASE
var listQuestions =["lallala","lallalaalla"];


function filters(q){
    for (var i = 0; i <badwords["badwords"].length;i++){
        console.log(badwords["badwords"].length);
        if(q.search(badwords["badwords"][i]) >= 0);{
            return true;
        }
    }
    return false;
}





// Welcome Page
router.get('/', (req, res) => res.render('welcome'))
// Dashboard Page


router.get('/dashboard', ensureAuthenticated,function(req,res){
    gname = req.user.name;
    console.log(req.user.name+"------------------------"+gname);
    res.render('dashboard', {name: req.user.name});
});

module.exports = router;

router.get("/ask", ensureAuthenticated, function(req,res) {
    res.render("student"); 
});

router.post("/ask",ensureAuthenticated,function(req,res){
    var question = req.body.Question;
    listQuestions.push(question);
    console.log("Answer recorded: " + question);
    
    //update professor
    if(filters(question)){

        const newQ = new Question({
            name :gname,
            question :  question
        });
        console.log("--------------------------");
        console.log(question);


        newQ.save()
        .then( user => {
            req.flash('success_Question', 'You have successfully registered Question! You may now login.');
            res.redirect("/ask");
        })
        .catch(err => console.log(err));

        io.emit('update-question',question);
    }
    else{
        console.log("Found bad word");
    }  
});

router.get("/professor", function(req,res) {
    console.log("professor");
    res.render("professor",{questionsL: listQuestions}); //add questions and new questions later
});
server.listen(3000);

io.on("connection", function(socket) {
    console.log("socket connected");
});