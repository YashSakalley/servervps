var express = require('express'),
    router = express.Router(),
    FIR = require('../models/Fir'),
    User = require('../models/User');

// Endpoint : '/firs/'


// CREATE
router.post('/', (req, res) => {
    var firBody = new FIR({
        crime: req.body.crime,
        answers: req.body.answers,
        questions: req.body.questions,
        user_id: req.body.user_id,
        media_files: req.body.media_files,
        signature: req.body.signature,
        status: 'Pending'
    });

    firBody.save()
        .then((fir) => {
            User.findById(firBody.user_id, (err, user) => {
                user.firs.push(fir._id);
                user.save();
                res.send({ status: 'success', fir: firBody });
            });
        })
        .catch((err) => {
            console.log('Error saving FIR');
            res.send({ status: 'error', msg: 'err' });
        });

});

// READ
router.get('/', (req, res) => {
    FIR.find({})
        .then((firs) => {
            res.send({ status: 'success', firs: firs });
        })
        .catch((error) => {
            res.send({ status: 'error', msg: error });
        });
});

router.get('/:id', (req, res) => {
    FIR.findById(req.params.id)
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
                const results = await FIR.findById(fir)
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
    FIR.find({ status: req.params.status })
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