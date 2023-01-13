import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown'
import axios from 'axios';


function Header(props) {

    const user = JSON.parse(localStorage.getItem('user'));
    const navigate = useNavigate();
    const logOut = () => {
        localStorage.removeItem("user");
        navigate("/login");
    }
    return (
        <div>
            <nav className="navbar navbar-expand-lg navbar-dark text-primary bg-dark ">
                <div className="container-fluid px-5">
                    <div className="collapse navbar-collapse justify-content-between ">
                        <ul className="navbar-nav mb-2 mb-lg-0">
                            <li className="nav-item ">
                                <Link className='nav-link text-white' to="/userlist">User</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link text-white" to="/product">Product</Link>
                            </li>
                        </ul>
                        <ul className="navbar-nav ">
                            <li className="nav-item">
                                {
                                    !user ? <Link className="nav-link" to="/login">Login</Link>
                                        :
                                        <DropdownButton
                                            variant="dark"
                                            title={user.user.name}
                                            id="dropdown-menu-align-right"  >
                                            <Dropdown.Item onClick={logOut} eventKey="option-1">Logout</Dropdown.Item>
                                        </DropdownButton>
                                }
                            </li>
                        </ul>
                    </div>
                </div>
            </nav >
        </div >
    );
}

export default Header;