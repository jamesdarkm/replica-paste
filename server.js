import express from 'express';
import Mailjet from 'node-mailjet';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import tinify from "tinify";
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { initializeApp, cert } from 'firebase-admin/app';
import { getStorage, getDownloadURL } from 'firebase-admin/storage';
import serviceAccount from './serviceAccount.json' assert { type: 'json' };

initializeApp({
  credential: cert(serviceAccount),
  storageBucket: 'gs://replica-paste.appspot.com',
});

const bucket = getStorage().bucket();

dotenv.config();

const app = express();
const PORT = 5000;

tinify.key = process.env.VITE_TINYPNG_APIKEY;

// Set up storage configuration for diskStorage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Ensure unique filenames
  }
});

const upload = multer({ storage });

app.use(cors());
app.use(bodyParser.json());

app.post('/send-email', (req, res) => {
    const mailjet = Mailjet.apiConnect(process.env.VITE_MJ_APIKEY_PUBLIC, process.env.VITE_MJ_APIKEY_PRIVATE);

    const request = mailjet
        .post("send", { 'version': 'v3.1' })
        .request({
            Messages: [
                {
                  From: {
                    Email: 'no-reply@darkm.co.za',
                    Name: 'Paste Replica',
                  },
                  To: [
                    {
                        "Email": req.body.email,
                        "Name": "Paste Replica"
                    }
                  ],
                  TemplateID: 6147342,
                  TemplateLanguage: true
                },
              ],
            });
    request
        .then((result) => {
            res.status(200).json(result.body);
        })
        .catch((err) => {
            res.status(500).json({ error: err.message });
        });
});

app.post('/subscribe-newsletter', (req, res) => {
  const mailjet = Mailjet.apiConnect(process.env.VITE_MJ_APIKEY_PUBLIC, process.env.VITE_MJ_APIKEY_PRIVATE);

  const request = mailjet
      .post("send", { 'version': 'v3.1' })
      .request({
          Messages: [
              {
                From: {
                  Email: 'no-reply@darkm.co.za',
                  Name: 'Paste Replica',
                },
                To: [
                  {
                      "Email": req.body.email,
                      "Name": "Paste Replica"
                  }
                ],
                TemplateID: 6174204,
                TemplateLanguage: true
              },
            ],
          });
  request
      .then((result) => {
          res.status(200).json(result.body);
      })
      .catch((err) => {
          res.status(500).json({ error: err.message });
      });
});


app.post('/optimize-image', upload.single('image'), async (req, res) => {
  try {
    const filePath = req.file.path; // Path to the uploaded file
    const optimizedFilePath = path.join('uploads', `optimized-${req.file.filename}`);

    // Optimize image using TinyPNG
    tinify.fromFile(filePath).toFile(optimizedFilePath, async (err) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      // Optionally, delete the original file after processing
      fs.unlinkSync(filePath);

      const optimizedFileFirebaseName = optimizedFilePath.replace('uploads\\', '');

      const uploadFile = await bucket.upload(optimizedFilePath, { destination: `avatars/${optimizedFileFirebaseName}` });
      
      
      res.status(200).json({firebaseImage: optimizedFileFirebaseName})
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});