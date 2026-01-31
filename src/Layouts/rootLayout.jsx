import React from 'react';
import { Outlet } from 'react-router';
import Navbar from '../Pages/shared/navbar/Navbar';
import Footer from '../Pages/shared/footer/footer';

const rootLayout = () => {
    return (
        <div>
            <Navbar></Navbar>
            <Outlet></Outlet>
            <Footer></Footer>
        </div>
    );
};

export default rootLayout;