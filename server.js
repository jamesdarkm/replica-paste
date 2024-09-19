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
import { getStorage } from 'firebase-admin/storage';
import serviceAccount from './serviceAccount.json' assert { type: 'json' };
import crypto from 'crypto';

initializeApp({
  credential: cert(serviceAccount),
  storageBucket: 'gs://replica-paste.appspot.com',
});

const app = express();
const PORT = 5000;

const bucket = getStorage().bucket();
// var db = admin.database();

dotenv.config();

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
                    Name: 'SocialPaste',
                  },
                  To: [
                    {
                        "Email": req.body.email,
                        "Name": "SocialPaste"
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
                  Name: 'SocialPaste',
                },
                To: [
                  {
                      "Email": req.body.email,
                      "Name": "SocialPaste"
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

//sending invite to a potential team member
app.post('/send-invite', (req, res) => {
  const { email, token, teamId } = req.body;
  console.log(email, token, teamId)

  const mailjet = Mailjet.apiConnect(process.env.VITE_MJ_APIKEY_PUBLIC, process.env.VITE_MJ_APIKEY_PRIVATE);
  const inviteLink = `http://localhost:5173/invite?token=${token}&team=${teamId}`;

  const request = mailjet
      .post("send", { 'version': 'v3.1' })
      .request({
          Messages: [
              {
                From: {
                  Email: 'no-reply@darkm.co.za',
                  Name: 'SocialPaste',
                },
                To: [
                  {
                      "Email": email,
                      "Name": "SocialPaste Member"
                  }
                ],
                Subject: "Team Invitation",
                TextPart: "Dear user, you have been invited to a team on SocialPaste. Click the link below to accept the invite.",
                HTMLPart: `<a href=${inviteLink}>Accept Invite</a>`,
                // TemplateID: 6147342,
                // TemplateLanguage: true
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

app.post('/checkout', (req, res) => {
  console.log(req.body)
  const formData = req.body;
  const passPhrase = formData.passPhrase;

  // Create parameter string
  let pfOutput = '';
  for (const key in formData) {
    if (formData.hasOwnProperty(key)) {
      if (formData[key] !== '') {
        pfOutput += `${key}=${encodeURIComponent(formData[key].trim()).replace(/%20/g, '+')}&`;
      }
    }
  }

  // Remove the last ampersand
  pfOutput = pfOutput.slice(0, -1);

  // Add the passphrase
  pfOutput += `&passphrase=${encodeURIComponent(passPhrase.trim()).replace(/%20/g, '+')}`;
  console.log(pfOutput)

  // Generate the MD5 signature
  const signature = crypto.createHash('md5').update(pfOutput).digest('hex');
  console.log(signature)
  // Return the signature as a response
  res.status(200).send({ signature });
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});