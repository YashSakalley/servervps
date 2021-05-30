import express from 'express';
import { sendOTP, verifyOTP } from '../controllers/verify.controller';

const router = express.Router();

// Endpoint : '/verify/'

// Sends an OTP
router.post('/', sendOTP);

// Verifies the recieved OTP
router.post('/otp', verifyOTP);

export default router