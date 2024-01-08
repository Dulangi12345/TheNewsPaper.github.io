import React, { useState } from 'react';
import AdminSidebar from '../../layout/AdminSidebar';
import ManageHomepage from './ManageHomepage';
import ManageScienceAndTechnology from './ManageScienceAndTech';
import ManageTravelAndLifestyle from './ManageTravelAndLifestyle';
import ManageArtsAndCulture from './ManageArtsAndCulture';
import ManageCurrentEvents from './ManageCurrentEvents';
import ManageWellbeingCorner from './ManageWellbeingCorner';
import ManageApiitEvents from './ManageApiitEvents';

const ManageArticles = () => {
    const [selectedOption, setSelectedOption] = useState('homepage');

    const handleOptionChange = (e) => {
        setSelectedOption(e.target.value);
    }

    const renderComponentBasedOnSelection = () => {
        switch (selectedOption) {
            case 'homepage':
                return <ManageHomepage />
            case 'currentEvent':
                return <ManageCurrentEvents />
            case 'apiitEvent':
                return <ManageApiitEvents />
            case 'scienceAndTechnology':
                return <ManageScienceAndTechnology />
            case 'travelAndLifestyle':
                return <ManageTravelAndLifestyle />
            case 'wellbeingCorner':
                return <ManageWellbeingCorner />
            case 'artsAndCulture':
                return <ManageArtsAndCulture />
            default:
                return <div>Please select an option to view the related articles</div>
        }
    }

    return (
        <div className="flex">
            <div className="w-64 bg-gray-200">
                <AdminSidebar />
            </div>
            <div className="ml-6 mt-6">
                <h1 className="text-3xl mb-4">Manage Articles</h1>
                <select
                    value={selectedOption}
                    onChange={handleOptionChange}
                    className="px-4 py-2 rounded-md border-2 border-gray-300 mb-4"
                >
                    <option value="homepage">Homepage</option>
                    <option value="currentEvent">Current Events</option>
                    <option value="apiitEvent">Apiit Events</option>
                    <option value="scienceAndTechnology">Science and Technology</option>
                    <option value="travelAndLifestyle">Travel and Lifestyle</option>
                    <option value="wellbeingCorner">Wellbeing Corner</option>
                    <option value="artsAndCulture">Arts and Culture</option>
                </select>
                <div className="py-4">
                    {renderComponentBasedOnSelection()}
                </div>
            </div>
        </div>

    );
};

export default ManageArticles;