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
import AddFreeArticles from './admin/Catalyst/AddFreeArticles';
import FreeArticle from './pages/Catalyst/FreeArticle';
import FreeArticlePreview from './admin/Catalyst/FreeArticlePreview';
import AddAnimeCorner from './admin/Catalyst/AddAnimeCorner';
import AnimeCornerPreview from './admin/Catalyst/AnimeCornerPreview';
import Quiz from './admin/Catalyst/Quiz';


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
            <Route path="/catalyst/addFreeArticles" element={<AddFreeArticles />} />
            <Route path="/catalyst/free-articles/:articleId" element={<FreeArticle />} />
            <Route path="/admin/Catalyst/FreeArticlePreview" element={<FreeArticlePreview />} />
            <Route path="/catalyst/addAnimeCorner" element={<AddAnimeCorner />} />
            <Route path="/admin/catalyst/animeCornerPreview" element={<AnimeCornerPreview />} />
            <Route path="/admin/catalyst/quiz" element={<Quiz />} />


            



            <Route path="*" element={<Navigate to="/" />} />

            <Route path="/kagura/homepage" element={<KatalystHomepage />} />


            <Route path="/CTTLive/homepage" element={<CTTHomepage />} />
        </Routes>
    );
}

export default AppRoutes;