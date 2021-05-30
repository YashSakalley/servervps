import { Router } from 'express';
import { registerLegal, loginLegal } from '../../controllers/Persons/legal.controller';

const router = Router();

// Endpoint : '/legal/'

router.post('/register', registerLegal);

/*
Error Codes:
    NOUSER: No user found
    INVPASS: Password Incorrect
    DBERR: Database error
*/
router.post('/login', loginLegal);

export default router;