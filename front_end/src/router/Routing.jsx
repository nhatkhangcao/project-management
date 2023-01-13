import { React, useEffect } from 'react';
import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import Header from '../components/Header';
import axios from 'axios';
import Login from '../components/Login';
import Product from '../components/pages/Products/Product';
import User from '../components/pages/Users/User';
const PrivateRoute = () => {
    const isAuthorize = localStorage.getItem('user');
    axios.defaults.headers.common['Authorization'] = `Bearer ${JSON.parse(localStorage.getItem('user'))?.token}`;
    return isAuthorize ? <Outlet /> : <Navigate to="/login" />;
}
function Routing(props) {
    return (
        <>
            <Routes>
                <Route exact path='/' element={<PrivateRoute />} >
                    <Route exact path='/userlist' element={<User />} />
                    <Route exact path='/product' element={<Product />} />
                    <Route exact path='*' />
                </Route>
                <Route exact path='/login' element={<Login />} />
            </Routes>
        </>
    );
}

export default Routing;