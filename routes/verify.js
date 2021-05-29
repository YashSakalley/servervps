import express from 'express';
import twilio from 'twilio';
import Aadhaar from '../models/Aadhaar';
import config from '../config/otp_config';

const client = twilio(config.accountSID, config.authToken);

const router = express.Router();
// Endpoint : '/verify/'

// Sends an OTP
router.post('/', async (req, res) => {
    const { uid } = req.body
    const user = await Aadhaar.findOne({ uid })
    if (!user || user.length == 0) {
        res.send('No user with given aadhaar found');
    } else {
        const { phone } = user;
        client
            .verify
            .services(config.serviceID)
            .verifications
            .create({
                to: '+91' + phone,
                channel: 'sms'
            })
            .then((data) => {
                console.log('OTP sent');
                res.json({ status: 'success', phone: phone });
            })
            .catch((error) => {
                console.log(error);
                res.json({ status: 'error', error: error });
            });
    }
});

// Verifies the recieved OTP
router.post('/otp', async (req, res) => {
    try {
        const { phone, otp } = req.body;
        console.log(phone, otp);
        client
            .verify
            .services(config.serviceID)
            .verificationChecks
            .create({
                to: '+91' + phone,
                code: otp
            })
            .then((value) => {
                if (value.valid == true) {
                    console.log('Valid OTP');
                    res.json({ status: 'success' });
                } else {
                    console.log('Invalid OTP');
                    res.json({ status: 'error' });
                }
            })
            .catch((error) => {
                console.log(error);
                res.send(error);
            });
    } catch (error) {
        res.send({ status: 'error', msg: error || 'Error occurred' });   
    }
});

export default router