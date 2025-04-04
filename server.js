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
var path = require("path");
var expressLayouts = require("express-ejs-layouts");
var collegeData = require('./modules/collegeData'); // Import collegeData module

var app = express();

app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));
app.use(expressLayouts);
app.use(express.json());

app.set("layout", "layouts/main");
app.set('view engine', 'ejs'); // Specifies EJS as the view engine
app.set('views', path.join(__dirname, 'views')); // Points to the "views" directory

// Middleware for setting active navigation link
app.use(function(req, res, next) {
    let route = req.path.substring(1);
    app.locals.activeRoute = "/" + (isNaN(route.split('/')[1]) ? route.replace(/\/(?!.*)/, "") : route.replace(/\/(.*)/, ""));
    next();
});

// Helper functions for navigation and conditional rendering
app.locals.navLink = function (url, options) {
    return (
      '<li' +
      (url === app.locals.activeRoute ? ' class="nav-item active" ' : ' class="nav-item" ') +
      '><a class="nav-link" href="' +
      url +
      '">' +
      options.fn(this) +
      "</a></li>"
    );
  };
  
  app.locals.equal = function (lvalue, rvalue, options) {
    if (arguments.length < 3) {
      throw new Error("Ejs Helper equal needs 2 parameters");
    }
    return lvalue !== rvalue ? options.inverse(this) : options.fn(this);
  };
  
  // Routes
  app.get("/", (req, res) => res.render("home"));
  app.get("/about", (req, res) => res.render("about"));
  app.get("/htmlDemo", (req, res) => res.render("htmlDemo"));
  
  app.get("/students", async (req, res) => {
    try {
      const students = await collegeData.getAllStudents();
      res.json(students);
    } catch (err) {
      res.status(500).json({ error: "Failed to retrieve students." });
    }
  });
  
  app.get("/students/course/:course", async (req, res) => {
    try {
      const students = await collegeData.getStudentsByCourse(req.params.course);
      res.json(students);
    } catch (err) {
      res.status(500).json({ error: "Failed to retrieve students by course." });
    }
  });
  
  app.get("/student/:num", async (req, res) => {
    let viewData = {};
  
    try {
      viewData.student = await collegeData.getStudentByNum(req.params.num);
      if (!viewData.student) throw new Error("Student not found");
    } catch {
      viewData.student = null;
    }
  
    try {
      viewData.courses = await collegeData.getCourses();
      if (viewData.student) {
        viewData.courses.forEach((course) => {
          if (course.courseId === viewData.student.course) {
            course.selected = true;
          }
        });
      }
    } catch {
      viewData.courses = [];
    }
  
    viewData.student
      ? res.render("student", { viewData })
      : res.status(404).send("Student Not Found");
  });
  
  app.get("/students/add", async (req, res) => {
    try {
      const courses = await collegeData.getCourses();
      res.render("addStudent", { courses });
    } catch {
      res.render("addStudent", { courses: [] });
    }
  });
  
  app.post("/students", async (req, res) => {
    try {
      await collegeData.addStudent(req.body);
      res.send("Student added successfully");
    } catch (err) {
      res.status(500).json({ error: "Failed to add student." });
    }
  });
  
  app.put("/student/:num", async (req, res) => {
    try {
      req.body.studentNum = req.params.num;
      await collegeData.updateStudent(req.body);
      res.send("Student updated successfully");
    } catch (err) {
      res.status(500).json({ error: "Failed to update student." });
    }
  });
  
  app.get("/student/delete/:studentNum", async (req, res) => {
    try {
      await collegeData.deleteStudentByNum(req.params.studentNum);
      res.redirect("/students");
    } catch {
      res.status(500).send("Unable to remove student / Student not found");
    }
  });
  
  app.get("/courses", async (req, res) => {
    try {
      const courses = await collegeData.getCourses();
      res.json(courses);
    } catch {
      res.status(500).json({ error: "Failed to retrieve courses." });
    }
  });
  
  app.get("/course/:id", async (req, res) => {
    try {
      const course = await collegeData.getCourseById(req.params.id);
      if (!course) {
        return res.status(404).send("Course Not Found");
      }
      res.render("course", { course });
    } catch {
      res.status(500).send("Error retrieving course");
    }
  });
  
  app.get("/courses/add", (req, res) => res.render("addCourse"));
  app.post("/courses/add", async (req, res) => {
    try {
      await collegeData.addCourse(req.body);
      res.redirect("/courses");
    } catch {
      res.status(500).send("Unable to add course");
    }
  });
  
  app.post("/course/update", async (req, res) => {
    try {
      await collegeData.updateCourse(req.body);
      res.redirect("/courses");
    } catch {
      res.status(500).send("Unable to update course");
    }
  });
  
  app.get("/course/delete/:id", async (req, res) => {
    try {
      await collegeData.deleteCourseById(req.params.id);
      res.redirect("/courses");
    } catch {
      res.status(500).send("Unable to remove course / Course not found");
    }
  });
  
  // Error Handling Middleware
  app.use((req, res) => {
    res.status(404).json({ error: "Page Not Found" });
  });
  
  // Server Initialization
  collegeData.initialize()
    .then(() => {
      console.log("Database initialized successfully!");
      app.listen(HTTP_PORT, () => console.log(`Server listening on port ${HTTP_PORT}`));
  })
  .catch((err) => {
    console.log("Failed to initialize data collection: " + err);
  });
