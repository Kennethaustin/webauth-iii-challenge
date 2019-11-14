const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const secrets = require('../config/secrets.js')

const Users = require('../users/users-model.js');


// for endpoints beginning with /api/auth
router.post('/register', (req, res) => {
    let user = req.body;
    const hash = bcrypt.hashSync(user.password, 10); // 2 ^ n
    user.password = hash;

    Users.add(user)
        .then(saved => {
            res.status(201).json(saved);
        })
        .catch(error => {
            res.status(500).json(error);
        });
});

router.post('/login', (req, res) => {
    let { username, password } = req.body;

    Users.findBy({ username })
        .first()
        .then(user => {
            if (user && bcrypt.compareSync(password, user.password)) {
                const token = generateToken(user)
                res.status(200).json({ message: 'You are logged in', token });
            } else {
                res.status(401).json({ message: 'Invalid Credentials' });
            }
        })
        .catch(error => {
            console.log(error);
            res.status(500).json(error);
        });
});
function generateToken(user) {
    const payload = {
        username: user.username
    }
    // const secret = process.env.JWT_SECRET || 'keep it secret, keep it safe'
    const options = {
        expiresIn: '1d'
    }
    return jwt.sign(payload, secrets.JWT_SECRET, options)
}


module.exports = router;