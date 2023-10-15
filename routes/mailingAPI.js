import express from "express"
import bodyParser from "body-parser"
import nodemailer from "nodemailer";
import dotenv from 'dotenv';
dotenv.config();

const router=express.Router();
router.use(bodyParser.urlencoded({ extended: true }));

// Nodemailer configuration
const transporter = nodemailer.createTransport({
    service: 'Gmail', // ('Gmail', 'Yahoo', etc.)
    auth: {
        user: process.env.EMAILID,
        pass: process.env.PASSWORD,
    },
});

router.post('/', (req, res) => {
    const email = req.body.email;
    const customMessage = req.body.customMessage;

    // Send the verification email
    const mailOptions = {
        from: process.env.EMAILID,
        to: email,
        subject: 'Welcome to EagleAPIs - Email Services',
        text:`This is a Api test . This is the custom message ${customMessage}`,
    };

    // Send the email with the customized content
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
            res.status(500).json({message:"Error Sending Mail"});

        } else {
            res.status(200).json({message:"Email Sent Succesfully"});
        }
    });
});


export default router;