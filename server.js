
const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
let cors = require("cors");
require('dotenv').config();



const app = express();

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
app.use(bodyParser.json());
app.use(cors());

app.get("/" , async (req,res) => {

    try{
        console.log('Server is running...');
        res.status(200).end("server is running..");
        
    }catch(err){
        res.status(400).send(err);
    }

})

// Configure the nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.USER_ID,
      pass: process.env.USER_PASS,
    }
});

// Define your API endpoint for POST requests
app.post('/send-mail', (req, res) => {
  // Extract the data from the request body

  const recipient = req.body.recipient;
  const subject = req.body.subject;
  const message = req.body.message;


  const mailOptions = {
    from: process.env.USER_ID,
    to: recipient,
    subject: subject,
    text: message,
   
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error sending email:', error);
      res.status(500).json({ error: 'An error occurred while sending the email.' });
    } else {
      console.log('Email sent:', info.response);
      res.json({ message: 'POST request received and email sent', mailOptions });
    }
  });
});

// Start the server
const port = process.env.SERVER_PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});