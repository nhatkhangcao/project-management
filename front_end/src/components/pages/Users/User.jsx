import axios from 'axios';
import { BsSearch, BsTrash, BsPersonXFill } from 'react-icons/bs';
import { MdOutlineCancel } from 'react-icons/md';
import { TbArrowsSort } from 'react-icons/tb';
import React, { useState, useEffect } from 'react';
import AddUser from './AddUser';
import EditUser from './EditUser';
import Swal from "sweetalert2";
import Header from '../../Header';
import { useNavigate } from 'react-router-dom';

function User(props) {
    const [user, setUser] = useState({
        data: {}
    });
    const [paging, setPaging] = useState();
    const [search, setSearch] = useState();
    const [sortConfig, setSortConfig] = useState({
        nameSort: 0
    });
    const navigate = useNavigate();

    //Get Data List
    function getData(url) {
        if (!url) {
            url = 'http://127.0.0.1:8000/api/userlist'
        }
        axios.get(url, {
            params: search,
        })
            .then(response => {
                let userlist = response.data;
                setUser(userlist);
                setPagination(response);
            })
            .catch(function (error) {
                console.log(error.response.status);
                if (error.response.status) {
                    navigate("/login");
                }
            });
    }
    //Set paginate
    function setPagination(response) {
        let paging = response.data;
        setPaging(paging);
    }
    //Set role
    function setRole(role) {
        if (role == 1) {
            return 'Admin';
        }
        else if (role == 2) {
            return 'Editor';
        }
        else {
            return 'Reviewer';
        }
    }
    //Search User base on email,name,status,role
    function searchUser() {
        axios.get('http://127.0.0.1:8000/api/search-user',
            {
                params: search
            }).then(response => {
                if (response.data.data) {
                    let data = response.data;
                    let users = data;
                    setUser(users);
                    setPagination(response);
                }
            })
    }
    const handleSearch = (e) => {
        setSearch({ ...search, [e.target.name]: e.target.value })
    }
    // Clear input & data search
    function searchClear() {
        // setSearch({})
        // getData()
        let check = JSON.parse(localStorage.getItem('user'))?.user?.remember_token ?? '';

        // let check1 = Object.values(!check).every((x) => x == '')
        console.log(!!check)
    }
    // Destroy User from table - not DB
    function destroyUser(user) {
        Swal.fire({
            title: 'Are you sure?',
            text: "You want to delete " + "[" + user.name + "]",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                axios.post('http://127.0.0.1:8000/api/destroy-user/' + user.id,)
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
    // Block User
    function blockUser(user) {
        let lock = '';
        if (user.is_active) {
            lock = 'BLOCK';
        }
        else {
            lock = 'UNBLOCK';
        }
        Swal.fire({
            title: 'Are you sure?',
            text: "You want to " + lock + " [" + user.name + "]",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: lock
        }).then((result) => {
            if (result.isConfirmed) {
                axios.post('http://127.0.0.1:8000/api/block-user/' + user.id,)
                    .then(response => {
                        getData();
                        setPagination()
                    })
                Swal.fire(
                    'Blocked!',
                    'Your data has been blocked.',
                    'success'
                )
            }
        })
    }
    function sortUserByName() {
        let userData = user.data;
        let nameSort = sortConfig.nameSort;
        let nextSort;
        if (nameSort === -1) nextSort = 1;
        else nextSort = -1;

        let userSorted = userData.sort((a, b) => {
            return a.name > b.name ? 1 : -1;
        });
        if (nextSort !== 1) {
            userSorted.reverse();
        }
        setSortConfig({
            nameSort: nextSort
        })
        setUser({
            ...user,
            data: userSorted
        })
    }

    let getToken = JSON.parse(localStorage.getItem('user'))?.user?.remember_token ?? '';
    window.addEventListener("beforeunload", (ev) => {
        if (!!!getToken) {
            localStorage.clear();
        }
        ev.preventDefault();
        return ev.returnValue = 'Are you sure you want to close?';
    });
    useEffect(() => {
        getData()
    }, []);

    return (
        <>
            <Header />
            <div className="container pt-4">
                <h4 className='d-flex justify-content-start font-weight-bold'>USER LIST</h4>
                <hr className="bg-primary border-2 border-top border-primary pt-1" />
                <form className='pt-2'>
                    <div className="row ">
                        <div className="col">
                            <label className='d-flex justify-content-start'>UserName</label>
                            <input onChange={(e) => handleSearch(e)} type="text" className="form-control" placeholder="Enter user name" name="name" />
                        </div>
                        <div className="col">
                            <label className='d-flex justify-content-start'>Email</label>
                            <input onChange={(e) => handleSearch(e)} type="text" className="form-control" placeholder="Enter email" name="email" />
                        </div>
                        <div className="col">
                            <label className='d-flex justify-content-start'>Role</label>
                            <select name='role' defaultValue={user.data && user.data.role ? user.data.role : ''} onChange={(e) => handleSearch(e)} className="form-select" >
                                <option value="">Select Role </option>
                                <option value="0">Reviewer</option>
                                <option value="1">Admin</option>
                                <option value="2">Editor</option>
                            </select>
                        </div>
                        <div className="col">
                            <label className='d-flex justify-content-start'>Status</label>
                            <select name='is_active' defaultValue={user.data && user.data.is_active ? user.data.is_active : ''} onChange={(e) => handleSearch(e)} className="form-select" aria-label="Default select example ">
                                <option value="" >Select Status </option>
                                <option value="1">Active</option>
                                <option value="0">Disconnect</option>
                            </select>
                        </div>
                    </div>

                    <div className='d-flex justify-content-between mt-3'>
                        <AddUser
                            getData={getData}
                        />
                        <div className=''>
                            <button type='button' onClick={() => searchUser()} className="btn bg-dark text-white me-4"><BsSearch />Search</button>
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
                        {user && user.data && user.data.length > 0 &&
                            <div className="d-flex justify-content-end">
                                <span></span> From {paging && paging.from}~{paging && paging.to} out of {paging && paging.total}&nbsp;<div className='text-danger '>user</div>
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
                                    <th>Name <TbArrowsSort type='button' onClick={() => sortUserByName()} /></th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody >
                                {user && user.data && user.data.length > 0 ?
                                    user.data.map((userItem, index) => (
                                        <tr key={userItem.id} >
                                            <td>{(user.current_page - 1) * user.per_page + index + 1}</td>
                                            <td className='text-overflow'>{userItem.name}</td>
                                            <td className='text-overflow'>{userItem.email}</td>
                                            <td>{setRole(userItem.role)}</td>
                                            <td>{userItem.is_active === 1 ? "Active" : "Disconnect"}</td>
                                            <td>
                                                <EditUser getData={getData} user={userItem} />
                                                <button onClick={() => destroyUser(userItem)} className="btn text-danger" title="Delete" data-toggle="tooltip"> <BsTrash /> </button>
                                                <button onClick={() => blockUser(userItem)} className="btn text-dark" title="Block" data-toggle="tooltip"> <BsPersonXFill /> </button>
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
        </>
    );
}
export default User;