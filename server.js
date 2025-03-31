/*********************************************************************************
*  WEB700 – Assignment 06
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part 
*  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: Andrienne Reid     Student ID: 164798233    Date: April 5,2025
*
*  Online (Vercel) Link:https://vercel.com/andrienne-reids-projects/assignment-5
*
********************************************************************************/ 


var HTTP_PORT = process.env.PORT || 8080;
var express = require("express");
//var fs = require("fs");
var app = express();
var path = require("path");

// setup a 'route' to listen on the default url path
var collegeData = require('./modules/collegeData');

app.use(express.static(__dirname + "/public"));

app.use(express.urlencoded({ extended: true }));


//app.get("/", (req, res) => {
//    res.send("Hello World!");
//});
app.set('view engine', 'ejs'); // Specifies EJS as the view engine
app.set('views', path.join(__dirname, 'views')); // Points to the "views" directory

app.use(function(req,res,next){
    let route = req.path.substring(1);
    app.locals.activeRoute = "/" + (isNaN(route.split('/')[1]) ? route.replace(/\/(?!.*)/, "") : route.replace(/\/(.*)/, ""));    
    next();
});

app.locals.navLink = function(url, options){
    return ('<li' + 
        ((url == app.locals.activeRoute) ? ' class="nav-item active" ' : ' class="nav-item" ') + 
        '><a class="nav-link" href="' + url + '">' + options.fn(this) + '</a></li>');
};

app.locals.equal = function (lvalue, rvalue, options) {
    if (arguments.length < 3){
        throw new Error("Ejs Helper equal needs 2 parameters");}
    if (lvalue != rvalue) {
        return options.inverse(this);
    } else {
        return options.fn(this);
    }
};

app.get('/students', (req, res) => {
    collegeData.getAllStudents()
        .then(data => res.json(data))
        .catch(err => res.status(500).send(err));
});

app.get('/courses', (req, res) => {
    collegeData.getCourses()
        .then(data => res.json(data))
        .catch(err => res.status(500).send(err));
});

app.get('/students/course/:course', (req, res) => {
    collegeData.getStudentsByCourse(req.params.course)
        .then(data => res.json(data))
        .catch(err => res.status(500).send(err));
});

app.get('/student/:num', (req, res) => {
    collegeData.getStudentByNum(req.params.num)
        .then(data => res.json(data))
        .catch(err => res.status(500).send(err));
});

app.get('/course/:id', (req, res) => {
    collegeData.getCourseById(req.params.id)
        .then(data => res.json(data))
        .catch(err => res.status(500).send(err));
});

app.get('/', (req, res) => {
    res.render('home');
});

app.get("/about", (req, res) => {
    res.render('about');
});

app.get("/htmlDemo", (req, res) => {
    res.render('htmlDemo');
});

app.get("/students/add", (req, res) => {
    res.render('addStudent');
});

app.post('/students', (req, res) => {
    collegeData.addStudent(req.body)
        .then(() => res.send("Student added successfully"))
        .catch(err => res.status(500).send(err));
});

app.put('/student/:num', (req, res) => {
    req.body.studentNum = req.params.num; // Ensure `studentNum` is included in `req.body`
    collegeData.updateStudent(req.body)
        .then(() => res.send("Student updated successfully"))
        .catch(err => res.status(500).send(err));
});

app.use((req, res) => {
    res.status(404).send("Page Not Found");
});
collegeData.initialize()
    .then(() => {
        console.log("Database initialized successfully!");
        app.listen(HTTP_PORT, () => console.log(`Server listening on port ${HTTP_PORT}`));
    })
    .catch(err => {
        console.log("Failed to initialize data collection: " + err);
    });
// setup http server to listen on HTTP_PORT
//app.listen(HTTP_PORT, () => {
    //console.log("server listening on port: " + HTTP_PORT)
//});
