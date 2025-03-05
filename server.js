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
import dns from 'dns';

import { db } from './firebase.js';
import { addDoc, doc, updateDoc, collection } from 'firebase/firestore';


initializeApp({
  credential: cert(serviceAccount),
  storageBucket: 'gs://replica-paste.appspot.com',
});

const app = express();
const PORT = 5000;
const dnsPromises = dns.promises;

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
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json()); // Check which version this should be defined on (test on v18.20.4 and 20.* not working)
app.use(express.urlencoded({ extended: true })); // Check which version this should be defined on (test on v18.20.4 and 20.* not working)

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


      res.status(200).json({ firebaseImage: optimizedFileFirebaseName })
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
  const formData = req.body;
  // const passPhrase = formData.passPhrase;
  const passPhrase = process.env.VITE_PASSPHRASE;
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
  // console.log(pfOutput)

  // Generate the MD5 signature
  const signature = crypto.createHash('md5').update(pfOutput).digest('hex');
  console.log(`SIGN:${signature}   ---*****`)
  // Return the signature as a response
  res.status(200).send({ signature });
})

// Notify URL endpoint
const notify = multer();

app.post('/notify', notify.none(), async (req, res) => {
  const testingMode = true;
  const pfHost = testingMode ? "sandbox.payfast.co.za" : "www.payfast.co.za";
  const pfData = JSON.parse(JSON.stringify(req.body));

  console.log('ITN')
  let pfParamString = "";
  for (let key in pfData) {
    if (pfData.hasOwnProperty(key) && key !== "signature") {
      pfParamString += `${key}=${encodeURIComponent(pfData[key].trim()).replace(/%20/g, "+")}&`;
    }
  }

  // Remove last ampersand
  pfParamString = pfParamString.slice(0, -1);


  const pfValidSignature = (pfData, pfParamString, pfPassphrase = null) => {
    // Calculate security signature
    let tempParamString = '';
    if (pfPassphrase !== null) {
      pfParamString += `&passphrase=${encodeURIComponent(pfPassphrase.trim()).replace(/%20/g, "+")}`;
    }

    const signature = crypto.createHash("md5").update(pfParamString).digest("hex");
    return pfData['signature'] === signature;
  };

  async function ipLookup(domain) {
    return new Promise((resolve, reject) => {
      dns.lookup(domain, { all: true }, (err, address, family) => {
        if (err) {
          reject(err)
        } else {
          const addressIps = address.map(function (item) {
            return item.address;
          });
          resolve(addressIps);
        }
      });
    });
  }

  const pfValidIP = async (req) => {
    const validHosts = [
      'www.payfast.co.za',
      'sandbox.payfast.co.za',
      'w1w.payfast.co.za',
      'w2w.payfast.co.za'
    ];

    let validIps = [];
    const pfIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    try {
      for (let key in validHosts) {
        const ips = await ipLookup(validHosts[key]);
        validIps = [...validIps, ...ips];
      }
    } catch (err) {
      console.error(err);
    }

    const uniqueIps = [...new Set(validIps)];

    if (uniqueIps.includes(pfIp)) {
      return true;
    }
    return false;
  };

  const pfValidPaymentData = (cartTotal, pfData) => {
    return Math.abs(parseFloat(cartTotal) - parseFloat(pfData['amount_gross'])) <= 0.01;
  };

  const pfValidServerConfirmation = async (pfHost, pfParamString) => {
    try {
      const response = await fetch(`https://${pfHost}/eng/query/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pfParamString),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      return data === 'VALID';
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const check1 = pfValidSignature(pfData, pfParamString, 'jt7NOE43FZPn');
  const check2 = await pfValidIP(req);
  const check3 = pfValidPaymentData(pfData['amount_gross'], pfData);
  const check4 = await pfValidServerConfirmation(pfHost, pfParamString);

  let checks = [check1, check2, check3, check4];
  let status = 'investigate';
  if (check1 && check2 && check3 && check4) {
    checks = ['true', 'true', 'true', 'true'];
    status = 'complete';
  }

  try {
    const userDocRef = doc(db, 'users', pfData['custom_str1']);
    await updateDoc(userDocRef, {
      plan: 'PRO'
    });

    console.log('Document successfully updated!');
  } catch (error) {
    console.error('Error updating document:', error);
  }

  try {
    const transactionData = {
      status: status,
      checks: checks,
      ownerId: pfData['custom_str1'],
      ...req.body
    };

    docRef = await addDoc(collection(db, "transactions"), transactionData);


  } catch (error) {
    // Log error
  }
});

// generate signature
app.get('/signature-generation', (req, res) => {

  console.log('received')

// PayFast data
let data = {
  "merchant_id": "10000100",
  "merchant_key": "46f0cd694581a",
  "return_url": "https://3aad-41-216-202-52.ngrok-free.app/return",
  "notify_url": "https://3aad-41-216-202-52.ngrok-free.app/notify",
  "cancel_url": "https://3aad-41-216-202-52.ngrok-free.app/cancel",
  // "m_payment_id": "162923",
  "amount": "1450.00",
  "item_name": "Social Paste"
};

// Passphrase used for salting the signature (set in PayFast settings)
let passPhrase = 'jt7NOE43FZPn ';

  // Signature generation function
  const generateAPISignature = (data, passPhrase) => {
    // Arrange the array by key alphabetically for API calls
    let ordered_data = {};
    Object.keys(data).sort().forEach(key => {
      ordered_data[key] = data[key];
    });
    data = ordered_data;
    // console.log('DATA', data)

    // Create the get string
    let getString = '';
    for (let key in data) {
      getString += key + '=' + encodeURIComponent(data[key]).replace(/%20/g, '+') + '&';
    }

    // Remove the last '&'
    getString = getString.substring(0, getString.length - 1);
    if (passPhrase !== null) {getString +=`&passphrase=${encodeURIComponent(passPhrase.trim()).replace(/%20/g, "+")}`;}
    console.log('STRING', getString)

    // Hash the data and create the signature
    return crypto.createHash("md5").update(getString).digest("hex");
  }

  // Generate the signature for the API request
  const signature = generateAPISignature(data, passPhrase);

  // Output the generated signature
  console.log('Generated Signature:', signature);
  res.send(signature)

})

app.get("/", (req, res) => {
  res.send("Hello from Vercel!");
});

app.post('/cancel-plan', async (req, res) => {
  const passPhrase = process.env.VITE_PASSPHRASE;
  const merchantId = process.env.VITE_MERCHANT_ID;

  const formData = req.body;
  const uid = formData.uid;
  const subscriptionToken = formData.subscriptionToken;
  // console.log('formdata:' + JSON.stringify(formData));

  let dateNow = new Date();
  dateNow = dateNow.toISOString().slice(0, 19);



  // Generate the MD5 signature
  const timestamp = `&timestamp=${encodeURIComponent(dateNow).replace(/%20/g, '+')}`;
  const sig = 'merchant-id=' + merchantId + '&passphrase=' + passPhrase + timestamp + '&version=v1';
  const signature = crypto.createHash('md5').update(sig).digest('hex');

  // Send request /ping
  // const response = await fetch(`https://api.payfast.co.za/ping?testing=true`, {
  //   method: 'GET',
  //   headers: {
  //     'merchant-id': merchantId,
  //     'version': 'v1',
  //     'timestamp': dateNow,
  //     'signature': signature,
  //   },
  //   redirect: 'follow'
  // });

  // if (!response.ok) {
  //   throw new Error('Network response was not ok');
  // }

  // const result = await response.text();
  // console.log('REX' + result)



  try {
    const response = await fetch(`https://api.payfast.co.za/subscriptions/${subscriptionToken}/cancel?testing=true`, {
      method: 'PUT',
      headers: {
        'merchant-id': merchantId,
        'version': 'v1',
        'timestamp': dateNow,
        'signature': signature,
      },
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const userDocRef = doc(db, 'users', uid);
    await updateDoc(userDocRef, {
      plan: 'FREE',
      planStatus: 'CANCELLED'
    });

    res.status(200).send({ success: 'ok' });
  } catch (error) {
    console.error(error);
    return false;
  }
});


app.post('/pause-plan', async (req, res) => {
  const passPhrase = process.env.VITE_PASSPHRASE;
  const merchantId = process.env.VITE_MERCHANT_ID;

  const formData = req.body;
  const uid = formData.uid;
  const subscriptionToken = formData.subscriptionToken;
  const planStatus = formData.planStatus;
  // console.log('formdata:' + JSON.stringify(formData));

  let dateNow = new Date();
  dateNow = dateNow.toISOString().slice(0, 19);



  // Generate the MD5 signature
  const timestamp = `&timestamp=${encodeURIComponent(dateNow).replace(/%20/g, '+')}`;
  const sig = 'merchant-id=' + merchantId + '&passphrase=' + passPhrase + timestamp + '&version=v1';
  const signature = crypto.createHash('md5').update(sig).digest('hex');


  let planEndpoint = `https://api.payfast.co.za/subscriptions/${subscriptionToken}/pause?testing=true`;
  let planStatusDB = 'PAUSED';
  if (planStatus == 'PAUSED') {
    planStatusDB = 'ACTIVE';
    planEndpoint = `https://api.payfast.co.za/subscriptions/${subscriptionToken}/unpause?testing=true`;
  }
console.log(planStatus)
  console.log(planEndpoint)
  try {
    const response = await fetch(planEndpoint, {
      method: 'PUT',
      headers: {
        'merchant-id': merchantId,
        'version': 'v1',
        'timestamp': dateNow,
        'signature': signature,
      },
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const userDocRef = doc(db, 'users', uid);
    await updateDoc(userDocRef, {
      plan: 'PRO',
      planStatus: planStatusDB
    });

    res.status(200).send({ success: 'ok', planStatus: planStatusDB });
  } catch (error) {
    console.error(error);
    return false;
  }
});


// app.get('/', (req, res) => {
//   console.log('yass')
//   res.send('yasss')
// })


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
