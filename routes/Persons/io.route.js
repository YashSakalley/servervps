import { Router } from 'express';
import { loginIo, registerIo } from '../../controllers/Persons/io.controller';

const router = Router();

// Endpoint : '/io/'

router.post('/register', registerIo);

/*
Error Codes:
    NOUSER: No user found
    INVPASS: Password Incorrect
    DBERR: Database error
*/
router.post('/login', loginIo);

export default router;