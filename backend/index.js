import express from 'express';
import bodyParser from 'body-parser';
import nodemailer from 'nodemailer';
import fs from 'fs';
import dotenv from 'dotenv';
import cors from 'cors';
// import mysql from 'mysql';
dotenv.config();

const app = express();

const corsOptions = {
    origin: process.env.FRONTEND_URL, 
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
};
app.use(cors(corsOptions));
app.use(bodyParser.json());

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE === 'true', 
    auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD,
    },
});

// const pool = mysql.createPool({
//   connectionLimit: 10,
//   host: process.env.HOST,
//   user: process.env.USER,
//   password: process.env.PASSWORD,
//   database: process.env.DB
// });

// pool.on('error', err => {
//   console.error('Database pool error:', err);
// });


function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

app.post('/send-emails', async (req, res) => {
    const { emails, subject, message } = req.body;
    try {
        for (const email of emails) {
            if(isValidEmail(email)){
            const mailOptions = {
                from: process.env.USER_EMAIL,
                to: email,
                subject: subject,
                text: message,
                attachments: [],
            };
            
            const pdfAttachment = fs.readFileSync('./Resume_Riddhesh_2024.pdf');
            mailOptions.attachments.push({
                filename: 'Resume_Riddhesh_2024.pdf',
                content: pdfAttachment,
            });
            await transporter.sendMail(mailOptions);
           }
        }
        res.status(200).send({success:'true'});
    } catch (error) {
        console.error('Error sending emails:', error);
        res.status(500).send('Error sending emails');
    }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
