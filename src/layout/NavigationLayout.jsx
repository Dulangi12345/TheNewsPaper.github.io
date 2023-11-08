// import { set } from 'mongoose';
// import React, { useState, useContext } from 'react';
// import { Link, useNavigate, useLocation } from "react-router-dom";
// import DropdownMenu from './dropdown';
// import { AuthContext } from '../pages/auth/AuthProvider';

// const NavigationLayout = () => {
//     const { isLoggedIn, logout } = useContext(AuthContext);

//     const navigate = useNavigate();
//     const location = useLocation();

//     //Home Path name
//     const isHomepage = location.pathname === '/';  


//     return (
//         <div>
//             <nav className="flex flex-col items-end mr-12">
//                 {isHomepage && (
//                     <div className="flex space-x-12 mt-6">
//                         <div className="">
//                             <Link to="/">Home</Link>
//                         </div>
//                         <div>
//                             <Link to="/catalyst/homepage">Catalyst</Link>
//                         </div>
//                         <div >
//                             <Link to="/kagura/homepage">Kagura</Link>
//                         </div>
//                         <div >
//                             <Link to="/CTTLive/homepage">CTT Live</Link>
//                         </div>
//                         {isLoggedIn ? (
//                             <div className='cursor-pointer' onClick={() => { logout(); navigate('/'); }}>
//                                 <span>Logout</span>
//                             </div>
//                         ) : (
//                             <div className='cursor-pointer'>
//                                 <Link to="/login">Login</Link>
//                             </div>
//                         )}
//                     </div>
//                 )}
//                 {location.pathname.includes('/catalyst') && !location.pathname.includes('admin') && (
//                     <div className="flex space-x-8 mt-6">
//                         <div >
//                             <Link to="/">Home</Link>
//                         </div>
//                         <div className=' w-16 text-center'>
//                             <Link to="/catalyst/homepage">Catalyst Homepage</Link>
//                         </div>
//                         <div>
//                             <DropdownMenu />
//                         </div>
//                         <div className=' w-16 text-center'>
//                             <Link to="/catalyst/current-events">Current Events</Link>
//                         </div>
//                         <div className='w-24 text-center'>
//                             <Link to="/catalyst/science-and-technology">Science and Technology</Link>
//                         </div>
//                         <div className='w-20 text-center'>
//                             <Link to="/catalyst/travel-and-lifestyle">Travel and Lifestyle</Link>
//                         </div>
//                         <div className='w-16 text-center'>
//                             <Link to="/catalyst/wellbeing-corner">Wellbeing Corner</Link>
//                         </div>
//                         <div className='w-16 text-center'>
//                             <Link to="/catalyst/inhouse-comic">Inhouse Comic</Link>
//                         </div>
//                         <div className='w-16 text-center'>
//                             <Link to="/catalyst/anime-corner">Anime Corner</Link>
//                         </div>
//                         <div className='w-24 text-center'>
//                             <Link to="/catalyst/arts-and-culture">Arts and Culture</Link>
//                         </div>
//                         <div className='w-16 text-center'>
//                             <Link to="/catalyst/other-extras">Other Extras</Link>
//                         </div>
//                         <div>
//                             <Link to="/kagura/homepage">Kagura</Link>
//                         </div>
//                         <div>
//                             <Link to="/CTTLive/homepage">CTT Live</Link>
//                         </div>
//                     </div>
//                 )
//                 }
//                 {
//                     location.pathname.includes('/kagura') && !location.pathname.includes('admin') && (
//                         <div className="flex space-x-8 mt-6">
//                             <div>
//                                 <Link to="/">Home</Link>
//                             </div>
//                             <div>
//                                 <Link to="/kagura/homepage">Kagura Homepage</Link>
//                             </div>
//                             <div>
//                                 <Link to="/catalyst/homepage">Catalyst</Link>
//                             </div>
//                             <div>
//                                 <Link to="/CTTLive/homepage">CTT Live</Link>
//                             </div>

