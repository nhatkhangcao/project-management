import React from 'react';
import { Button, Modal } from 'react-bootstrap';
import axios from 'axios';
import Swal from "sweetalert2";
import { useState, useEffect } from 'react';
import { MdEdit } from 'react-icons/md';
import e from 'cors';

function EditUser(props) {
    const [show, setShow] = useState();
    const [errorMessage, setErrorMessage] = useState({
        name: "",
        email: "",
        password: "",
        confirm_password: "",
        role: "",
        is_active: "",
    });
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [values, setValues] = useState(props.user);

    const [checked, setChecked] = useState(false);
    const [disabled, setDisabled] = useState(true);

    const handleChange = (event) => {
        setValues({ ...values, [event.target.name]: event.target.value.trim() });
    };

    const validate = () => {
        let name = values.name ?? '';
        let password = values.password ?? '';
        let confirm_password = values.confirm_password ?? '';
        let error = errorMessage ?? '';
        if (!checked) {
            setErrorMessage('')
        }
        else {
            if (name < 6) {
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

            if (password === '') {
                error = {
                    ...error,
                    password: 'Password must be non-empty'
                };
            }
            else if (password.length < 8) {
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
            setErrorMessage(error)
        }
        return Object.values(error).every((x) => x == '')
    }

    const handleBlur = () => {
        validate()
    }

    function handleSubmit(userID) {
        let error = errorMessage;
        if (validate()) {
            axios.post('http://127.0.0.1:8000/api/edit-user/' + userID, values
            )
                .then(response => {
                    Swal.fire(
                        'Good job!',
                        'Expense Added Successfully',
                        'success');
                    props.getData()
                })
            setShow(false);
        }
    }

    function handleCheckbox() {
        setDisabled(!disabled);
        setChecked(!checked);

    }
    return (
        <>
            <button onClick={handleShow} className="btn text-primary " title="Settings" data-toggle="tooltip">  <MdEdit /> </button>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title >Edit User</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="form-group">
                        <label>Email</label>
                        <input disabled onChange={handleChange} name='email' value={props.user.email} type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email" />
                    </div>
                    <div className="form-group">
                        <label>Name</label>
                        <input onBlur={handleBlur} onChange={handleChange} name='name' defaultValue={props.user.name} type="text" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter name" />
                        {errorMessage && errorMessage.name && <div className='text-danger d-flex justify-content-start mb-2' >{errorMessage.name}</div>}
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input disabled={disabled} onBlur={handleBlur} onChange={handleChange} name='password' defaultValue={props.user.password} type="password" className="form-control" id="exampleInputPassword1" placeholder="Password" />
                        {errorMessage && errorMessage.password && <div className='text-danger d-flex justify-content-start mb-2' >{errorMessage.password}</div>}
                    </div>
                    <div className="form-group">
                        <label>Confirm Password</label>
                        <input disabled={disabled} onBlur={handleBlur} onChange={handleChange} name='confirm_password' defaultValue={props.user.confirm_password} type="password" className="form-control" id="exampleInputPassword1" placeholder="Confirm Password" />
                        {errorMessage && errorMessage.confirm_password && <div className='text-danger d-flex justify-content-start mb-2' >{errorMessage.confirm_password}</div>}
                    </div>
                    <div className="form-group d-flex justify-content-end pt-1 ">
                        <input checked={checked} onChange={handleCheckbox} type="checkbox" />
                        <label className='ms-2'>Change Password</label>
                    </div>
                    <div className="d-flex justify-content-start ">
                        <div className="pe-4 pb-3">
                            <label>Role</label>
                            <select defaultValue={props.user.role} className="form-select" aria-label="Default select example "
                                name='role' onChange={handleChange}>
                                <option value={"0"}>Reviewer</option>
                                <option value={"1"}>Admin</option>
                                <option value={"2"}>Editor</option>
                            </select>
                            {errorMessage && errorMessage.role && <div className='text-danger d-flex justify-content-start mb-2' >{errorMessage.role}</div>}
                        </div>
                        <div >
                            <label>Status</label>
                            <select defaultValue={props.user.is_active} name='is_active' onChange={handleChange} className="form-select" aria-label="Default select example ">
                                <option value="1">Active</option>
                                <option value="0">Disconnect</option>
                            </select>
                            {errorMessage && errorMessage.active && <div className='text-danger d-flex justify-content-start mb-2' >{errorMessage.active}</div>}
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={() => handleSubmit(props.user.id)}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default EditUser;