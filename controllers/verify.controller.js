import twilio from 'twilio';
import Aadhaar from '../models/Aadhaar';

const { TWILLIO_ACCOUNT_SID, AUTH_TOKEN, TWILLIO_SERVICE_ID } = process.env
const client = twilio(TWILLIO_ACCOUNT_SID, AUTH_TOKEN);

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
            .services(TWILLIO_SERVICE_ID)
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
            .services(TWILLIO_SERVICE_ID)
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