//                         </div>
//                     )
//                 }
//                 {
//                     location.pathname.includes('/CTTLive') && !location.pathname.includes('admin') && (
//                         <div className='flex space-x-8 mt-6'>
//                             <div>
//                                 <Link to="/">Home</Link>
//                             </div>
//                             <div>
//                                 <Link to="/CTTLive/homepage">CTT Live Homepage</Link>
//                             </div>
//                             <div>
//                                 <Link to="/catalyst/homepage">Catalyst</Link>
//                             </div>
//                             <div>
//                                 <Link to="/kagura/homepage">Kagura</Link>
//                             </div>
//                         </div>
//                     )
//                 }
//             </nav >
//         </div >
//     );
// }

// export default NavigationLayout;

import React, { useState, useContext } from 'react';
import { Link, useNavigate, useLocation } from "react-router-dom";
import DropdownMenu from './dropdown';
import { AuthContext } from '../pages/auth/AuthProvider';

const NavigationLayout = () => {
    const { isLoggedIn, logout } = useContext(AuthContext);
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    //Home Path name
    const isHomepage = location.pathname === '/';


    const toggleMobileMenu = () => {
        setMobileMenuOpen(!isMobileMenuOpen);
    };




    return (
        <div>
            <nav className=" ">




                {isHomepage && (
                    <div className="relative flex h-16 items-center justify-between text-center items-baseline bg-white lg:rounded-full rounded-3xl m-4 shadow-md border-2 border-gray-100 mx-auto max-w-7xl">
                        <div className="absolute inset-y-0 left-0 flex items-center sm:hidden md:hidden">
                            <button
                                type="button"
                                className="relative inline-flex items-center justify-center rounded-md p-2 m-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                                aria-controls="mobile-menu"
                                aria-expanded={isMobileMenuOpen}
                                onClick={toggleMobileMenu}
                            >
                                <span className="absolute -inset-0.5"></span>
                                <span className="sr-only">Open main menu</span>
                                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                                </svg>
                                <svg className="hidden h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="flex items-center justify-center sm:items-stretch sm:justify-start m-auto left-0 right-0">
                            <div className="hidden sm:ml-6 sm:block md:ml-6 md:block">
                                <div className="flex space-x-4" id='nav-links'>
                                    <div className="text-black hover:underline rounded-md px-3 py-2 text-sm font-bold">
                                        <Link to="/">Home</Link>
                                    </div>
                                    <div className="text-black hover:underline rounded-md px-3 py-2 text-sm font-bold">
                                        <Link to="/catalyst/homepage">Catalyst</Link>
                                    </div>
                                    <div className="text-black hover:underline rounded-md px-3 py-2 text-sm font-bold">
                                        <Link to="/kagura/homepage">Kagura</Link>
                                    </div>
                                    <div className="text-black hover:underline rounded-md px-3 py-2 text-sm font-bold">
                                        <Link to="/CTTLive/homepage">CTT Live</Link>
                                    </div>
                                    {isLoggedIn ? (
                                        <div className='cursor-pointer text-black hover:underline rounded-md px-3 py-2 text-sm font-bold' onClick={() => { logout(); navigate('/'); }}>
                                            <span>Logout</span>
                                        </div>
                                    ) : (
                                        <div className='text-black hover:underline rounded-md px-3 py-2 text-sm font-bold'>
                                            <Link to="/login">Login</Link>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className={`sm:hidden md:hidden lg:hidden ${isMobileMenuOpen ? "block" : "hidden"}`} id="mobile-menu">
                            {isHomepage && (
                                <div className="space-y-1 px-2 pb-3 pt-2">
                                    <div className="hover:underline block rounded-md px-3 py-2 text-base font-bold" aria-current="page">
                                        <Link to="/">Home</Link>
                                    </div>
                                    <div className="hover:underline block rounded-md px-3 py-2 text-base font-bold">
                                        <Link to="/catalyst/homepage">Catalyst</Link>
                                    </div>
                                    <div className="hover:underline block rounded-md px-3 py-2 text-base font-bold">
                                        <Link to="/kagura/homepage">Kagura</Link>
                                    </div>
                                    <div className="hover:underline block rounded-md px-3 py-2 text-base font-bold">
                                        <Link to="/CTTLive/homepage">CTT Live</Link>
                                    </div>
                                    {isLoggedIn ? (
                                        <div className='cursor-pointer hover:underline block rounded-md px-3 py-2 text-base font-bold' onClick={() => { logout(); navigate('/'); }}>
                                            <span>Logout</span>
                                        </div>
                                    ) : (
                                        <div className='cursor-pointer hover:underline block rounded-md px-3 py-2 text-base font-bold'>
                                            <Link to="/login">Login</Link>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {location.pathname.includes('/catalyst') && !location.pathname.includes('admin') && (
                    <div className="relative flex h-16 items-center justify-between text-center items-baseline bg-white lg:rounded-full rounded-3xl m-4 shadow-md border-2 border-gray-100 mx-auto max-w-7xl ">
                        <div className="absolute inset-y-0 left-0 flex items-center sm:hidden md:hidden ">
                            <button
                                type="button"
                                className="relative inline-flex items-center justify-center rounded-md p-2 m-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                                aria-controls="mobile-menu"
                                aria-expanded={isMobileMenuOpen}
                                onClick={toggleMobileMenu}
                            >
                                <span className="absolute -inset-0.5"></span>
                                <span className="sr-only">Open main menu</span>
                                <svg class="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                                </svg>

                                <svg class="hidden h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="flex flex-1 justify-center sm:items-stretch sm:justify-start ">
                            <div className="hidden sm:ml-6 sm:block md:ml-6 md:block ">
                                <div className="flex space-x-4 items-baseline" id='nav-links'>
                                    <div className="text-black hover:underline rounded-md px-3 py-2 text-sm font-bold  " >
                                        <Link to="/">Home</Link>
                                    </div>
                                    <div className="text-black hover:underline  rounded-md px-3 py-2 text-sm font-bold">
                                        <Link to="/catalyst/homepage">Catalyst Homepage</Link>
                                    </div>
                                    <div>
                                        <DropdownMenu />
                                    </div>
                                    <div className="text-black hover:underline rounded-md px-3 py-2 text-sm font-bold">
                                        <Link to="/catalyst/current-events">Current Events</Link>
                                    </div>
                                    <div className="text-black hover:underline rounded-md px-3 py-2 text-sm font-bold">
                                        <Link to="/catalyst/science-and-technology">Science and Technology</Link>
                                    </div>
                                    <div className="text-black hover:underline rounded-md px-3 py-2 text-sm font-bold">
                                        <Link to="/catalyst/travel-and-lifestyle">Travel and Lifestyle</Link>
                                    </div>
                                    <div className="text-black hover:underline rounded-md px-3 py-2 text-sm font-bold">
                                        <Link to="/catalyst/wellbeing-corner">Wellbeing Corner</Link>
                                    </div>
                                    <div className="text-black hover:underline rounded-md px-3 py-2 text-sm font-bold">
                                        <Link to="/catalyst/inhouse-comic">Inhouse Comic</Link>
                                    </div>
                                    <div className="text-black hover:underline rounded-md px-3 py-2 text-sm font-bold">
                                        <Link to="/catalyst/anime-corner">Anime Corner</Link>
                                    </div>
                                    <div className="text-black hover:underline rounded-md px-3 py-2 text-sm font-bold">
                                        <Link to="/catalyst/arts-and-culture">Arts and Culture</Link>
                                    </div>
                                    {/* <div className="text-black hover:underline rounded-md px-3 py-2 text-sm font-bold">
                                            <Link to="/catalyst/other-extras">Other Extras</Link>
                                        </div> */}
                                    <div className="text-black hover:underline rounded-md px-3 py-2 text-sm font-bold">
                                        <Link to="/kagura/homepage">Kagura</Link>
                                    </div>
                                    <div className="text-black hover:underline rounded-md px-3 py-2 text-sm font-bold">
                                        <Link to="/CTTLive/homepage">CTT Live</Link>
                                    </div>
                                </div>
                            </div>

                        </div>

                        <div className={`sm:hidden md:hidden lg:hidden ${isMobileMenuOpen ? "block" : "hidden"}`} id="mobile-menu">



                            {location.pathname.includes('/catalyst') && !location.pathname.includes('admin') && (

                                <div className="space-y-1 px-2 pb-3 pt-2" id="nav-links">
                                    <div className="hover:underline block rounded-md px-3 py-2 text-base font-bold " >
                                        <Link to="/">Home</Link>
                                    </div>
                                    <div className=" hover:underline block rounded-md px-3 py-2 text-base font-bold">
                                        <Link to="/catalyst/homepage">Catalyst Homepage</Link>

                                    </div>

                                    <div>
                                        <div  >
                                            <DropdownMenu />
                                        </div>
                                    </div>
                                    <div className=" hover:underline block rounded-md px-3 py-2 text-base font-bold">
                                        <Link to="/catalyst/current-events">Current Events</Link>
                                    </div>
                                    <div className=" hover:underline block rounded-md px-3 py-2 text-base font-bold">

                                        <Link to="/catalyst/science-and-technology">Science and Technology</Link>

                                    </div>
                                    <div className=" hover:underline block rounded-md px-3 py-2 text-base font-bold">

                                        <Link to="/catalyst/travel-and-lifestyle">Travel and Lifestyle</Link>

                                    </div>
                                    <div className=" hover:underline block rounded-md px-3 py-2 text-base font-bold">

                                        <Link to="/catalyst/wellbeing-corner">Wellbeing Corner</Link>

                                    </div>
                                    <div className=" hover:underline block rounded-md px-3 py-2 text-base font-bold">

                                        <Link to="/catalyst/inhouse-comic">Inhouse Comic</Link>

                                    </div>
                                    <div className=" hover:underline block rounded-md px-3 py-2 text-base font-bold">

                                        <Link to="/catalyst/anime-corner">Anime Corner</Link>

                                    </div>
                                    <div className=" hover:underline block rounded-md px-3 py-2 text-base font-bold">

                                        <Link to="/catalyst/arts-and-culture">Arts and Culture</Link>

                                    </div>
                                    <div className=" hover:underline block rounded-md px-3 py-2 text-base font-bold">

                                        <Link to="/kagura/homepage">Kagura</Link>

                                    </div>
                                    <div className=" hover:underline block rounded-md px-3 py-2 text-base font-bold">

                                        <Link to="/CTTLive/homepage">CTT Live</Link>

                                    </div>

                                </div>







                            )
                            }
                        </div>


                        {
                            location.pathname.includes('/kagura') && !location.pathname.includes('admin') && (

                                <div className="relative flex h-16 items-center justify-between text-center items-baseline bg-white lg:rounded-full rounded-3xl m-4 shadow-md border-2 border-gray-100 mx-auto max-w-7xl ">
                                    <div className="absolute inset-y-0 left-0 flex items-center sm:hidden md:hidden ">
                                        <button
                                            type="button"
                                            className="relative inline-flex items-center justify-center rounded-md p-2 m-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                                            aria-controls="mobile-menu"
                                            aria-expanded={isMobileMenuOpen}
                                            onClick={toggleMobileMenu}
                                        >
                                            <span className="absolute -inset-0.5"></span>
                                            <span className="sr-only">Open main menu</span>
                                            <svg class="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                                            </svg>

                                            <svg class="hidden h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>

                                    <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                                        <div className="hidden sm:ml-6 sm:block">
                                            <div className="flex space-x-4">
                                                <div className="text-black hover:underline rounded-md px-3 py-2 text-sm font-bold">
                                                    <Link to="/">Home</Link>
                                                </div>
                                                <div className="text-black hover:underline rounded-md px-3 py-2 text-sm font-bold">
                                                    <Link to="/kagura/homepage">Kagura Homepage</Link>
                                                </div>
                                                <div className="text-black hover:underline rounded-md px-3 py-2 text-sm font-bold">
                                                    <Link to="/catalyst/homepage">Catalyst</Link>
                                                </div>
                                                <div className="text-black hover:underline rounded-md px-3 py-2 text-sm font-bold">
                                                    <Link to="/CTTLive/homepage">CTT Live</Link>
                                                </div>

                                            </div>
                                        </div>


                                    </div>

                                    <div className={`sm:hidden md:hidden lg:hidden ${isMobileMenuOpen ? "block" : "hidden"}`} id="mobile-menu">




                                        {
                                            location.pathname.includes('/kagura') && !location.pathname.includes('admin') && (
                                                <div className="space-y-1 px-2 pb-3 pt-2">
                                                    <div className="hover:underline block rounded-md px-3 py-2 text-base font-bold" aria-current="page">
                                                        <Link to="/">Home</Link>
                                                    </div>
                                                    <div className="hover:underline block rounded-md px-3 py-2 text-base font-bold">
                                                        <Link to="/kagura/homepage">Kagura Homepage</Link>

                                                    </div>
                                                    <div className="hover:underline block rounded-md px-3 py-2 text-base font-bold">
                                                        <Link to="/catalyst/homepage">Catalyst</Link>
                                                    </div>
                                                    <div className="hover:underline block rounded-md px-3 py-2 text-base font-bold">

                                                        <Link to="/CTTLive/homepage">CTT Live</Link>

                                                    </div>


                                                </div>


                                            )
                                        }
                                    </div>


                                    {
                                        location.pathname.includes('/CTTLive') && !location.pathname.includes('admin') && (
                                            <div className="relative flex h-16 items-center justify-between text-center items-baseline bg-white lg:rounded-full rounded-3xl m-4 shadow-md border-2 border-gray-100 mx-auto max-w-7xl ">
                                                <div className="absolute inset-y-0 left-0 flex items-center sm:hidden md:hidden ">
                                                    <button
                                                        type="button"
                                                        className="relative inline-flex items-center justify-center rounded-md p-2 m-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                                                        aria-controls="mobile-menu"
                                                        aria-expanded={isMobileMenuOpen}
                                                        onClick={toggleMobileMenu}
                                                    >
                                                        <span className="absolute -inset-0.5"></span>
                                                        <span className="sr-only">Open main menu</span>
                                                        <svg class="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                                                            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                                                        </svg>

                                                        <svg class="hidden h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                                                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                    </button>
                                                </div>

                                                <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                                                    <div className="hidden sm:ml-6 sm:block">
                                                        <div className="flex space-x-4">
                                                            <div className="text-black hover:underline rounded-md px-3 py-2 text-sm font-bold">
                                                                <Link to="/">Home</Link>
                                                            </div>
                                                            <div className="text-black hover:underline rounded-md px-3 py-2 text-sm font-bold">
                                                                <Link to="/CTTLive/homepage">CTT Live Homepage</Link>
                                                            </div>
                                                            <div className="text-black hover:underline rounded-md px-3 py-2 text-sm font-bold">
                                                                <Link to="/catalyst/homepage">Catalyst</Link>
                                                            </div>
                                                            <div className="text-black hover:underline rounded-md px-3 py-2 text-sm font-bold">
                                                                <Link to="/kagura/homepage">Kagura</Link>
                                                            </div>
                                                        </div>
                                                    </div>

                                                </div>

                                                <div className={`sm:hidden md:hidden lg:hidden ${isMobileMenuOpen ? "block" : "hidden"}`} id="mobile-menu">




                                                    {
                                                        location.pathname.includes('/CTTLive') && !location.pathname.includes('admin') && (
                                                            <div className="space-y-1 px-2 pb-3 pt-2">
                                                                <div className="hover:underline block rounded-md px-3 py-2 text-base font-bold" aria-current="page">
                                                                    <Link to="/">Home</Link>
                                                                </div>
                                                                <div className="hover:underline block rounded-md px-3 py-2 text-base font-bold">
                                                                    <Link to="/CTTLive/homepage">CTT Live Homepage</Link>

                                                                </div>
                                                                <div className="hover:underline block rounded-md px-3 py-2 text-base font-bold">
                                                                    <Link to="/catalyst/homepage">Catalyst</Link>
                                                                </div>
                                                                <div className="hover:underline block rounded-md px-3 py-2 text-base font-bold">

                                                                    <Link to="/kagura/homepage">Kagura</Link>

                                                                </div>


                                                            </div>

                                                        )}


                                                </div>
                                            </div>
                                        )
                                    }
                                </div>
                            )
                        }
                    </div>
                )
                }
            </nav >
        </div >
    );
}

export default NavigationLayout;