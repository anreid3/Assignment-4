const { Sequelize, DataTypes } = require('sequelize');
const pg = require("pg");
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
const Student = sequelize.define("Student", {
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
const Course = sequelize.define("Course", {
    courseId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    courseCode: { type: DataTypes.STRING },
    courseDescription: { type: DataTypes.STRING },
});

// Define the relationship
Course.hasMany(Student, { foreignKey: "course" });
Student.belongsTo(Course, { foreignKey: "course" });



module.exports.initialize = async function () {
    try {
        await sequelize.sync();
        console.log("Database synced successfully!");
    } catch (error) {
        throw new Error("Unable to sync the database");
    }
};

module.exports.getAllStudents = async () => {
    try {
        return await Student.findAll();
    } catch {
        throw new Error("No students found");
    }
};

module.exports.getStudentsByCourse = async (course) => {
    try {
        return await Student.findAll({ where: { course } });
    } catch {
        throw new Error("No students found for this course");
    }
};

module.exports.getStudentByNum = async (num) => {
    try {
        const student = await Student.findOne({ where: { studentNum: num } });
        return student || null;
    } catch {
        throw new Error("Student not found");
    }
};

module.exports.addStudent = async (studentData) => {
    try {
        studentData.TA = studentData.TA ? true : false;
        for (const key in studentData) {
            if (studentData[key] === "") studentData[key] = null;
        }
        await Student.create(studentData);
    } catch {
        throw new Error("Unable to create student");
    }
};

module.exports.updateStudent = async (studentData) => {
    try {
        studentData.TA = studentData.TA ? true : false;
        for (const key in studentData) {
            if (studentData[key] === "") studentData[key] = null;
        }
        await Student.update(studentData, { where: { studentNum: studentData.studentNum } });
    } catch {
        throw new Error("Unable to update student");
    }
};

module.exports.deleteStudentByNum = async (studentNum) => {
    try {
        const result = await Student.destroy({ where: { studentNum } });
        if (!result) throw new Error("Student not found");
    } catch {
        throw new Error("Unable to delete student");
    }
};

// Course functions
module.exports.getCourses = async () => {
    try {
        return await Course.findAll();
    } catch {
        throw new Error("No courses found");
    }
};

module.exports.getCourseById = async (id) => {
    try {
        return await Course.findOne({ where: { courseId: id } });
    } catch {
        throw new Error("Course not found");
    }
};

module.exports.addCourse = async (courseData) => {
    try {
        for (const key in courseData) {
            if (courseData[key] === "") courseData[key] = null;
        }
        await Course.create(courseData);
    } catch {
        throw new Error("Unable to create course");
    }
};

module.exports.updateCourse = async (courseData) => {
    try {
        for (const key in courseData) {
            if (courseData[key] === "") courseData[key] = null;
        }
        await Course.update(courseData, { where: { courseId: courseData.courseId } });
    } catch {
        throw new Error("Unable to update course");
    }
};

module.exports.deleteCourseById = async (id) => {
    try {
        const result = await Course.destroy({ where: { courseId: id } });
        if (!result) throw new Error("Course not found");
    } catch {
        throw new Error("Unable to delete course");
    }
};
