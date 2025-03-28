const fs = require("fs");
const path = require("path");

class Data{
    constructor(students, courses){
        this.students = students;
        this.courses = courses;
    }
}

let dataCollection = null;

const coursesPath = path.join(__dirname, "/../data/courses.json");
const studentsPath = path.join(__dirname, "../data/students.json");
console.log(__dirname)

module.exports.initialize = function () {
    return new Promise( (resolve, reject) => {
        fs.readFile(coursesPath,'utf8', (err, courseData) => {
            if (err) {
                reject("unable to load courses"); return;
            }

            fs.readFile(studentsPath,'utf8', (err, studentData) => {
                if (err) {
                    reject("unable to load students"); return;
                }

                dataCollection = new Data(JSON.parse(studentData), JSON.parse(courseData));
                resolve();
            });
        });
    });
}

module.exports.getAllStudents = function(){
    return new Promise((resolve,reject)=>{
        if (dataCollection.students.length == 0) {
            reject("query returned 0 results"); return;
        }

        resolve(dataCollection.students);
    })
}

module.exports.getCourses = function(){
   return new Promise((resolve,reject)=>{
    if (dataCollection.courses.length == 0) {
        reject("query returned 0 results"); return;
    }

    resolve(dataCollection.courses);
   });
};

module.exports.getStudentByNum = function (num) {
    return new Promise(function (resolve, reject) {
        var foundStudent = null;

        for (let i = 0; i < dataCollection.students.length; i++) {
            if (dataCollection.students[i].studentNum == num) {
                foundStudent = dataCollection.students[i];
            }
        }

        if (!foundStudent) {
            reject("query returned 0 results"); return;
        }

        resolve(foundStudent);
    });
};

module.exports.getStudentsByCourse = function (course) {
    return new Promise(function (resolve, reject) {
        var filteredStudents = [];

        for (let i = 0; i < dataCollection.students.length; i++) {
            if (dataCollection.students[i].course == course) {
                filteredStudents.push(dataCollection.students[i]);
            }
        }

        if (filteredStudents.length == 0) {
            reject("query returned 0 results");
            return;
        }

        resolve(filteredStudents);
    });
};
module.exports.addStudent = function (studentData) {
    return new Promise((resolve, reject) => {
       
        studentData.TA = studentData.TA ? true : false;

        studentData.studentNum = dataCollection.students.length + 1;

        dataCollection.students.push(studentData);

        resolve();
    });
};
module.exports.updateStudent = function (updatedStudentData) {
    return new Promise((resolve, reject) => {
        const studentIndex = dataCollection.students.findIndex(student => student.studentNum == updatedStudentData.studentNum);

        if (studentIndex === -1) {
            reject("Student not found");
        } else {
            dataCollection.students[studentIndex] = {
                ...dataCollection.students[studentIndex],
                ...updatedStudentData
            };
            resolve();
        }
    });
};
module.exports.getCourseById = function (id) {
    return new Promise((resolve, reject) => {
        const foundCourse = dataCollection.courses.find(course => course.courseId == id); 

        if (!foundCourse) {
            reject("Query returned 0 results"); 
        } else {
            resolve(foundCourse); 
        }
    });
};