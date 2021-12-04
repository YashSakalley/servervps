import Io from '../../models/Io';

export const registerIo = async (req, res) => {
    try {
        const { body = {} } = req
        const { first_name, last_name, email, password, father_name, phone } = body
        const io = new Io({
            first_name,
            last_name,
            email,
            password,
            father_name,
            phone
        });
        await io.save()
        res.send({ status: 'success', user: io });
    } catch (error) {
        res.send({ status: 'error', msg: err });
    }
}

export const loginIo = async (req, res) => {
    try {
        const { body = {} } = req
        const { email, password, image_id } = body
        const io = await Io.findOne({ email })
        if (!io || io.length == 0) {
            res.send({ status: 'error', msg: 'NOUSER' });
        } else {
            if (io.password === password) {
                io.password = 'encrypted-text';
                res.send({ status: 'success', user: io });
            } else {
                res.send({ status: 'error', msg: 'INVPASS' });
            }
        }
    } catch (error) {
        res.send({ status: 'error', msg: 'DBERR' });
    }
}
