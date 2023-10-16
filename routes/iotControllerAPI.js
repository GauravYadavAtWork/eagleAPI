import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();
router.use(bodyParser.urlencoded({ extended: true }));
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

// mongoose.connect(`mongodb+srv://${process.env.DATABASEID}:${process.env.DATABASEPASSWORD}@cluster0.o0hdixo.mongodb.net/iotDevicesDB`, { useNewUrlParser: true, useUnifiedTopology: true, });
// mongoose.connection.on('connected', () => {
//     console.log('Connected to the iotDevicesDB');
// });
const iotDbUri = `mongodb+srv://${process.env.DATABASEID}:${process.env.DATABASEPASSWORD}@cluster0.o0hdixo.mongodb.net/iotDevicesDB`;
const iotDbConnection = mongoose.createConnection(iotDbUri, { useNewUrlParser: true, useUnifiedTopology: true });

iotDbConnection.on('connected', () => {
    console.log('Connected to the iotDevicesDB');
});


//schema for the database
const iotDeviceSchema = new mongoose.Schema({
    _id: Number,
    button1_state:String,
    button2_state:String,
    button3_state:String,
    button4_state:String,
    button5_state:String,
    button6_state:String
});
const Device = iotDbConnection.model("Device", iotDeviceSchema);

//handling get request
router.get('/', (req, res) => {
    if (!req.query.key || !req.query.value) {
        return res.status(400).json({ message: 'Bad Request: Missing query parameters' });
    }
    const findParameter = req.query.key;
    const findValue = req.query.value;

    Device.find({ [findParameter]: findValue }) // key contains the query parameter and value contains query value
        .then(foundDevice => {
            if (foundDevice.length === 0) {
                return res.status(404).json({ message: 'Device Not Found' });
            }
            res.json(foundDevice);
        })
        .catch(error => {
            console.error('Error finding Device:', error);
            res.status(500).json({ message: 'Internal server error' });
        });
});

//handling post requests
router.post('/:id', (req, res) => {
    // Extracting Device data from the request body
    const deviceId=req.params.id;
    // console.log(req.body);
        Device.updateOne({_id:deviceId},{
            button1_state:req.body.button1_state,
            button2_state:req.body.button2_state,
            button3_state:req.body.button3_state,
            button4_state:req.body.button4_state,
            button5_state:req.body.button5_state,
            button6_state:req.body.button6_state,
        })
        .then(updatedStatus => {
            console.log("Device Status Updated");
            res.status(201).json({ message: 'Device Info Updated', updatedStatus }); // Sending back the details of the updated device status
        })
        .catch(error => {
            console.error('Error Updating Status:', error);
            res.status(500).json({ message: 'Internal server error', err: error }); //sending error message
        });
});



export default router;
