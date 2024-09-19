// server.js or api.js (Node.js/Express)

import express from 'express';
import Mailjet from 'node-mailjet';
import cors from 'cors';
import dotenv from 'dotenv';
import { authAdmin } from './firebaseAdmin.js'; // Import Firebase Admin SDK auth with .js extension for ES modules

const app = express();
const PORT = 5001;
app.use(express.json());
dotenv.config();
app.use(cors());

// POST route to generate a reset link
app.post('/generate-reset-link', async (req, res) => {
    const { email } = req.body;

    try {
        // Generate the password reset link
        const resetLink = await authAdmin.generatePasswordResetLink(email);

        const mailjet = Mailjet.apiConnect(
            process.env.VITE_MJ_APIKEY_PUBLIC,
            process.env.VITE_MJ_APIKEY_PRIVATE
        );

        const request = mailjet.post('send', { version: 'v3.1' }).request({
            Messages: [
                {
                    From: {
                        Email: 'no-reply@darkm.co.za',
                        Name: 'SocialPaste',
                    },
                    To: [
                        {
                            Email: email
                        },
                    ],
                    TemplateID: 6285005,
                    TemplateLanguage: true,
                    Variables: {
                        resetlink: resetLink,
                    },
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
    } catch (error) {
        console.error('Error generating reset link:', error);
        res.status(500).json({ error: 'Error generating reset link' });
    }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});