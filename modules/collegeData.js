const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('neondb', 'neondb_owner', 'npg_Lmup4hKD1gsX', {
    host: 'ep-spring-surf-a5kdouz0-pooler.us-east-2.aws.neon.tech',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
        ssl: { rejectUnauthorized: false },
    },
    query: { raw: true },
});

// Define the Student model
const Student = sequelize.define('Student', {
    studentNum: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    firstName: { type: DataTypes.STRING },
    lastName: { type: DataTypes.STRING },
    email: { type: DataTypes.STRING },
    addressStreet: { type: DataTypes.STRING },
    addressCity: { type: DataTypes.STRING },
    addressProvince: { type: DataTypes.STRING },
    TA: { type: DataTypes.BOOLEAN },
    status: { type: DataTypes.STRING },
});

// Define the Course model
const Course = sequelize.define('Course', {
    courseId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    courseCode: { type: DataTypes.STRING },
    courseDescription: { type: DataTypes.STRING },
});

// Define the relationship
Course.hasMany(Student, { foreignKey: 'course' });

module.exports.initialize = function () {
    return new Promise((resolve, reject) => {
        sequelize.sync()
            .then(() => resolve())
            .catch(() => reject("unable to sync the database"));
    });
};

module.exports.getAllStudents = function () {
    return new Promise((resolve, reject) => {
        Student.findAll()
            .then(data => resolve(data))
            .catch(() => reject("no results returned"));
    });
};

module.exports.getStudentsByCourse = function (course) {
    return new Promise((resolve, reject) => {
        Student.findAll({ where: { course: course } })
            .then(data => resolve(data))
            .catch(() => reject("no results returned"));
    });
};

module.exports.getStudentByNum = function (num) {
    return new Promise((resolve, reject) => {
        Student.findAll({ where: { studentNum: num } })
            .then(data => resolve(data[0]))
            .catch(() => reject("no results returned"));
    });
};

module.exports.getCourses = function () {
    return new Promise((resolve, reject) => {
        Course.findAll()
            .then(data => resolve(data))
            .catch(() => reject("no results returned"));
    });
};

module.exports.getCourseById = function (id) {
    return new Promise((resolve, reject) => {
        Course.findAll({ where: { courseId: id } })
            .then(data => resolve(data[0]))
            .catch(() => reject("no results returned"));
    });
};

module.exports.addStudent = function (studentData) {
    return new Promise((resolve, reject) => {
        studentData.TA = studentData.TA ? true : false;

        for (const key in studentData) {
            if (studentData[key] === "") {
                studentData[key] = null;
            }
        }

        Student.create(studentData)
            .then(() => resolve())
            .catch(() => reject("unable to create student"));
    });
};

module.exports.updateStudent = function (studentData) {
    return new Promise((resolve, reject) => {
        studentData.TA = studentData.TA ? true : false;

        for (const key in studentData) {
            if (studentData[key] === "") {
                studentData[key] = null;
            }
        }

        Student.update(studentData, { where: { studentNum: studentData.studentNum } })
            .then(() => resolve())
            .catch(() => reject("unable to update student"));
    });
};