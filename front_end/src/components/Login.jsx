import React, { useState } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login(props) {
    const [loginData, setLoginData] = useState({
        email: "",
        password: "",
        remember: false,
    });
    const [errorMessage, setErrorMessage] = useState({
        email: "",
        password: "",
        login: "",
    });

    let remember = loginData.remember
    let email = loginData.email;
    let password = loginData.password;

    const navigate = useNavigate();

    const validateEmail = (email) => {
        const re =
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    // Get data from typing input
    const handleChange = (e) => {
        let value = e.target.value.trim();
        if (e.target.type == "checkbox") {
            value = e.target.checked ? true : false;
        }
        setLoginData({ ...loginData, [e.target.name]: value });
    }

    // Validate Handle - lose focus
    const handleBlur = () => {
        let error = errorMessage;
        if (!validateEmail(email)) {
            error = {
                ...error,
                email: 'Invalid Email'
            };
        }
        else {
            error = {
                ...error,
                email: ''
            };
        }
        if (password.length < 8) {
            error = {
                ...error,
                password: 'Password must be at least 8 character'
            };
        }
        else {
            error = {
                ...error,
                password: ''
            };
        }
        setErrorMessage(error);
    }

    // Check after Validate and Submit
    const handleSubmit = e => {
        e.preventDefault();
        if (errorMessage.email === "" && errorMessage.password === "") {
            axios.get("http://127.0.0.1:8000/sanctum/csrf-cookie").then(() => {
                axios.post("http://127.0.0.1:8000/api/login", {
                    email: email,
                    password: password,
                    remember: remember,

                }).then((response) => {
                    if (response.data) {
                        localStorage.setItem('user', JSON.stringify(response.data))
                        navigate('/userlist', { replace: true });
                    }
                    else {
                        setErrorMessage({ login: response.data.message });
                    }
                }).catch(function (error) {
                })

            })
        }
    }

    return (
        <div className='container pt-5'>
            <div className=" row justify-content-center pt-5">
                <div className=" col-md-8 ">
                    <div className="py-4" >
                        <h1 className='text-center'>Login</h1>
                    </div>
                    {errorMessage && errorMessage.login && <div className='text-danger d-flex justify-content-center mb-2' >{errorMessage.login}</div>}
                    <form onSubmit={handleSubmit}>
                        <div className="row mb-3 d-flex justify-content-center">
                            <div className="col-md-6 ">
                                <input onBlur={handleBlur} onChange={handleChange} name="email" placeholder="Email" className="form-control form-control-lg"
                                    value={loginData.email} />
                                {errorMessage && errorMessage.email && <div className='text-danger d-flex justify-content-start mb-2' >{errorMessage.email}</div>}
                            </div>
                        </div>
                        <div className="row mb-3 d-flex justify-content-center">
                            <div className="col-md-6">
                                <input onBlur={handleBlur} onChange={handleChange} name="password" placeholder="Password" type="password" className="form-control form-control-lg"
                                    value={loginData.password} />
                                {errorMessage && errorMessage.password && <div className='text-danger d-flex justify-content-start mb-2' >{errorMessage.password}</div>}
                            </div>
                        </div>
                        <div className="row mb-3">
                            <div className="col-md-6 offset-md-4 ">
                                <div className="form-check">
                                    <div className='d-flex justify-content-start'>
                                        <input onChange={handleChange} className="form-check-input me-2" type="checkbox" name="remember" id="remember" />
                                        <label className="form-check-label " >
                                            Remember Me
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="d-flex justify-content-center ">
                            <button type="submit" className="btn btn-dark btn-lg w-50">
                                Login
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
export default Login;