import React from 'react'; // Removed { Children } import as it's not needed
import useAuth from '../Hooks/useAuth';
import { Navigate } from 'react-router';


const PrivateRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <span className="loading loading-dots loading-xl"></span>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

   
    return children;
};

export default PrivateRoute;