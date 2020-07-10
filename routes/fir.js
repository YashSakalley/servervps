const express = require('express'),
    router = express.Router(),
    Fir = require('../models/Fir'),
    pdf = require('html-pdf');

const pdfTemplate = require('../document/index')

// Endpoint : '/firs/'

// Create FIR
router.post('/', (req, res) => {
    const { sender, reciever, info, report_id } = req.body
    const signature = {
        sender_sign: 'sample_sender.png',
        reciever_sign: 'sample_reciever.png'
    }
    pdf.create(pdfTemplate(sender, reciever, info, signature), {}).toFile(`document/saved/${report_id}.pdf`, (err) => {
        if (err) {
            console.log(err);
            res.send(Promise.reject());
            return
        }
        console.log('PDF generated');
        res.send({ status: 'success' });
    })
})

// READ
router.get('/', (req, res) => {
    Fir.find({})
        .then((firs) => {
            res.send({ status: 'success', firs: firs });
        })
        .catch((error) => {
            res.send({ status: 'error', msg: error });
        });
});

router.get('/:id', (req, res) => {
    Fir.findById(req.params.id)
        .then((fir) => {
            res.send({ status: 'success', fir: fir });
        })
        .catch((error) => {
            res.send({ status: 'error', msg: error });
        });
});

router.get('/user/:userId', (req, res) => {
    let userId = req.params.userId;
    if (!userId) {
        res.render({ status: 'error', msg: 'UserId not given' });
        return;
    }
    User.findById(userId)
        .then((user) => {
            firs = user.firs;
            var promises = firs.map(async (fir) => {
                const results = await fir.findById(fir)
                    .then((fir) => {
                        return fir;
                    })
                    .catch((error) => {
                        console.log(error);
                        res.send({ status: 'error', msg: error });
                    });
                return results;
            });
            Promise.all(promises).then(function (results) {
                console.log('results', results);
                res.send({ status: 'success', firs: results });
            });
        })
        .catch((error) => {
            console.log(error);
            res.send({ status: 'error', msg: error });
        });
});

router.get('/status/:status', (req, res) => {
    Fir.find({ status: req.params.status })
        .then((firs) => {
            res.send({ status: 'success', firs: firs });
        })
        .catch((error) => {
            res.send({ status: 'error', msg: error });
        });
});

// UPDATE
router.put('/:id', (req, res) => {
    res.send('Updated for id', req.params.id);
});

// DELETE
router.delete('/:id', (req, res) => {
    res.send('Deleted for id', req.params.id);
});
module.exports = router;