import { Router } from 'express';
import { registerSp, loginSp } from '../../controllers/Persons/sp.controller';

const router = Router();

// Endpoint : '/sp/'

router.post('/register', registerSp);

/*
Error Codes:
    NOUSER: No user found
    INVPASS: Password Incorrect
    DBERR: Database error
*/
router.post('/login', loginSp);

export default router;