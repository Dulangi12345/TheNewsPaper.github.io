import React from 'react';

const UnauthorizedPage = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="max-w-md w-full py-8 px-4 bg-white shadow-lg rounded-lg text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">404 Unauthorized</h2>
                <p className="text-gray-700">You are not authorized to access this page.</p>
            </div>
        </div>
    );
};

export default UnauthorizedPage;
