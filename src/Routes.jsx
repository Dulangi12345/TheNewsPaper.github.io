import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import CatalystHomepage from './pages/Catalyst/CatalystHomepage';
import Homepage from './Homepage';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import CurrentEvents from './pages/Catalyst/CurrentEvents';
import ArtsAndCulture from './pages/Catalyst/ArtsAndCulture';
import OtherExtras from './pages/Catalyst/OtherExtras';
import ScienceAndTechnology from './pages/Catalyst/ScienceAndTechnology';
import TravelAndLifestyle from './pages/Catalyst/TravelAndLifestyle';
import FullArticle from './pages/Catalyst/FullArticle';
import WellbeingCorner from './pages/Catalyst/WellbeingCorner';
import AnimeCorner from './pages/Catalyst/AnimeCorner';
import InhouseComic from './pages/Catalyst/InhouseComic';
import KaguraHomepage from './pages/Kagura/KaguraHomepage';
import CTTHomepage from './pages/CTT/CTTHomepage';
import ManageHomepage from './admin/Catalyst/ManageHomepage';
import CatalystHomepagePreview from './admin/Catalyst/CatalystHomepagePreview';
import AddFreeArticles from './admin/Catalyst/AddFreeArticles';
import FreeArticle from './pages/Catalyst/FreeArticle';
import FreeArticlePreview from './admin/Catalyst/FreeArticlePreview';
import AddAnimeCorner from './admin/Catalyst/AddAnimeCorner';
import AnimeCornerPreview from './admin/Catalyst/AnimeCornerPreview';
import Quiz from './admin/Catalyst/Quiz';
import ApiitEvents from './pages/Catalyst/ApiitEvents';
import ManageApiitEvents from './admin/Catalyst/ManageApiitEvents';

import ProtectedRoute from './pages/auth/ProtectedRoute';
import UnauthorizedPage from './pages/auth/UnauthorizedPage';
import AdminDashboard from './admin/AdminDashboard';
import ManageArticles from './admin/Catalyst/ManageArticles';

const AppRoutes = () => {
    return (
        <Routes>
            {/* Un Authorized route */}
            <Route path="/unauthorized" element={<UnauthorizedPage />} />


            {/* Public Routes */}

            <Route path="*" element={<Navigate to="/" />} />
            <Route path="/" element={<Homepage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route path="/catalyst/homepage" element={<CatalystHomepage />} />
            <Route path="/catalyst/free-articles/:articleId" element={<FreeArticle />} />


            {/* Catalyst Pages - Protected Routes (only accessible by logged in User) */}
            <Route
                path="/catalyst/current-events"
                element={<ProtectedRoute requiredRole="user" fallbackPath="/login" element={<CurrentEvents />} />}
            />
             <Route
                path="/catalyst/apiit-events"
                element={<ProtectedRoute requiredRole="user" fallbackPath="/login" element={<ApiitEvents />} />}
            />

            <Route
                path="/catalyst/arts-and-culture"
                element={<ProtectedRoute requiredRole="user" fallbackPath="/login" element={<ArtsAndCulture />} />}
            />
            <Route
                path="/catalyst/science-and-technology"
                element={<ProtectedRoute requiredRole="user" fallbackPath="/login" element={<ScienceAndTechnology />} />}
            />
            <Route
                path="/catalyst/travel-and-lifestyle"
                element={<ProtectedRoute requiredRole="user" fallbackPath="/login" element={<TravelAndLifestyle />} />}
            />
            <Route
                path="/catalyst/:articlePage/:articleIndex"
                element={<ProtectedRoute requiredRole="user" fallbackPath="/login" element={<FullArticle />} />}
            />
            <Route
                path="/catalyst/wellbeing-corner"
                element={<ProtectedRoute requiredRole="user" fallbackPath="/login" element={<WellbeingCorner />} />}
            />
            <Route
                path="/catalyst/anime-corner"
                element={<ProtectedRoute requiredRole="user" fallbackPath="/login" element={<AnimeCorner />} />}
            />       
            
            <Route
                path="/catalyst/other-extras"
                element={<ProtectedRoute requiredRole="user" fallbackPath="/login" element={<OtherExtras />} />}
            />
            <Route
                path="/catalyst/inhouse-comic"
                element={<ProtectedRoute requiredRole="user" fallbackPath="/login" element={<InhouseComic />} />}
            />


            {/* Kagura Pages - Protected Routes (only accessible by logged in User) */}
            <Route
                path="/kagura/homepage"
                element={<ProtectedRoute requiredRole="user" fallbackPath="/login" element={<KaguraHomepage />} />}
            />


            {/* CTTLive Pages - Protected Routes (only accessible by logged in User) */}
            <Route
                path="/CTTLive/homepage"
                element={<ProtectedRoute requiredRole="user" fallbackPath="/login" element={<CTTHomepage />} />}
            />


            {/* Admin Routes - Protected Routes (only accessible by admin) */}
            <Route
                path="/admin/dashboard"
                element={<ProtectedRoute requiredRole="admin" fallbackPath="/unauthorized" element={<AdminDashboard />} />}
            />
            <Route path="/admin/catalyst/manage-homepage" element={<ManageHomepage />} />
            <Route path="/admin/Catalyst/CatalystHomepagePreview" element={<CatalystHomepagePreview />} />
            <Route
                path="/admin/catalyst/manage-articles"
                element={<ProtectedRoute requiredRole="admin" fallbackPath="/unauthorized" element={<ManageArticles />} />}
            />
            <Route
                path="/admin/catalyst/addFreeArticles"
                element={<ProtectedRoute requiredRole="admin" fallbackPath="/unauthorized" element={<AddFreeArticles />} />}
             />
            <Route 
                path="/admin/Catalyst/FreeArticlePreview"
                element={<ProtectedRoute requiredRole="admin" fallbackPath="/unauthorized" element={<FreeArticlePreview />} />}
            />
            <Route 
                path="/admin/catalyst/addAnimeCorner" 
                element={<ProtectedRoute requiredRole="admin" fallbackPath="/unauthorized" element={<AddAnimeCorner />} />}
            />
            <Route 
                path="/admin/catalyst/animeCornerPreview" 
                element={<ProtectedRoute requiredRole="admin" fallbackPath="/unauthorized" element={<AnimeCornerPreview />} />}
            />
            <Route 
                path="/admin/catalyst/quiz"
                element={<ProtectedRoute requiredRole="admin" fallbackPath="/unauthorized" element={<Quiz />} />}
            />
        </Routes>
    );
}

export default AppRoutes;