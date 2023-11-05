import { set } from 'mongoose';
import React, { useState, useContext } from 'react';
import { Link, useNavigate, useLocation } from "react-router-dom";
import DropdownMenu from './dropdown';
import { AuthContext } from '../pages/auth/AuthProvider';

const NavigationLayout = () => {
    const { isLoggedIn, logout } = useContext(AuthContext);

    const navigate = useNavigate();
    const location = useLocation();

    //Home Path name
    const isHomepage = location.pathname === '/';  


    return (
        <div>
            <nav className="flex flex-col items-end mr-12">
                {isHomepage && (
                    <div className="flex space-x-12 mt-6">
                        <div className="">
                            <Link to="/">Home</Link>
                        </div>
                        <div>
                            <Link to="/catalyst/homepage">Catalyst</Link>
                        </div>
                        <div >
                            <Link to="/kagura/homepage">Kagura</Link>
                        </div>
                        <div >
                            <Link to="/CTTLive/homepage">CTT Live</Link>
                        </div>
                        {isLoggedIn ? (
                            <div className='cursor-pointer' onClick={() => { logout(); navigate('/'); }}>
                                <span>Logout</span>
                            </div>
                        ) : (
                            <div className='cursor-pointer'>
                                <Link to="/login">Login</Link>
                            </div>
                        )}
                    </div>
                )}
                {location.pathname.includes('/catalyst') && !location.pathname.includes('admin') && (
                    <div className="flex space-x-8 mt-6">
                        <div >
                            <Link to="/">Home</Link>
                        </div>
                        <div className=' w-16 text-center'>
                            <Link to="/catalyst/homepage">Catalyst Homepage</Link>
                        </div>
                        <div>
                            <DropdownMenu />
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
                        <div>
                            <Link to="/kagura/homepage">Kagura</Link>
                        </div>
                        <div>
                            <Link to="/CTTLive/homepage">CTT Live</Link>
                        </div>
                    </div>
                )
                }
                {
                    location.pathname.includes('/kagura') && !location.pathname.includes('admin') && (
                        <div className="flex space-x-8 mt-6">
                            <div>
                                <Link to="/">Home</Link>
                            </div>
                            <div>
                                <Link to="/kagura/homepage">Kagura Homepage</Link>
                            </div>
                            <div>
                                <Link to="/catalyst/homepage">Catalyst</Link>
                            </div>
                            <div>
                                <Link to="/CTTLive/homepage">CTT Live</Link>
                            </div>

                        </div>
                    )
                }
                {
                    location.pathname.includes('/CTTLive') && !location.pathname.includes('admin') && (
                        <div className='flex space-x-8 mt-6'>
                            <div>
                                <Link to="/">Home</Link>
                            </div>
                            <div>
                                <Link to="/CTTLive/homepage">CTT Live Homepage</Link>
                            </div>
                            <div>
                                <Link to="/catalyst/homepage">Catalyst</Link>
                            </div>
                            <div>
                                <Link to="/kagura/homepage">Kagura</Link>
                            </div>
                        </div>
                    )
                }
            </nav >
        </div >
    );
}

export default NavigationLayout;
