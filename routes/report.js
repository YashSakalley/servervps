var express = require('express'),
    router = express.Router(),
    Report = require('../models/Report'),
    User = require('../models/User');

// Endpoint : '/reports/'


// CREATE
router.post('/', (req, res) => {
    const { crime, answers, questions, user_id, media_files, signature } = req.body;
    var reportBody = new Report({
        crime,
        answers,
        questions,
        user_id,
        media_files,
        signature,
        status: 'Pending'
    });
    console.log(reportBody);

    reportBody.save()
        .then((report) => {
            User.findById(reportBody.user_id)
                .then((user) => {
                    user.reports.push(report._id);
                    user.save();
                    res.send({ status: 'success', report: reportBody });
                })
                .catch((err) => {
                    res.send({ status: 'error', msg: err })
                })
        })
        .catch((err) => {
            console.log(err);
            res.send({ status: 'error', msg: 'Error saving REPORT' });
        });

});

// READ
router.get('/', (req, res) => {
    Report.find({})
        .then((reports) => {
            res.send({ status: 'success', reports: reports });
        })
        .catch((error) => {
            res.send({ status: 'error', msg: error });
        });
});

router.get('/:id', (req, res) => {
    Report.findById(req.params.id)
        .then((report) => {
            User.findById(report.user_id)
                .then((user) => {
                    res.send({ status: 'success', report: report, user: user });
                })
                .catch((error) => {
                    res.send({ status: 'error', msg: error });
                })
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
            reports = user.reports;
            var promises = reports.map(async (report) => {
                const results = await report.findById(report)
                    .then((report) => {
                        return report;
                    })
                    .catch((error) => {
                        console.log(error);
                        res.send({ status: 'error', msg: error });
                    });
                return results;
            });
            Promise.all(promises).then(function (results) {
                console.log('results', results);
                res.send({ status: 'success', reports: results });
            });
        })
        .catch((error) => {
            console.log(error);
            res.send({ status: 'error', msg: error });
        });
});

router.get('/status/:status', (req, res) => {
    Report.find({ status: req.params.status })
        .then((reports) => {
            res.send({ status: 'success', reports: reports });
        })
        .catch((error) => {
            res.send({ status: 'error', msg: error });
        });
});

// UPDATE
router.put('/:id', (req, res) => {

    Report.findByIdAndUpdate(req.params.id, { status: req.body.status, reason: req.body.reason }, (err, report) => {
        if (err) {
            res.send({ status: 'error', msg: 'DB error' })
            console.log(err)
            return;
        }
        res.send({ status: 'success', report: report });
    });
});

// DELETE
router.delete('/:id', (req, res) => {
    res.send('Deleted for id', req.params.id);
});



module.exports = router;