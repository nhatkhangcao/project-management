import React, { useEffect } from 'react';
import { Button, Modal } from 'react-bootstrap';
import axios from 'axios';
import Swal from "sweetalert2";
import { useState } from 'react';
import { BsPersonPlusFill } from 'react-icons/bs';

function AddUser(props) {

    const [show, setShow] = useState();
    const [errorMessage, setErrorMessage] = useState({
        name: "",
        email: "",
        password: "",
        confirm_password: "",
        role: "",
    });
    const [values, setValues] = useState({
        name: "",
        email: "",
        password: "",
        confirm_password: "",
        role: "",
    });

    //Show modal
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const validateEmail = (email) => {
        const re =
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    const validate = () => {
        let email = values.email;
        let name = values.name;
        let password = values.password;
        let confirm_password = values.confirm_password;
        let role = values.role;
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
        if (name.length < 6) {
            error = {
                ...error,
                name: 'Name must be at least 6 character'
            };
        }
        else {
            error = {
                ...error,
                name: ''
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
        if (confirm_password !== password) {
            error = {
                ...error,
                confirm_password: 'Password does not match'
            };
        } else {
            error = {
                ...error,
                confirm_password: ''
            };
        }
        if (role === "") {
            error = {
                ...error,
                role: 'Please Select Role'
            }
        }
        else {
            error = {
                ...error,
                role: ''
            }
        }
        //empty
        setErrorMessage(error)
        return Object.values(error).every((x) => x == '')
    }

    const handleChange = (event) => {
        setValues({ ...values, [event.target.name]: event.target.value.trim() });
    };

    const handleBlur = () => {
        validate()
    }

    function handleSubmit() {
        let error = errorMessage;
        if (validate()) {
            axios.get('http://127.0.0.1:8000/api/get-email', {
                params: { email: values.email }
            }
            ).then(response => {
                if (response.data?.email) {
                    error = {
                        ...error,
                        email: 'Email already exist!'
                    };
                    setErrorMessage(error);
                }
                else {
                    axios.post('http://127.0.0.1:8000/api/add-user', values
                    )
                        .then(response => {
                            Swal.fire(
                                'Good job!',
                                'Expense Added Successfully',
                                'success');
                            props.getData()
                        })
                    setShow(false)
                    setValues({
                        name: "",
                        email: "",
                        password: "",
                        confirm_password: "",
                        role: "",
                    })
                }
            })
        }
    }
    return (
        <>
            <button onClick={handleShow} type='button' className="btn bg-dark text-white " title="Settings" data-toggle="tooltip">  <BsPersonPlusFill />Add </button>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title >Add User</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="form-group">
                        <label>Name</label>
                        <input onBlur={handleBlur} onChange={handleChange} name='name' type="text" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter name" />
                        {errorMessage && errorMessage.name && <div className='text-danger d-flex justify-content-start mb-2' >{errorMessage.name}</div>}
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input onBlur={handleBlur} onChange={handleChange} name='email' type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email" />
                        {errorMessage && errorMessage.email && <div className='text-danger d-flex justify-content-start mb-2' >{errorMessage.email}</div>}
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input onBlur={handleBlur} onChange={handleChange} name='password' type="password" className="form-control" id="exampleInputPassword1" placeholder="Password" />
                        {errorMessage && errorMessage.password && <div className='text-danger d-flex justify-content-start mb-2' >{errorMessage.password}</div>}
                    </div>
                    <div className="form-group">
                        <label>Confirm Password</label>
                        <input onBlur={handleBlur} onChange={handleChange} name='confirm_password' type="password" className="form-control" id="exampleInputPassword1" placeholder="Confirm Password" />
                        {errorMessage && errorMessage.confirm_password && <div className='text-danger d-flex justify-content-start mb-2' >{errorMessage.confirm_password}</div>}
                    </div>
                    <div className="d-flex justify-content-start">
                        <div className="pb-3">
                            <label>Role</label>
                            <select onBlur={handleBlur} className="form-select" aria-label="Default select example "
                                name='role' onChange={handleChange}>
                                <option value={""}>Select Role</option>
                                <option value={"0"}>Reviewer</option>
                                <option value={"1"}>Admin</option>
                                <option value={"2"}>Editor</option>
                            </select>
                            {errorMessage && errorMessage.role && <div className='text-danger d-flex justify-content-start mb-2' >{errorMessage.role}</div>}
                        </div>
                    </div>

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleSubmit}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
export default AddUser;