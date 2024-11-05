import { useEffect } from 'react';
import { Link, NavLink, useLocation  } from 'react-router-dom';
import './Aside.css';

/* Icons */
import Logo from '../Icons/Logo.jsx'
import DashboardIcon from '../Icons/DashboardIcon.jsx'
import QuestionIcon from '../Icons/QuestionIcon.jsx'
import LightningIcon from '../Icons/LightningIcon.jsx'

const Aside = ({ displayPicture, truncatedDisplayName }) => {
    const location = useLocation();

    /**
     * Conditionally add the background class based on the route
     */
    useEffect(() => {
        if (location.pathname !== '/') {
            document.body.classList.add('bg-[#F6F7F5]');
        } else {
            document.body.classList.remove('bg-[#F6F7F5]');
        }

        return () => {
            document.body.classList.remove('bg-[#F6F7F5]');
        };
    }, [location.pathname]);

    return (
        <>
            <aside className='aside pt-3 lg:py-6 lg:px-4 fixed lg:static z-5 flex flex-col lg:justify-between w-full lg:w-[256px] lg:min-w-[256px] lg:h-screen bg-white'>
                <div className='px-4 lg:px-0 pb-3 flex lg:block justify-between items-center border-b-2 border-solid border-[#F6F7F5] lg:border-none'>
                    <Link to='/dashboard' className='block'><Logo className='w-40 lg:w-3/5 lg:mb-8' /></Link>

                    <Link
                        to='/checkout'
                        className='pl-3 pr-7 py-4 flex items-center rounded-full border-2 border-solid border-[#F6F7F5] bg-[#F6F7F5] hover:text-white hover:bg-socialpaste-purple group lg:hidden'
                    >
                        <LightningIcon className='w-12 group-hover:invert' />
                        <span className='ml-2 text-sm font-semibold'>Upgrade to Pro</span>
                    </Link>

                    <NavLink to='/dashboard' className='p-3 hidden lg:flex items-center rounded-full border-2 border-solid border-white bg-white hover:bg-[#F6F7F5] hover:border-[#F6F7F5]'>
                        <DashboardIcon className='w-12' />
                        <span className='ml-2 text-sm font-semibold'>Dashboard</span>
                    </NavLink>

                    <NavLink to='https://support.socialpaste.io' className='mt-2 p-3 hidden lg:flex items-center rounded-full border-2 border-solid border-white bg-white hover:bg-[#F6F7F5] hover:border-[#F6F7F5]' target='_blank'>
                        <QuestionIcon className='w-12' />
                        <span className='ml-2 text-sm font-semibold'>Help</span>
                    </NavLink>
                </div>

                <div class="px-4 flex justify-between items-center lg:hidden">
                    <NavLink to='/dashboard' className='py-2.5 text-center border-b-2 border-solid border-black hover:border-socialpaste-purple'>
                        <DashboardIcon className='m-auto' />
                        <span className='mt-2 block text-sm font-semibold'>Dashboard</span>
                    </NavLink>

                    <NavLink to='https://support.socialpaste.io' className='py-2.5 text-center border-b-2 border-solid border-transparent hover:border-black' target='_blank'>
                        <QuestionIcon className='m-auto' />
                        <span className='mt-2 block text-sm font-semibold'>Help</span>
                    </NavLink>

                    <Link to='/dashboard/profile' className='py-2.5 text-center border-b-2 border-solid border-transparent hover:border-black'>
                        <img className='m-auto w-6 rounded-full' src={displayPicture} referrerPolicy="no-referrer" />
                        <span className='mt-2 block text-sm font-semibold'>Account</span>
                    </Link>
                </div>

                <div className='hidden lg:block'>
                    <Link
                        to='/checkout'
                        className='px-3 py-4 flex items-center rounded-full border-2 border-solid border-[#F6F7F5] bg-[#F6F7F5] hover:text-white hover:bg-socialpaste-purple group'
                    >
                        <LightningIcon className='w-12 group-hover:invert' />
                        <span className='ml-2 text-sm font-semibold'>Upgrade to Pro</span>
                    </Link>

                    <Link to='/dashboard/profile' className='mt-2 p-2 flex items-center rounded-full border-2 border-solid border-[#F6F7F5] bg-white hover:bg-[#F6F7F5]'>
                        <img className='w-9 rounded-full' src={displayPicture} referrerPolicy="no-referrer" />
                        <span className='ml-2 text-sm font-semibold'>Account</span>
                    </Link>
                </div>
            </aside>
        </>
    );
};

export default Aside;