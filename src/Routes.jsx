import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import CatalystHomepage from './pages/Catalyst/CatalystHomepage';
import Homepage from './Homepage';
import CurrentEvents from './pages/Catalyst/CurrentEvents';
import ArtsAndCulture from './pages/Catalyst/ArtsAndCulture';
import OtherExtras from './pages/Catalyst/OtherExtras';
import ScienceAndTechnology from './pages/Catalyst/ScienceAndTechnology'; 
import TravelAndLifestyle from './pages/Catalyst/TravelAndLifestyle';
import WellbeingCorner from './pages/Catalyst/WellbeingCorner';
import AnimeCorner from './pages/Catalyst/AnimeCorner';
import InhouseComic from './pages/Catalyst/InhouseComic';
import KatalystHomepage from './pages/Kagura/KaguraHomepage';
import CTTHomepage from './pages/CTT/CTTHomepage';
import AddCatalystHomepage from './admin/Catalyst/AddCatalystHomepage';
import CatalystHomepagePreview from './admin/Catalyst/CatalystHomepagePreview';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Homepage />} />

            <Route path="/catalyst/homepage" element={<CatalystHomepage />} />
            <Route path="/catalyst/current-events" element={<CurrentEvents />} />
            <Route path="/catalyst/arts-and-culture" element={<ArtsAndCulture />} />
            <Route path="/catalyst/science-and-technology" element={<ScienceAndTechnology />} />
            <Route path="/catalyst/travel-and-lifestyle" element={<TravelAndLifestyle />} />
            <Route path="/catalyst/wellbeing-corner" element={<WellbeingCorner />} />
            <Route path="/catalyst/anime-corner" element={<AnimeCorner />} />
            <Route path="/catalyst/other-extras" element={<OtherExtras />} />
            <Route path="/catalyst/inhouse-comic" element={<InhouseComic />} />
            <Route path="/catalyst/add-homepage" element={<AddCatalystHomepage />} />
            <Route path="/admin/Catalyst/CatalystHomepagePreview" element={<CatalystHomepagePreview />} />

            <Route path="*" element={<Navigate to="/" />} />

            <Route path="/kagura/homepage" element={<KatalystHomepage />} />
            
            
            <Route path="/CTTLive/homepage" element={<CTTHomepage />} />
        </Routes>
    );
}

export default AppRoutes;