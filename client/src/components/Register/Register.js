import React, { useState } from 'react'
import axios from 'axios';
import { useHistory } from 'react-router-dom';

const Register = ({ authenticateUser }) => {
    let history = useHistory();
    const [userData, setUserData] = useState({
        name: '',
        email: '',
        password: '',
        passwordConfirm: ''
    });
    const [errorData, setErrorData] = useState({ errors: null });
    

    const { name, email, password, passwordConfirm } = userData;
    const { errors } = errorData;

    const onChange = e => {
        const { name, value } = e.target;
        setUserData({
            ...userData,
            [name]: value
        })
    }

    const registerUser = async () => {
        if (password !== passwordConfirm) {
            console.log('Passwords do not match');
        }
        else {
            const newUser = {
                name: name,
                email: email,
                password: password
            }    

        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            }

            const body = JSON.stringify(newUser);
            const res = await axios.post('/api/users', body, config);
            
            localStorage.setItem('token', res.data.token);
            history.push('/');
        } catch (error) {

            localStorage.removeItem('token');

            setErrorData({
                ...errors,
                errors: error.response.data.errors
            })
        }
        authenticateUser();
    }
    }


return (
    <div>
        <h2>Register</h2>
        <div>
            <input
                type="text"
                placeholder="Name"
                name="name"
                value={name}
                onChange={e => onChange(e)} />   
        </div>
        <div>
            <input
                type="text"
                placeholder="Email"
                name="email"
                value={email}
                onChange={e => onChange(e)} />
        </div>
        <div>
            <input
                type="text"
                placeholder="Password"
                name="password"
                value={password}
                onChange={e => onChange(e)} />
        </div>
        <div>
            <input
                type="text"
                placeholder="Confirm Password"
                name="passwordConfirm"
                value={passwordConfirm}
                onChange={e => onChange(e)} />
        </div>
        <div>
            <button onClick={() => registerUser()}>Register</button>
        </div>
        <div>
            {errors && errors.map(error =>
                <div key={error.msg}>{error.msg}</div>)}
        </div>
    </div>
    )
}

export default Register
