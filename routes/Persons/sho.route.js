import { Router } from 'express';
import { registerSho, loginSho } from '../../controllers/Persons/sho.controller';

const router = Router();

// Endpoint : '/sho/'

router.post('/register', registerSho);

/*
Error Codes:
    NOUSER: No user found
    INVPASS: Password Incorrect
    DBERR: Database error
*/
router.post('/login', loginSho);

export default router;