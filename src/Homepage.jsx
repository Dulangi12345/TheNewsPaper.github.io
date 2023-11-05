import React from 'react';
import photo from './assets/logo.png';
import photo2 from './assets/kaguralogo.png';
import Footer from './layout/footer';


const Homepage = () => {
    return (

        <div className='flex flex-col ' id='homepage-bg'>

            <p className='text-6xl text-center text-black font-bold  w-2/3 m-auto  mt-16' >Welcome to the world of APIIT news</p>

            <div className='grid lg:grid-cols-2 md:gid-row-2 ' >
                {/* <h1 >Main Homepage</h1>
            <h2>IDK What to say</h2> */}




                <div className=''>

                    <ul id='list-motto' className='mt-20'>
                        <li className='text-6xl text-center text-black font-bold  w-2/3 m-auto text-cyan-700 '>Integrity</li>
                        <li className='text-6xl text-center text-black font-bold  w-2/3 m-auto text-red-600 '>Valor</li>
                        <li className='text-6xl text-center text-black font-bold  w-2/3 m-auto '>Dedication</li>
                    </ul>

                    <p className='text-2xl text-center text-black w-2/3 m-auto mt-10' id='paragraph'>
                        Vestibulum ac odio nec felis suscipit tincidunt. Vestibulum dictum massa nec est rhoncus,
                        Aenean sit amet est ac sapien pellentesque convallis. Sed vulputate,
                        nisi a lectus. Phasellus lacinia euismod neque, vel dictum lorem.

                        <button className='bg-none rounded-full border-2  border-black text-lg m-auto mt-10 p-4 w-2/3 '>
                            Subscribe
                        </button>
                    </p>




                </div>

                <div className=''>
                    <img src={photo} alt="logo" className='m-auto lg:pt-24 w-3/4 h-full' />
                </div>






            </div>

            <div className='m-auto w-full mt-48  '>
                <div className='w-' >

                    <div className='' >
                        <div className='flex flex-row' id='Catalyst-section' >

                            <div className='w-full  right-0 left-0 m-auto   '>

                                <button className=' w-1/3 bg-none m-8 p-8 rounded-full border-2  border-black text-lg ml-32'>
                                    Read some of our free articles
                                </button>

                            </div>

                            <div className='w-full'>
                                <h1 className=' font-bold text-center text-5xl pt-16 '>We Are..</h1>
                                <p id='about-us-paragraph' className='p-9 text-xl  '>"Sed ut perspiciatis unde omnis iste natus error sit voluptatem
                                    accusantium doloremque laudantium, totam rem aperiam, eaque ipsa
                                    quae ab illo inventore veritatis et quasi architecto beatae vitae
                                    dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas
                                    sit aspernatur aut odit aut fugit, sed quia consequuntur magni
                                    dolores eos qui ratione voluptatem sequi nesciunt. Neque porro
                                    quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur,
                                    adipisci velit, sed quia non numquam eius modi tempora incidunt ut
                                    labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima
                                    veniam, quis nostrum exercitationem ullam corporis suscipit
                                    laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis
                                    autem vel eum iure reprehenderit qui in ea voluptate velit
                                    esse quam nihil molestiae consequatur, vel illum qui dolorem
                                    eum fugiat quo voluptas nulla pariatur?"</p>

                            </div>

                        </div>

                    </div>
                    {/* <div className='h-96' id='section-xyz'> 

                          <div className='bg-black'>
                            <h1 className='text-4xl font-bold text-center '>The Catalyst</h1>
                          </div>

                       

                        </div> */}
                    <div className='' id='kagura-CTT-description'>
                        <div id='kagura-section' className='flex flex-row' >


                            <div className='w-full ' >
                                <div className=' '  >
                                    <img src={photo2} alt="logo" className='w-2/4  ml-44' />

                                </div>

                            </div>

                            <div className='w-full '>
                                <h1 className=' font-bold text-center text-5xl pt-16 '>Kagura</h1>
                                <p id='about-us-paragraph' className=' p-9 text-xl   '>"Sed ut perspiciatis unde omnis iste natus error sit voluptatem
                                    accusantium doloremque laudantium, totam rem aperiam, eaque ipsa
                                    quae ab illo inventore veritatis et quasi architecto beatae vitae
                                    dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas
                                    sit aspernatur aut odit aut fugit, sed quia consequuntur magni
                                    dolores eos qui ratione voluptatem sequi nesciunt. Neque porro
                                    quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur,
                                    adipisci velit, sed quia non numquam eius modi tempora incidunt ut
                                    labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima
                                    veniam, quis nostrum exercitationem ullam corporis suscipit
                                    laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis
                                    autem vel eum iure reprehenderit qui in ea voluptate velit
                                    esse quam nihil molestiae consequatur, vel illum qui dolorem
                                    eum fugiat quo voluptas nulla pariatur?"</p>
                            </div>


                        </div>

                        <div id='CTT-section' className='flex flex-row' >
                       
                        <div className='w-full ' >
                                <div className=' '  >
                                    <img src={photo2} alt="logo" className='w-2/4  ml-44' />

                                </div>

                            </div>

                            <div className='w-full '>
                                <h1 className=' font-bold text-center text-5xl pt-16 '>CTT</h1>
                                <p id='about-us-paragraph' className=' p-9 text-xl   '>"Sed ut perspiciatis unde omnis iste natus error sit voluptatem
                                    accusantium doloremque laudantium, totam rem aperiam, eaque ipsa
                                    quae ab illo inventore veritatis et quasi architecto beatae vitae
                                    dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas
                                    sit aspernatur aut odit aut fugit, sed quia consequuntur magni
                                    dolores eos qui ratione voluptatem sequi nesciunt. Neque porro
                                    quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur,
                                    adipisci velit, sed quia non numquam eius modi tempora incidunt ut
                                    labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima
                                    veniam, quis nostrum exercitationem ullam corporis suscipit
                                    laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis
                                    autem vel eum iure reprehenderit qui in ea voluptate velit
                                    esse quam nihil molestiae consequatur, vel illum qui dolorem
                                    eum fugiat quo voluptas nulla pariatur?"</p>
                            </div>
                        </div>

                    </div>



                </div>
            </div>

            <Footer/>
        </div>

    );
};

export default Homepage;