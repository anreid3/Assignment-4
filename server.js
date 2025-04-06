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
var collegeData = require("./modules/collegeData");

var app = express();

app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));
app.use(expressLayouts);
app.use(express.json());

app.set("layout", "layouts/main");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware to set active navigation link
app.use(function (req, res, next) {
  let route = req.path.substring(1);
  app.locals.activeRoute =
    "/" +
    (isNaN(route.split("/")[1])
      ? route.replace(/\/(?!.*)/, "")
      : route.replace(/\/(.*)/, ""));
  next();
});

// Helper functions for navigation
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

// Routes
app.get("/", (req, res) => res.render("home"));
app.get("/about", (req, res) => res.render("about"));
app.get("/htmlDemo", (req, res) => res.render("htmlDemo"));

// Display all students
app.get("/students", async (req, res) => {
  try {
    const students = await collegeData.getAllStudents();
    res.render("student", { students });
  } catch (err) {
    res.status(500).json({ error: "Failed to retrieve students." });
  }
});

// Display student form
app.get("/students/add", async (req, res) => {
  try {
    const courses = await collegeData.getCourses();
    res.render("addStudent", { courses });
  } catch {
    res.render("addStudent", { courses: [] });
  }
});

app.get("/student/:studentNum", async (req, res) => {
  try {
    const studentNum = req.params.studentNum;
    console.log("Looking for student:", studentNum); // Debugging log

    const student = await collegeData.getStudentByNum(studentNum);
    if (!student) {
      return res.status(404).json({ error: "Student not found." });
    }

    res.render("student", { student });
  } catch (err) {
    console.error("Error retrieving student:", err);
    res.status(500).json({ error: `Failed to retrieve student: ${err.message}` });
  }
});
app.get("/student/delete/:studentNum", async (req, res) => {
  try {
    const studentNum = req.params.studentNum;
    console.log("Deleting student:", studentNum); // Debugging log

    await collegeData.deleteStudent(studentNum);
    console.log("Student deleted successfully!");

    res.redirect("/students");
  } catch (err) {
    console.error("Error deleting student:", err);
    res.status(500).json({ error: `Failed to delete student: ${err.message}` });
  }
});

app.post("/students", async (req, res) => {
  console.log("Received student data:", req.body); 
  try {
      await collegeData.addStudent(req.body);
      console.log("Student added successfully!");
      res.redirect("/students");
  } catch (err) {
      console.error("Detailed Error Adding Student:", err); // More detailed logging
      res.status(500).json({ error: `Failed to add student: ${err.message}` });
  }
});

// Display all courses
app.get("/courses", async (req, res) => {
  try {
    const courses = await collegeData.getCourses();
    res.render("course", { courses });
  } catch {
    res.status(500).json({ error: "Failed to retrieve courses." });
  }
});

// Display course form
app.get("/courses/add", (req, res) => res.render("addCourse"));

// Add a new course
app.post("/courses/add", async (req, res) => {
  console.log("Received course data:", req.body);
  try {
    await collegeData.addCourse(req.body);
    res.redirect("/courses");
  } catch (err) {
    console.error("Error adding course:", err);
    res.status(500).send("Unable to add course.");
  }
});

app.get("/course/delete/:id", async (req, res) => {
  try {
      const id = req.params.id;
      console.log("Deleting course:", id); // Debugging log

      await collegeData.deleteCourseById(id);
      console.log("Course deleted successfully!");

      res.redirect("/courses");
  } catch (err) {
      console.error("Error deleting course:", err);
      res.status(500).json({ error: `Failed to delete course: ${err.message}` });
  }
});

// Error Handling Middleware
app.use((req, res) => {
  res.status(404).json({ error: "Page Not Found" });
});

// Server Initialization
collegeData
  .initialize()
  .then(() => {
    console.log("Database initialized successfully!");
    app.listen(HTTP_PORT, () => console.log(`Server listening on port ${HTTP_PORT}`));
  })
  .catch((err) => {
    console.log("Failed to initialize data collection: " + err);
  });