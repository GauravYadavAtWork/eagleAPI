import express from "express";
import mongoose from "mongoose";
import dotenv from 'dotenv';
import bodyParser from "body-parser";

const router=express.Router();

dotenv.config();
router.use(bodyParser.urlencoded({ extended: true }));
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

// mongoose.connect(`mongodb+srv://${process.env.DATABASEID}:${process.env.DATABASEPASSWORD}@cluster0.o0hdixo.mongodb.net/hehe`, { useNewUrlParser: true, useUnifiedTopology: true, });
// mongoose.connection.on('connected', () => {
//     console.log('Connected to the database');
// });
const secondDbUri = `mongodb+srv://${process.env.DATABASEID}:${process.env.DATABASEPASSWORD}@cluster0.o0hdixo.mongodb.net/hehe`;
const secondDbConnection = mongoose.createConnection(secondDbUri, { useNewUrlParser: true, useUnifiedTopology: true });

secondDbConnection.on('connected', () => {
    console.log('Connected to the student database');
});

const studentschema = new mongoose.Schema({
    _id: Number,
    Status: String,
    Name: String,
    FatherName: String,
    Branch: String,
    FirstName: String,
    LastName: String
});
const student = secondDbConnection.model("student", studentschema);

//handling get reqest for custom search
router.get('/:key/:value', (req, res) => {
    const findParameter = req.params.key;
    const findValue = req.params.value;

    student.find({ [findParameter]: findValue }) // Assuming "_id" is used as the primary key
        .then(foundStudent => {
            if (foundStudent.length === 0) {
                return res.status(404).json({ message: 'Student not found' });
            }
            res.json(foundStudent);
        })
        .catch(error => {
            console.error('Error finding student:', error);
            res.status(500).json({ message: 'Internal server error' });
        });
});

//using query key value pairs at routes
router.get('/', (req, res) => {
    const findParameter = req.query.key;
    const findValue = req.query.value;

    student.find({ [findParameter]: findValue }) // key contains the query parameter and value contains query value
        .then(foundStudent => {
            if (foundStudent.length === 0) {
                return res.status(404).json({ message: 'Student not found' });
            }
            res.json(foundStudent);
        })
        .catch(error => {
            console.error('Error finding student:', error);
            res.status(500).json({ message: 'Internal server error' });
        });
});


//handling post request for adding new students
router.post('/add-student', (req, res) => {
    // Extracting student data from the request body
    const newStudentData = req.body;
    console.log(req.body);

    // Creating a new student record
    const newStudent = new student(newStudentData);

    // Saveing the new student to the database using save() method
    newStudent.save()
        .then(savedStudent => {
            console.log(`Id ${newStudentData._id} Added successfully`);
            res.status(201).json({ message: 'Student details added to the database', savedStudent }); // Sending back the details of the newly created student with a message
        })
        .catch(error => {
            console.error('Error adding student:', error);
            res.status(500).json({ message: 'Internal server error', err: error }); //sending error message
        });
});
//added _id : 101,102,103


//handling delete requests for deleting existing students 
router.delete('/delete/:id', (req, res) => {
    const deleteStudentId = req.params.id;
    //finding the database and deleting the found details with the perticular id
    student.deleteOne({ _id: deleteStudentId })
        .then(result => {
            if (result.deletedCount === 1) { //if deleted count==1 this means it is deleted
                console.log(`Id ${deleteStudentId} deleted successfully`);
                res.status(200).json({ message: 'Student record deleted successfully' });//sending confirmation message
            } else {
                res.status(404).json({ message: 'Student record not found' });//sending confirmation message if student is not found
            }
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ message: 'Internal Server Error', error: err });
        });
});

export default router;
