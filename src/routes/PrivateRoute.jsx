import React, { Children } from 'react';
import useAuth from '../Hooks/useAuth';
import { Navigate } from 'react-router';

const PrivateRoute = () => {
    const { user, loading } = useAuth();


    if (loading) {
        return <span className='<span className="loading loading-dots loading-xl"></span>'></span>

    }
    if (!user) {
        <Navigate to="/login"></Navigate>

    }

    return Children
};

export default PrivateRoute;