import twilio from 'twilio';
import Aadhaar from '../models/Aadhaar';
import config from '../config/otp_config';

const client = twilio(config.accountSID, config.authToken);

export const sendOTP = async (req, res) => {
    try {
        const { uid } = req.body
        const user = await Aadhaar.findOne({ uid })
        if (!user || user.length == 0) {
            res.send('No user with given aadhaar found');
        } else {
            const { phone } = user;
            await client
            .verify
            .services(config.serviceID)
            .verifications
            .create({
                to: '+91' + phone,
                channel: 'sms'
            })
            console.log('OTP sent');
            res.json({ status: 'success', phone });
        }
    } catch (error) {
        res.json({ status: 'error', error: error });
    }
}

export const verifyOTP = async (req, res) => {
    try {
        const { phone, otp } = req.body;
        console.log(phone, otp);
        const value = await client
            .verify
            .services(config.serviceID)
            .verificationChecks
            .create({
                to: '+91' + phone,
                code: otp
            })
            if (value.valid === true) {
                console.log('Valid OTP');
                res.send({ status: 'success' });
            } else {
                console.log('Invalid OTP');
                res.send({ status: 'error' });
            }
    } catch (error) {
        res.send({ status: 'error', msg: error || 'Error occurred' });   
    }
}