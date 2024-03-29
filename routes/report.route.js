import { Router } from 'express';
import twilio from 'twilio';
import Report from '../models/Report';
import { 
    createReport,
    getAllReports,
    getReportCount,
    getReportById,
    getReportsByUserId,
    getReportsByStatus,
    updateReportWorkById
} from '../controllers/report.controller';

const { TWILLIO_ACCOUNT_SID, AUTH_TOKEN } = process.env
const client = twilio(TWILLIO_ACCOUNT_SID, AUTH_TOKEN);
const router = Router();

// Endpoint : '/reports/'

// CREATE
router.post('/', createReport);

// READ
router.get('/', getAllReports);

router.get('/info/count', getReportCount)

router.get('/:id', getReportById);

router.get('/user/:userId', getReportsByUserId);
    
router.get('/status/:status', getReportsByStatus);

// UPDATE
router.put('/work/:id/:vis', updateReportWorkById)

router.put('/show_work/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const report = await Report.findByIdAndUpdate(id, { is_work_shown: true })
        res.send({ status: 'success', report });
    } catch (error) {
        res.send({ status: 'error', msg: error.msg })
    }
})

router.put('/hide_work/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const report = await Report.findByIdAndUpdate(id, { is_work_shown: false })
        res.send({ status: 'success', report });
    } catch (error) {
        res.send({ status: 'error', msg: error.msg })
    }
})

router.put('/complete/:id', async (req, res) => {
    try {
        const { id } = req.params
        const { body } = req
        const report = await Report.findByIdAndUpdate(id, body)
        res.send({ status: 'success', report });
    } catch (error) {
        res.send({ status: 'error', msg: error || 'Error occurred' });
    }
})

router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params
        const { status, reason } = req.body
        const report = await Report.findByIdAndUpdate(id, { status, reason })
        res.send({ status: 'success', report: report });
        if (req.body.reason) {
            // Send text message for rejected
            // twillio number not working currently
            // client.messages
            // .create({
            //     body: `Your report has been rejected. Report id: ${report._id}, Reason: ${reason}. Please update the report details in order to proceed`,
            //     from: '+13015337570',
            //     to: '+917974961262'
            // })
            // .then(message => {
            //     console.log(message)
            //     console.log(message.sid)
            // })
            // .done((err) => {
            //     if (err)
            //         console.log(err);
            //     else
            //         console.log('SMS SENT FOR REJECTED');
            // });
        }
    } catch (error) {
        res.send({ status: 'error', msg: error });
    }
});

// DELETE
router.delete('/:id', (req, res) => {
    res.send('Deleted for id', req.params.id);
});

export default router;