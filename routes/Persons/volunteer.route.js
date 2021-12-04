import { Router } from 'express';
import { createFacilitatorRequest, getFacilitatorRequestById, getFacilitatorRequests, loginVolunteer, registerVolunteer, updateFacilitatorRequestById } from '../../controllers/Persons/volunteer.controller';
const router = Router();

// Endpoint : '/volunteer/'

/* REQUEST */

// CREATE
router.post('/register', registerVolunteer);
router.post('/request/create', createFacilitatorRequest)

// READ
router.get('/request', getFacilitatorRequests)

router.get('/request/:id', getFacilitatorRequestById)

// UPDATE
router.put('/request/:id',updateFacilitatorRequestById)

/*
Error Codes:
    NOUSER: No user found
    INVPASS: Password Incorrect
    DBERR: Database error
*/
router.post('/login', loginVolunteer);

export default router;