import React, { useContext } from 'react';
import { Route, Navigate } from 'react-router-dom';
import { AuthContext } from './AuthProvider'; // Assuming you've created the AuthContext

const ProtectedRoute = ({ element, requiredRole, fallbackPath }) => {
    const { checkUserRole, isLoaded, isLoggedIn } = useContext(AuthContext);
    
    if (!isLoaded) {
        return null;
    }

    const roleCheckResult = checkUserRole(requiredRole);
    console.log("Role check result:", roleCheckResult);

    if (!isLoggedIn) {
        return <Navigate to="/login" />;
    } else if (requiredRole === 'admin' && roleCheckResult !== 'admin') {
        return <Navigate to="/unauthorized" />;
    } else if (requiredRole === 'user' && roleCheckResult !== 'admin' && roleCheckResult !== 'user') {
        return <Navigate to="/unauthorized" />;
    } else {
        return element;
    }
};

export default ProtectedRoute;
