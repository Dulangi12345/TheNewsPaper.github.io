import { set } from 'mongoose';
import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import DropdownMenu from './dropdown';

const NavigationLayout = () => {
    const [showCatalystLinks, setShowCatalystLinks] = useState(false);
    const [showKaguraLinks, setShowKaguraLinks] = useState(false);
    const [showCTTLiveLinks, setShowCTTLiveLinks] = useState(false);
    const [disappearOtherLinks, setDisappearOtherLinks] = useState(true);
    const navigate = useNavigate();

    const handleLinkClick = (linkName) => {
        if (linkName === 'Catalyst') {
            setShowCatalystLinks(true);
            setShowKaguraLinks(false);
            setShowCTTLiveLinks(false);
            setDisappearOtherLinks(false);
            navigate('/catalyst/homepage');
        } else if (linkName === 'Kagura') {
            setShowKaguraLinks(true);
            setShowCatalystLinks(false);
            setShowCTTLiveLinks(false);
            setDisappearOtherLinks(false);
            navigate('/kagura/homepage');
        } else if (linkName === 'CTTLive') {
            setShowCTTLiveLinks(true);
            setShowCatalystLinks(false);
            setShowKaguraLinks(false);
            setDisappearOtherLinks(false);
            navigate('/CTTLive/homepage');
        }
        else {
            setShowCatalystLinks(false);
            setShowKaguraLinks(false);
            setShowCTTLiveLinks(false);
            setDisappearOtherLinks(true);
        }
    };

    return (
        <div>
            <nav className="flex flex-col items-end mr-12 mt-6">
                {disappearOtherLinks && (
                    <div className="flex space-x-12">
                        <div  className="">
                            <Link className='' to="/">Home</Link>
                        </div>
                        <div className=' cursor-pointer' onClick={() => handleLinkClick('Catalyst')}>
                            <span className='text-blue-500'>Catalyst</span>
                        </div>
                        <div className=' cursor-pointer' onClick={() => handleLinkClick('Kagura')}>
                            <span className='text-blue-500'>Kagura</span>
                        </div>
                        <div className=' cursor-pointer' onClick={() => handleLinkClick('CTTLive')}>
                            <span className='text-blue-500'>CTT Live</span>
                        </div>
                    </div>
                )}
                {showCatalystLinks && (
                    <div className="flex space-x-8">
                        <div className=" cursor-pointer" onClick={() => { setShowCatalystLinks(false); setDisappearOtherLinks(true); }}>
                            <Link to="/">Home</Link>
                        </div>
                        <div className=' w-16 text-center'>
                            <Link to="/catalyst/homepage">Catalyst Homepage</Link>
                        </div>
                        <div>
                            <DropdownMenu />
                        </div>
                        <div>
                            <Link to="/catalyst/add-homepage">Add Catalyst Hompage</Link>
                        </div>
                        <div className=' w-16 text-center'>
                            <Link to="/catalyst/current-events">Current Events</Link>
                        </div>
                        <div className='w-24 text-center'>
                            <Link to="/catalyst/science-and-technology">Science and Technology</Link>
                        </div>
                        <div className='w-20 text-center'>
                            <Link to="/catalyst/travel-and-lifestyle">Travel and Lifestyle</Link>
                        </div>
                        <div className='w-16 text-center'>
                            <Link to="/catalyst/wellbeing-corner">Wellbeing Corner</Link>
                        </div>
                        <div className='w-16 text-center'>
                            <Link to="/catalyst/inhouse-comic">Inhouse Comic</Link>
                        </div>
                        <div className='w-16 text-center'>
                            <Link to="/catalyst/anime-corner">Anime Corner</Link>
                        </div>
                        <div className='w-24 text-center'>
                            <Link to="/catalyst/arts-and-culture">Arts and Culture</Link>
                        </div>
                        <div className='w-16 text-center'>
                            <Link to="/catalyst/other-extras">Other Extras</Link>
                        </div>
                        <div onClick={() => { setShowKaguraLinks(true); setDisappearOtherLinks(false); setShowCatalystLinks(false); setShowCTTLiveLinks(false) }}>
                            <Link to="/kagura/homepage">Kagura</Link>
                        </div>
                        <div onClick={() => { setShowCTTLiveLinks(true); setDisappearOtherLinks(false); setShowCatalystLinks(false); setShowKaguraLinks(false) }}>
                            <Link to="/CTTLive/homepage">CTT Live</Link>
                        </div>
                    </div>
                )}
                {showKaguraLinks && (
                    <div className="flex space-x-8">
                        <div onClick={() => { setShowKaguraLinks(false); setDisappearOtherLinks(true); }}>
                            <Link to="/">Home</Link>
                        </div>
                        <div>
                            <Link to="/kagura/homepage">Kagura Homepage</Link>
                        </div>
                        <div onClick={() => { setShowCatalystLinks(true); setDisappearOtherLinks(false); setShowKaguraLinks(false) }}>
                            <Link to="/catalyst/homepage">Catalyst</Link>
                        </div>
                        <div onClick={() => { setShowCTTLiveLinks(true); setDisappearOtherLinks(false); setShowKaguraLinks(false) }}>
                            <Link to="/CTTLive/homepage">CTT Live</Link>
                        </div>
                        
                    </div>
                )}
                {showCTTLiveLinks && (
                    <div className='flex space-x-8'>
                        <div onClick={() => { setShowCTTLiveLinks(false); setDisappearOtherLinks(true); }}>
                            <Link to="/">Home</Link>
                        </div>
                        <div>
                            <Link to="/CTTLive/homepage">CTT Live Homepage</Link>
                        </div>
                        <div onClick={() => { setShowCatalystLinks(true); setDisappearOtherLinks(false); setShowCTTLiveLinks(false) }}>
                            <Link to="/catalyst/homepage">Catalyst</Link>
                        </div>
                        <div onClick={() => { setShowKaguraLinks(true); setDisappearOtherLinks(false); setShowCTTLiveLinks(false) }}>
                            <Link to="/kagura/homepage">Kagura</Link>
                        </div>
                    </div>
                )}
            </nav>
        </div>
    );
}

export default NavigationLayout;
