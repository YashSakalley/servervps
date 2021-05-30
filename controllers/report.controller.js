export const createReport = async (req, res) => {
    try {
        const { crime, answers, questions, user_id, media_files, signature, image_id, is_facilitator_filled } = req.body;
        const reportBody = new Report({
            crime,
            answers,
            questions,
            user_id,
            media_files,
            signature,
            image_id,
            status: 'Pending',
            is_facilitator_filled: is_facilitator_filled ? true : false
        });
        console.log(reportBody);
        const report = await reportBody.save();
        if (reportBody.user_id === 'Not Available') {
            res.send({ status: 'success', report: reportBody });
            return
        }
        const user = await _findById(reportBody.user_id)    
        user.reports.push(report._id);
        await user.save();
        res.send({ status: 'success', report: reportBody });
    } catch (error) {
        res.send({ status: 'error', msg: error || 'Error saving REPORT' });
    }
}

export const getAllReports = async (req, res) => {
    try {
        const reports = await find({})
        res.send({ status: 'success', reports });
    } catch (error) {
        res.send({ status: 'error', msg: error });        
    }
}

export const getReportCount = async (req, res) => {
    try {
        let approved = 0, pending = 0, rejected = 0;
        let cb = 0, hp = 0, theft = 0, mur = 0, viol = 0, oth = 0;
        const reports = await find({})
        reports.forEach(report => {
            const { status } = report;
            if (status.includes('Approved')) {
                approved += 1
            } else if (status.includes('Rejected')) {
                rejected += 1
            } else {
                pending += 1
            }
            const { crime } = report;
            switch (crime) {
                case 'CYBER BULLYING':
                    cb += 1
                    break;
                case 'HACKING OR PHISHING':
                    hp += 1
                    break
                case 'THEFT':
                    theft += 1
                    break
                case 'MURDER':
                    mur += 1
                    break
                case 'VIOLENCE':
                    viol += 1
                    break
                case 'OTHER':
                    oth += 1
                    break
            }
        })
        res.send({
            status: 'success',
            count: {
                cb, hp, theft, mur, viol, oth, approved, rejected, pending
            }
        })
    } catch (error) {
        res.send({ status: 'error' })
        console.log(error);
    }
}

export const getReportById = async (req, res) => {
    try {
        const { params } = req;
        const { id } = params;
        const report = await findById(id)
        const user = await _findById(report.user_id)            
        res.send({ status: 'success', report, user });
    } catch (error) {
        res.send({ status: 'error', msg: error });
    }
}

// needs further code review
export const getReportsByUserId = async (req, res) => {
    try {
        const { userId } = req.params;
        if (!userId) {
            res.render({ status: 'error', msg: 'UserId not given' });
            return;
        }
        const user = await _findById(userId)
        const { reports } = user;
        const promises = reports.map(async (report) => {
            const results = await report.findById(report)
            .then((report) => {
                return report;
            })
            return results;
        });
        Promise.all(promises).then(function (results) {
            console.log('results', results);
            res.send({ status: 'success', reports: results });
        });
    } catch (error) {
        console.log(error);
        res.send({ status: 'error', msg: error });
    }
}

export const getReportsByStatus = async (req, res) => {
    try {
        const { status } = req.params;
        const reports = await find({ status })
        res.send({ status: 'success', reports });
    } catch (error) {
        res.send({ status: 'error', msg: error });        
    }
}

export const updateReportWorkById = async (req, res) => {
    try {
        const { id, vis } = req.params
        const { work } = req.body
        const report = await findById(id)
        if (vis === 'public')
            report.work.push(work)
        else
            report.private_work.push(work)
        await report.save()
        res.send({ status: 'success', report });
    } catch (error) {
        res.send({ status: 'error', msg: 'Saving error' })
    }
}

