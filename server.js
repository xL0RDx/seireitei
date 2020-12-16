import express from 'express';
import connectDatabase from './config/db';
import { check, validationResult } from 'express-validator';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import User from './models/User';

const app = express();

connectDatabase();

app.use(express.json({extended: false }));
app.use(
    cors({
        origin: 'http://localhost:3000'
    })
);

/**
 * @route
 * @desc
*/

app.get('/', (req, res) =>
    res.send('http get request sent to root api endpoint')
);

/**
 * @route
 * @desc
*/

app.post(
    '/api/users',
    [ 
        check('name', 'Please enter your name')
        .not()
        .isEmpty(),
        check('email', 'Please enter a valid email').isEmail(),
        check(
            'password',
            'Please enter a password with 6 or more characters'
        ).isLength({min: 6})
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        } else {
            const { name, email, password } = req.body;
            try {
                //check if user exists
                let user = await User.findOne({ email: email });
                if (user) {
                    return res
                    .status(400)
                    .json({ errors: [{ msg: 'User already exists' }] });
                }

                //create new user
                user = new User({
                    name: name,
                    email: email,
                    password: password
                });

                //encrypt the password
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(password, salt);

                //save to the db and return
                await user.save();
                res.send('User successfully registered');
            } catch (error) {
                res.status(500).send('Server error');
            }
        }
    }
);

//return res.send(req.body);

const port = 5000;
app.listen(port, () => console.log('Express server running on port ' + port));
