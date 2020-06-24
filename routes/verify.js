var express = require('express'),
    router = express.Router(),
    twilio = require('twilio'),
    config = require('../config/otp_config'),
    client = twilio(config.accountSID, config.authToken),
    Aadhaar = require('../models/Aadhaar');

// Endpoint : '/verify/'


// Sends an OTP
router.post('/', (req, res) => {
    var uid = req.body.uid;
    console.log(uid);
    Aadhaar.findOne({ uid: uid }, (err, user) => {
        if (err) {
            res.send(err);
        } else if (!user || user.length == 0) {
            res.send('No user with given aadhaar found');
        } else {
            var phone = user.phone;
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
});

// Verifies the recieved OTP
router.post('/otp', (req, res) => {
    var phone = req.body.phone;
    var otp = req.body.otp;
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
});

module.exports = router;