import React, { useState, useEffect, useRef } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { isInteger } from 'formik';
import axios from 'axios';
import Swal from "sweetalert2";
import { MdEdit } from 'react-icons/md';

function EditProduct(props) {
    const [show, setShow] = useState();
    const [errorMessage, setErrorMessage] = useState({
        product_name: "",
        product_price: "",
        product_detail: "",
        status: "",
        image: "",
    });
    const [values, setValues] = useState(
        props.product
    );
    const [img, setImg] = useState(
        props.product
    );

    const validate = () => {
        let product_name = values.product_name;
        let product_price = values.product_price;
        let status = values.status;
        let error = errorMessage;
        let images = values.image;
        let type = images?.type;
        let size = images?.size / 1024;
        if (images === '' || images === null) {
            if (product_name === '') {
                error = {
                    ...error,
                    product_name: 'Product name must be non-empty'
                };
            }
            else if (product_name.length < 5) {
                error = {
                    ...error,
                    product_name: 'Product name must be at least 5 character'
                };
            }
            else {
                error = {
                    ...error,
                    product_name: ''
                };
            }
            if (product_price === '') {
                error = {
                    ...error,
                    product_price: 'Cost must be non-empty'
                };
            }
            else if (product_price.length < 0) {
                error = {
                    ...error,
                    product_price: 'Cost must not be less than 0'
                };
            }
            else if (!isInteger(product_price)) {
                error = {
                    ...error,
                    product_price: 'Cost must be integer'
                };
            }
            else {
                error = {
                    ...error,
                    product_price: ''
                };
            }
            if (status === "") {
                error = {
                    ...error,
                    status: 'Please Select Status'
                }
            }
            else {
                error = {
                    ...error,
                    status: ''
                }
            }
        }
        else {
            if (type !== 'image/png' && type !== 'image/jpg' && type !== 'image/jpeg') {
                error = {
                    ...error,
                    image: 'The image must be a file of type: png, jpg, jpeg'
                };
            }
            else if (size > 2048) {
                error = {
                    ...error,
                    image: 'The image file must be less than 2Mb'
                };
            }
            else {
                error = {
                    ...error,
                    image: ''
                };
            }
            if (product_name === '') {
                error = {
                    ...error,
                    product_name: 'Product name must be non-empty'
                };
            }
            else if (product_name.length < 5) {
                error = {
                    ...error,
                    product_name: 'Product name must be at least 5 character'
                };
            }
            else {
                error = {
                    ...error,
                    product_name: ''
                };
            }
            if (product_price === '') {
                error = {
                    ...error,
                    product_price: 'Cost must be non-empty'
                };
            }
            else if (product_price.length < 0) {
                error = {
                    ...error,
                    product_price: 'Cost must not be less than 0'
                };
            }
            else if (!isInteger(product_price)) {
                error = {
                    ...error,
                    product_price: 'Cost must be integer'
                };
            }
            else {
                error = {
                    ...error,
                    product_price: ''
                };
            }
            if (status === "") {
                error = {
                    ...error,
                    status: 'Please Select Status'
                }
            }
            else {
                error = {
                    ...error,
                    status: ''
                }
            }

        }

        setErrorMessage(error)
        return Object.values(error).every((x) => x == '')
    }

    const handleClose = () => {
        setShow(false)
    }

    const handleShow = () => {
        setShow(true);
    }

    function deleteImage(ProductID) {
        let image = values.image
        setValues({ ...values, image: '' })
        aRef.current.value = null;
        setErrorMessage({ ...errorMessage, image: '' })
        axios.post('http://127.0.0.1:8000/api/delete-img/' + ProductID, {
        })
    }

    const submitData = (e, ProductID) => {
        e.preventDefault();
        if (validate()) {
            const data = new FormData(e.target);
            axios.post('http://127.0.0.1:8000/api/edit-product/' + ProductID, data
            ).then(response => {

                Swal.fire(
                    'Good job!',
                    'Expense Added Successfully',
                    'success');
                props.getData()
            })
            setShow(false)
        }
    }

    const handleImage = (file) => {
        setValues({ ...values, image: file[0] });
    }

    const aRef = useRef(null);

    const handleBlur = () => {
        validate()
    }

    const handleChange = (event) => {
        setValues({ ...values, [event.target.name]: event.target.value.trim() });

    }

    const checkImage = () => {
        let temp = ''

        if (img.image === values.image) {
            temp = `http://localhost:8000/${values.image}`
        }
        else {
            temp = values?.image ? URL.createObjectURL(new Blob([values.image])) : ''
        }
        return temp;
    }

    return (
        <>
            <button onClick={handleShow} type='button' className="btn text-primary " title="Settings" data-toggle="tooltip"> <MdEdit /></button>
            <Modal
                show={show}
                onHide={() => setShow(false)}
                dialogClassName="modal-dialog modal-xl"
                aria-labelledby="example-custom-modal-styling-title" >
                <form onSubmit={(e) => submitData(e, props.product.id)}>
                    <Modal.Header closeButton>
                        <Modal.Title id="example-custom-modal-styling-title">Edit Product</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="container-fluid">
                            <div className="row">
                                <div className="col-6">
                                    <div className="input-group form-group">
                                        <label className='col-sm-2 col-form-label '>Product</label>
                                        <div className='col-sm-10'>
                                            <input onBlur={handleBlur} onChange={handleChange} name='product_name' defaultValue={props.product.product_name} type="text" className="form-control" aria-describedby="emailHelp" placeholder="Enter product name" />
                                            {errorMessage && errorMessage.product_name && <div className='text-danger input-group' >{errorMessage.product_name}</div>}
                                        </div>
                                    </div>
                                    <div className="input-group form-group pt-2">
                                        <label className='col-sm-2 col-form-label '>Cost</label>
                                        <div className='col-sm-10'>
                                            <input onBlur={handleBlur} onChange={handleChange} name='product_price' defaultValue={props.product.product_price} type="text" className="form-control" aria-describedby="emailHelp" placeholder="Enter cost" />
                                            {errorMessage && errorMessage.product_price && <div className='text-danger input-group' >{errorMessage.product_price}</div>}
                                        </div>
                                    </div>
                                    <div className="input-group pt-2">
                                        <label className='col-sm-2 col-form-label '>Detail</label>
                                        <textarea onBlur={handleBlur} onChange={handleChange} name='product_detail' defaultValue={props.product.product_detail} className="form-control" rows="6"></textarea>
                                    </div>
                                    <div className="input-group py-4">
                                        <label className='col-sm-2 col-form-label '>Status</label>
                                        <div className='col-sm-10'>
                                            <select onBlur={handleBlur} onChange={handleChange} name='status' defaultValue={props.product.status} className="form-select" aria-label="Default select example ">
                                                <option value="0">On Sale</option>
                                                <option value="1">Stop Selling</option>
                                                <option value="2">Sold Out</option>
                                            </select>
                                            {errorMessage && errorMessage.status && <div className='text-danger input-group' >{errorMessage.status}</div>}
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-4 ms-auto">
                                    <label className='col-sm-2 col-form-label pe-4'>Image</label>
                                    {
                                        values.image !== '' && values.image !== null || props.product.image ? <img className='img-fluid' src={checkImage()} />
                                            : <div className='text-primary'>
                                                No image
                                            </div>
                                    }
                                    {errorMessage && errorMessage.image && <div className='text-danger input-group' >{errorMessage.image}</div>}
                                    <div className="input-group mb-3 pt-3">
                                        <button className="btn btn-danger" onClick={() => deleteImage(props.product.id)} type="button">Delete</button>
                                        <input ref={aRef} className="form-control" type="file" name='image' onChange={e => handleImage(e.target.files)} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" type='button' onClick={handleClose}>
                            Close
                        </Button>
                        <Button variant="primary" type='submit'>
                            Save Changes
                        </Button>
                    </Modal.Footer>
                </form>
            </Modal >
        </>
    );
}

export default EditProduct;