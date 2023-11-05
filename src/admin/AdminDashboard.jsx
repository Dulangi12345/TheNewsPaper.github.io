import React from 'react';
import AdminSidebar from '../layout/AdminSidebar';

const AdminDashboard = () => {
    return (
        <div className="flex">
            <AdminSidebar />
            <div className="ml-64">
                <h1 className="text-3xl">Admin Dashboard</h1>
                
            </div>
        </div>
    );
};

export default AdminDashboard;