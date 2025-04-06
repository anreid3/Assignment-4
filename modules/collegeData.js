const { Sequelize, DataTypes } = require('sequelize');
const pg = require("pg");
const sequelize = new Sequelize("neondb", "neondb_owner", "npg_Lmup4hKD1gsX", {
    host: "ep-spring-surf-a5kdouz0-pooler.us-east-2.aws.neon.tech",
    dialect: "postgres",
    port: 5432,
    dialectModule: pg,
    dialectOptions: {
        ssl: { rejectUnauthorized: false },
    },
    query: { raw: true },
});

// Define the Student model
const Student = sequelize.define("Student", {
    studentNum: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true }, // Ensure this column exists
    firstName: { type: Sequelize.STRING, allowNull: false },
    lastName: { type: Sequelize.STRING, allowNull: false },
    email: { type: Sequelize.STRING, allowNull: false, validate: { isEmail: true } },
    TA: { type: Sequelize.BOOLEAN },
    status: { type: Sequelize.STRING },
    course: { type: Sequelize.INTEGER }
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

module.exports.getStudentByNum = async (studentNum) => {
    try {
        const student = await Student.findOne({ where: { studentNum } });
        console.log("Student retrieved:", student); // Debugging log
        return student;
    } catch (error) {
        console.error("Error finding student:", error);
        throw new Error(`Database lookup failed: ${error.message}`);
    }
};

module.exports.addStudent = async (studentData) => {
    try {
      console.log("Processing student data:", studentData);
  
      // Ensure TA is explicitly set
      studentData.TA = studentData.TA === "true";
  
      // Convert empty strings to null
      for (const key in studentData) {
        if (studentData[key] === "") studentData[key] = null;
      }
  
      // Check required fields before saving
      if (!studentData.firstName || !studentData.lastName || !studentData.email) {
        throw new Error("Missing required student fields.");
      }
  
      await Student.create(studentData);
      console.log("Student successfully added!");
    } catch (error) {
      console.error("Error adding student:", error);
      throw new Error(`Unable to create student: ${error.message}`);
    }
  };

module.exports.updateStudent = async (studentData) => {
    try {
        studentData.TA = !!studentData.TA; // Ensures TA is a boolean.
        for (const key in studentData) {
            if (studentData[key] === "") studentData[key] = null;
        }
        studentData.studentNum = parseInt(studentData.studentNum, 10); // Ensure proper integer conversion.
        
        await Student.update(studentData, { where: { studentNum: studentData.studentNum } });
    } catch (error) {
        console.error("Error updating student:", error);
        throw new Error("Unable to update student");
    }
};

module.exports.deleteStudent = async (studentNum) => {
    try {
        const result = await Student.destroy({ where: { studentNum } });
        console.log("Delete result:", result); // Debugging log
        return result;
    } catch (error) {
        console.error("Error deleting student:", error);
        throw new Error(`Database delete failed: ${error.message}`);
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
        const course = await Course.findOne({ where: { courseId: id } });
        return course || null;
    } catch (error) {
        console.error("Error retrieving course:", error);
        throw new Error("Course not found");
    }
};

module.exports.addCourse = async (courseData) => {
    try {
        for (const key in courseData) {
            if (courseData[key] === "") courseData[key] = null;
        }
        await Course.create(courseData);
    } catch (error) {
        console.error("Error adding course:", error);
        throw new Error("Unable to create course");
    }
};

module.exports.updateCourse = async (courseData) => {
    try {
        for (const key in courseData) {
            if (courseData[key] === "") courseData[key] = null;
        }
        courseData.courseId = parseInt(courseData.courseId, 10); // Ensure courseId is properly parsed.
        
        await Course.update(courseData, { where: { courseId: courseData.courseId } });
    } catch (error) {
        console.error("Error updating course:", error);
        throw new Error("Unable to update course");
    }
};

module.exports.deleteCourseById = async (id) => {
    try {
        id = parseInt(id, 10); 
        const result = await Course.destroy({ where: { courseId: id } });
        if (!result) throw new Error("Course not found");
    } catch (error) {
        console.error("Error deleting course:", error);
        throw new Error("Unable to delete course");
    }
};
