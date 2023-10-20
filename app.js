import express from "express";
import bodyParser from "body-parser";
import studentDetailsAPI from "./routes/studentDetailsAPI.js";
import mailAPI from "./routes/mailingAPI.js";
import iotController from "./routes/iotControllerAPI.js"
import dotenv from 'dotenv';
import cors from 'cors';
dotenv.config();

const app = express();
const port = 8080;

app.use(bodyParser.urlencoded({ extended: true }));

const corsOptions = {
  origin: 'http://localhost:3000', // Replace with your frontend's URL
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));


//defining the password checker middleware
const checkPassword = (req, res, next) => {
    const expectedPassword = process.env.apiPassword; // Password for requests
    const providedPassword = req.headers.authorization; // The password is sent in the authorization header
    if (!providedPassword || providedPassword !== expectedPassword) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    next();   //if  Password is correct, proceed to the next middleware or route
};
//using middlewares
// app.use('/', checkPassword);
app.use("/student-details",studentDetailsAPI);
app.use("/mail",mailAPI);
app.use("/device",iotController);


//listening for requests
app.listen(process.env.PORT||port, () => {
    console.log(`App listening of port ${port}`);
});

