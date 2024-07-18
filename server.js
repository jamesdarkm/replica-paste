import express from 'express';
import Mailjet from 'node-mailjet';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 5000;

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

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
