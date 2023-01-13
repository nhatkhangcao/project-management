import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Header from '../../Header';
import { TbArrowsSort } from 'react-icons/tb';
import AddProduct from './AddProduct';
import { BsSearch, BsTrash } from 'react-icons/bs';
import { MdOutlineCancel } from 'react-icons/md';
import Swal from "sweetalert2";
import EditProduct from './EditProduct';
import { useNavigate } from 'react-router-dom';

function Product(props) {
    const [paging, setPaging] = useState();
    const [product, setProduct] = useState();
    const [search, setSearch] = useState();
    const [sortConfig, setSortConfig] = useState({
        nameSort: 0
    });
    const navigate = useNavigate();
    function getData(url) {
        if (!url) {
            url = 'http://127.0.0.1:8000/api/product'
        }
        axios.get(url, {
            params: search,
            // headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('user')).token}` }
        })
            .then(response => {
                let product = response.data;
                setProduct(product);
                setPagination(response);
            }).catch(function (error) {
                console.log(error.response.status);
                if (error.response.status) {
                    navigate("/login");
                };
            });
    }
    function setStatus(status) {
        if (status == 1) {
            return 'Stop Selling';
        }
        else if (status == 2) {
            return 'Sold Out';
        }
        else {
            return 'On Sale';
        }
    }

    function setPagination(response) {
        let paging = response.data;
        setPaging(paging);
    }

    function destroyProduct(product) {
        Swal.fire({
            title: 'Are you sure?',
            text: "You want to delete " + "[" + product.product_name + "]",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                axios.post('http://127.0.0.1:8000/api/destroy-product/' + product.id)
                    .then(response => {
                        getData();
                    });
                Swal.fire(
                    'Deleted!',
                    'Your data has been deleted.',
                    'success'
                )

            }
        })
    }

    function handleSearch(e) {
        setSearch({ ...search, [e.target.name]: e.target.value })

    }

    function searchProduct() {
        axios.get('http://127.0.0.1:8000/api/search-product',
            {
                params: search
            }).then(response => {
                if (response.data.data) {
                    setProduct(response.data)
                    setPagination(response)

                }
            })
    }

    function searchClear() {
        setSearch({})
        getData()
    }

    function sortUserByName() {
        let productData = product.data;
        let nameSort = sortConfig.nameSort;
        let nextSort;
        if (nameSort === -1) nextSort = 1;
        else nextSort = -1;

        let userSorted = productData.sort((a, b) => {
            return a.product_name > b.product_name ? 1 : -1;
        });
        if (nextSort !== 1) {
            userSorted.reverse();
        }
        setSortConfig({
            nameSort: nextSort
        })
        setProduct({
            ...product,
            data: userSorted
        })
    }

    useEffect(() => {
        getData()
    }, []);

    return (
        <>
            <Header />
            <div className='container'>
                <div className=" pt-4">
                    <h4 className='d-flex justify-content-start font-weight-bold'>PRODUCT LIST</h4>
                    <hr className="bg-primary border-2 border-top border-primary pt-1" />
                    <form className='pt-2'>
                        <div className="row ">
                            <div className="col col-lg-3">
                                <label className='d-flex justify-content-start'>Product Name</label>
                                <input onChange={(e) => handleSearch(e)} type="text" className="form-control" placeholder="Enter product name" name="product_name" />
                            </div>
                            <div className="col col-lg-3">
                                <label className='d-flex justify-content-start'>Status</label>
                                <select name='status' defaultValue={product && product.data && product.data.status ? product.data.status : ''} onChange={(e) => handleSearch(e)} className="form-select" aria-label="Default select example ">
                                    <option value="" >Select Status </option>
                                    <option value="0">On Sale</option>
                                    <option value="1">Stop Selling</option>
                                    <option value="2">Sold Out</option>
                                </select>
                            </div>
                            <div className="col col-lg-2">
                                <label className='d-flex justify-content-start'>From cost</label>
                                <input onChange={(e) => handleSearch(e)} type="text" className="form-control" placeholder="From" name="from" />
                            </div>
                            <div className="col col-lg-2">
                                <label className='d-flex justify-content-start'>To cost</label>
                                <input onChange={(e) => handleSearch(e)} type="text" className="form-control" placeholder="To" name="to" />
                            </div>
                        </div>
                        <div className='d-flex justify-content-between mt-3 '>
                            <AddProduct getData={getData} />
                            <div>
                                <button type='button' onClick={() => searchProduct()} className="btn bg-dark text-white me-4"><BsSearch />Search</button>
                                <button type='reset' onClick={() => searchClear()} className="btn bg-danger text-white"><MdOutlineCancel />Clear</button>
                            </div>
                        </div>
                    </form>
                    <div className=" p-4">
                        <nav aria-label="Page navigation example" className=''>
                            <ul className="pagination d-flex justify-content-center">
                                {paging &&
                                    paging.last_page >= 2 && paging.links && paging.links.map((link) => {
                                        let url = link.url == null ? paging.links[1].url : link.url;
                                        let className = link.active == true ? "page-item active" : "page-item"
                                        return (
                                            <li className={className} key={link.label}>
                                                <button className="page-link" onClick={e => getData(url)}>{link.label}</button>
                                            </li>
                                        )
                                    })
                                }
                            </ul>
                            {product && product.data && product.data.length > 0 &&
                                <div className="d-flex justify-content-end">
                                    <span></span> From {paging && paging.from}~{paging && paging.to} out of {paging && paging.total}&nbsp;<div className='text-danger '>products</div>
                                </div>
                            }
                        </nav>
                    </div>
                    <div className="table-responsive">
                        <div className="table-wrapper">
                            <table className="table table-striped table-hover">
                                <thead >
                                    <tr className='bg-dark text-white'>
                                        <th>#</th>
                                        <th>Product <TbArrowsSort type='button' onClick={() => sortUserByName()} /></th>
                                        <th>Detail</th>
                                        <th>Price</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody >
                                    {product && product.data && product.data.length > 0 ?
                                        product.data.map((productItem, index) => (
                                            <tr key={productItem.id} >
                                                <td>{(product.current_page - 1) * product.per_page + index + 1}</td>
                                                <td className='text-overflow'>{productItem.product_name}</td>
                                                <td className='text-overflow'>{productItem.product_detail}</td>
                                                <td>${productItem.product_price}</td>
                                                <td>{setStatus(productItem.status)}</td>
                                                <td>
                                                    <EditProduct getData={getData} product={productItem} />
                                                    <button onClick={() => destroyProduct(productItem)} className="btn text-danger" title="Delete" data-toggle="tooltip"><BsTrash /></button>

                                                </td>
                                            </tr>
                                        )) :
                                        <tr><td className='text-danger'>NO DATA!</td></tr>
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Product;