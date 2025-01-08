import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { doSignOut } from '../../../auth';
import UpgradePopUp from './UpgradePopUp';

/* CSS */
import './Aside.css'

/* Icons */
import Logo from '../Icons/Logo'
import DashboardIcon from '../Icons/DashboardIcon'
import QuestionIcon from '../Icons/QuestionIcon'
import LightningIcon from '../Icons/LightningIcon'
import UserIcon from '../Icons/UserIcon'
import CurrencyDollarIcon from '../Icons/CurrencyDollarIcon'
import SignOutIcon from '../Icons/SignOutIcon'

/**
 * Props passed from /src/Components/Dashboard/Dashboard.jsx & /src/Components/Dashboard/DashboardTeams.jsx
 * @param {function} currentUser - Array containing current user details
 * @param {function} toggleInviteTeamMemberPopup - Function to fetch show the invite Team member popup
 */
const Aside = ({ currentUser, toggleInviteTeamMemberPopup }) => {
    const location = useLocation()



    /**
     * Display picture
     * Use Google's user's profile picture if the avatar is blank
     */
    let displayPicture = currentUser.additionalInformation.avatar
    if (displayPicture === '' || displayPicture === null) {
        displayPicture = currentUser?.photoURL
    }



    /**
     * Not in use
     * Truncate the string if it contains more than 10 characters.
     */
    const displayName = currentUser.additionalInformation.firstName
    const truncatedDisplayName = displayName.length > 10 ? `${displayName.substring(0, 10)}...` : displayName



    /**
     * Conditionally add the background class based on the route
     */
    useEffect(() => {
        if (location.pathname !== '/') {
            document.body.classList.add('bg-[#F6F7F5]')
        } else {
            document.body.classList.remove('bg-[#F6F7F5]')
        }

        return () => {
            document.body.classList.remove('bg-[#F6F7F5]')
        }
    }, [location.pathname])
    const [accountOpen, setAccount] = useState(null)


    const [isCreateDeckOpen, setIsCreateDeckOpen] = useState(false)
    const toggleCreateDeckPopup = () => {
        setIsCreateDeckOpen(!isCreateDeckOpen)
    }

    return (
        <>
            <UpgradePopUp isOpen={isCreateDeckOpen} onClose={toggleCreateDeckPopup} toggleCreateDeckPopup={toggleCreateDeckPopup} popupType="team" />
            <aside className='aside pt-3 lg:py-6 lg:px-4 fixed lg:static z-[999] flex flex-col lg:justify-between w-full lg:w-[256px] lg:min-w-[256px] lg:h-screen bg-white'>
                <div className='px-4 lg:px-0 pb-3 flex lg:block justify-between items-center border-b-2 border-solid border-[#F6F7F5] lg:border-none'>
                    <Link to='/dashboard' className='block'><Logo className='w-32 lg:w-3/5 lg:mb-8' /></Link>

                    <div className='flex gap-4 items-center lg:hidden'>
                        <Link
                            to='/checkout'
                            className='pr-4 py-4 flex items-center rounded-full border-2 border-solid border-[#F6F7F5] bg-[#F6F7F5] hover:text-white hover:bg-socialpaste-purple group'
                        >
                            <LightningIcon className='w-12 group-hover:invert' />
                            <span className='text-sm font-semibold'>Go Pro</span>
                        </Link>

                        <Link to='/dashboard/account' className='py-2.5 text-center border-b-2 border-solid border-transparent hover:border-black'>
                            <img className='m-auto w-6 rounded-full' src={displayPicture} referrerPolicy="no-referrer" />
                        </Link>
                    </div>

                    <NavLink to='/dashboard' className='p-3 hidden lg:flex items-center rounded-full border-2 border-solid border-white bg-white hover:bg-[#F6F7F5] hover:border-[#F6F7F5]'>
                        <DashboardIcon className='w-12' />
                        <span className='ml-2 text-sm font-semibold'>Dashboard</span>
                    </NavLink>

                    <NavLink to='https://support.socialpaste.io' className='mt-2 p-3 hidden lg:flex items-center rounded-full border-2 border-solid border-white bg-white hover:bg-[#F6F7F5] hover:border-[#F6F7F5]' target='_blank'>
                        <QuestionIcon className='w-12' />
                        <span className='ml-2 text-sm font-semibold'>Help</span>
                    </NavLink>
                </div>

                <div className="px-4 flex justify-between items-center lg:hidden">
                    <NavLink to='/dashboard' className='py-2.5 text-center border-b-2 border-solid border-black hover:border-socialpaste-purple'>
                        <DashboardIcon className='m-auto' />
                        <span className='mt-2 block text-sm font-semibold'>Dashboard</span>
                    </NavLink>

                    {location.pathname.startsWith('/dashboard/') && (
                        <button
                            onClick={toggleInviteTeamMemberPopup}
                            type='button'
                            className='py-2.5 text-center border-b-2 border-solid border-transparent hover:border-black'
                        >
                            <UserIcon className='m-auto' />
                            <span className='mt-2 block text-sm font-semibold'>Invite</span>
                        </button>
                    )}

                    <NavLink to='https://support.socialpaste.io' className='py-2.5 text-center border-b-2 border-solid border-transparent hover:border-black' target='_blank'>
                        <QuestionIcon className='m-auto' />
                        <span className='mt-2 block text-sm font-semibold'>Help</span>
                    </NavLink>
                </div>

                <div className='hidden lg:block'>
                    <div onClick={toggleCreateDeckPopup} className='px-3 py-4 flex items-center rounded-full border-2 border-solid border-[#F6F7F5] bg-[#F6F7F5] hover:text-white hover:bg-socialpaste-purple group'>
                        <LightningIcon className='w-12 group-hover:invert' />
                        <span className='ml-2 text-sm font-semibold'>Upgrade to Pro</span>
                    </div>

                    <button type='button' className='mt-2 p-2 w-full flex items-center rounded-full border-2 border-solid border-[#F6F7F5] bg-white hover:bg-[#F6F7F5]' onClick={() => setAccount(accountOpen === true ? null : true)}>
                        <img className='w-9 rounded-full' src={displayPicture} referrerPolicy="no-referrer" />
                        <span className='ml-2 text-sm font-semibold'>Account</span>
                    </button>

                    {accountOpen && (
                        <div className='absolute left-[100px] bottom-[65px] flex flex-col w-[300px] md:max-h-[calc(100vh-80px)] text-left bg-white shadow-[0px_16px_32px_4px_rgba(0,0,0,0.2)] rounded-[20px] py-[13px] px-1'>
                            <span to='/dashboard/account' className='mt-2 px-[20px] flex items-center'>
                                <img className='w-11 rounded-full' src={displayPicture} referrerPolicy="no-referrer" />
                                <span className='ml-4 text-sm font-semibold'>{truncatedDisplayName}</span>
                            </span>

                            <p className='mt-[40px] mb-[10px] px-[20px] text-[13px] font-bold text-socialpaste-gray'>Account</p>
                            <Link to='/dashboard/account' className='py-[10px] px-[20px] flex items-center items-center rounded-full hover:bg-socialpaste-lightergray'>
                                <UserIcon className='w-[13px]' />
                                <span className='ml-4 block text-[13px]'>My Account</span>
                            </Link>

                            <Link to='/dashboard/billing-overview' className='py-[10px] px-[20px] flex items-center items-center rounded-full hover:bg-socialpaste-lightergray'>
                                <CurrencyDollarIcon className='w-[16px]' />
                                <span className='ml-4 block text-[13px]'>My Billing</span>
                            </Link>

                            <p className='mt-[30px] mb-[10px] px-[20px] text-[13px] font-bold text-socialpaste-gray'>Support</p>

                            <NavLink to='https://support.socialpaste.io' className='py-[10px] px-[20px] flex items-center items-center rounded-full hover:bg-socialpaste-lightergray'>
                                <QuestionIcon className='w-[16px]' />
                                <span className='ml-4 block text-[13px]'>Help</span>
                            </NavLink>

                            <button type='button' className='py-[10px] px-[20px] flex items-center items-center rounded-full hover:bg-socialpaste-lightergray' onClick={() => doSignOut()}>
                                <SignOutIcon className='w-[16px]' />
                                <span className='ml-4 block text-[13px]'>Sign out</span>
                            </button>
                        </div>
                    )}
                </div>
            </aside>
        </>
    )
}

export default Aside