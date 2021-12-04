import Legal from '../../models/Legal';

export const registerLegal = async (req, res) => {
    try {
        const { body = {} } = req
        const { first_name, last_name, email, password, father_name, phone } = body
        const legal = new Legal({
            first_name,
            last_name,
            email,
            password,
            father_name,
            phone
        });
        await legal.save()
        res.send({ status: 'success', user: legal });
    } catch (error) {
        res.send({ status: 'error', msg: err });
    }
}

export const loginLegal = async (req, res) => {
    try {
        const { body = {} } = req
        const { email, password, image_id } = body
        const legal = await Legal.findOne({ email })    
        if (!legal || legal.length == 0) {
            res.send({ status: 'error', msg: 'NOUSER' });
        } else {
            if (legal.password === password) {
                legal.password = 'encrypted-text';
                res.send({ status: 'success', user: legal });
            } else {
                res.send({ status: 'error', msg: 'INVPASS' });
            }
        }
    } catch (error) {
        res.send({ status: 'error', msg: 'DBERR' });
    }
}