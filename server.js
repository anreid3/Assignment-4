/*********************************************************************************
*  WEB700 – Assignment 04
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part 
*  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: Andrienne Reid     Student ID: 164798233    Date: March 8,2025
*
*  Online (Vercel) Link: ________________________________________________________
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

app.get("/students", (req, res) => {
    collegeData.getAllStudents()
        .then((students) => {
            res.json(students);
        })
        .catch(() => {
            res.json({ message: "no results" });
        });
});

app.get("/tas", (req, res) => {
    collegeData.getTAs()
        .then((tas) => {
            res.json(tas);
        })
        .catch(() => {
            res.json({ message: "no results" });
        });
});

app.get("/courses", (req, res) => {
    collegeData.getCourses()
        .then((courses) => {
            res.json(courses);
        })
        .catch((err) => {
            console.error("Error retrieving courses:", err);
            res.json({ message: "no results" });
        });
});

app.get("/student/:num", (req, res) => {
    collegeData.getStudentByNum(req.params.num)
        .then((student) => {
            res.json(student);
        })
        .catch((err) => {
            console.error("Error retrieving student:", err);
            res.json({ message: "no results" });
        });
});


app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "/views/home.html"));
});

app.get("/about", (req, res) => {
    res.sendFile(path.join(__dirname, "/views/about.html"));
});

app.get("/htmlDemo", (req, res) => {
    res.sendFile(path.join(__dirname, "/views/htmlDemo.html"));
});

app.get("/students/add", (req, res) => {
    res.sendFile(path.join(__dirname, "/views/addStudent.html"));
});

app.post("/students/add", (req, res) => {
    collegeData.addStudent(req.body)
        .then(() => {
            res.redirect("/students");
        })
        .catch((err) => {
            console.error("Error adding student:", err);
            res.status(500).send("Unable to add student");
        });
});

app.use((req, res) => {
    res.status(404).json({ message: "Page Not Found" });
});
collegeData.initialize()
    .then(() => {
        app.listen(HTTP_PORT, () => {
            console.log("Server listening on port: " + HTTP_PORT);
        });
    })
    .catch((err) => {
        console.error("Failed to initialize data collection:", err);
    });
// setup http server to listen on HTTP_PORT
//app.listen(HTTP_PORT, () => {
    //console.log("server listening on port: " + HTTP_PORT)
//});
