import React from "react";
import { Navigate } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";
import Loader from './Loader';

const PrivateRoute = ({ childern }) => {
    const { user, loading } = useAuth();

    if(loading) {
        return <Loader />
    }

    return user ? childern : <Navigate to='/login' />
}

export default PrivateRoute;