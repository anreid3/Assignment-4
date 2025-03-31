const Sequelize = require('sequelize');
var sequelize = new Sequelize('database', 'user', 'password', {
    host: 'host',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
        ssl: { rejectUnauthorized: false }
    },
    query:{ raw: true }
});

const Student = sequelize.define('Student', {
    studentNum: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    firstName: {
        type: DataTypes.STRING
    },
    lastName: {
        type: DataTypes.STRING
    },
    email: {
        type: DataTypes.STRING
    },
    addressStreet: {
        type: DataTypes.STRING
    },
    addressCity: {
        type: DataTypes.STRING
    },
    addressProvince: {
        type: DataTypes.STRING
    },
    TA: {
        type: DataTypes.BOOLEAN
    },
    status: {
        type: DataTypes.STRING
    }
});

// Define the Course model
const Course = sequelize.define('Course', {
    courseId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    courseCode: {
        type: DataTypes.STRING
    },
    courseDescription: {
        type: DataTypes.STRING
    }
});

// Define the relationship
Course.hasMany(Student, { foreignKey: 'course' });

module.exports = { sequelize, Student, Course };


module.exports.initialize = function () {
    return new Promise(function (resolve, reject) {
        reject();
    });
};

module.exports.getAllStudents = function () {
    return new Promise(function (resolve, reject) {
        reject();
    });
};

module.exports.getCourses = function () {
    return new Promise(function (resolve, reject) {
        reject();
    });
};

module.exports.getStudentByNum = function (num) {
    return new Promise(function (resolve, reject) {
        reject();
    });
};

module.exports.getStudentsByCourse = function (course) {
    return new Promise(function (resolve, reject) {
        reject();
    });
};

module.exports.addStudent = function (studentData) {
    return new Promise(function (resolve, reject) {
        reject();
    });
};

module.exports.updateStudent = function (updatedStudentData) {
    return new Promise(function (resolve, reject) {
        reject();
    });
};

module.exports.getCourseById = function (id) {
    return new Promise(function (resolve, reject) {
        reject();
    });
};