import { useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import './Aside.css'

/* Icons */
import Logo from '../Icons/Logo'
import DashboardIcon from '../Icons/DashboardIcon'
import QuestionIcon from '../Icons/QuestionIcon'
import LightningIcon from '../Icons/LightningIcon'
import UserIcon from '../Icons/UserIcon'

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

    return (
        <>
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
                    <Link
                        to='/checkout'
                        className='px-3 py-4 flex items-center rounded-full border-2 border-solid border-[#F6F7F5] bg-[#F6F7F5] hover:text-white hover:bg-socialpaste-purple group'
                    >
                        <LightningIcon className='w-12 group-hover:invert' />
                        <span className='ml-2 text-sm font-semibold'>Upgrade to Pro</span>
                    </Link>

                    <Link to='/dashboard/account' className='mt-2 p-2 flex items-center rounded-full border-2 border-solid border-[#F6F7F5] bg-white hover:bg-[#F6F7F5]'>
                        <img className='w-9 rounded-full' src={displayPicture} referrerPolicy="no-referrer" />
                        <span className='ml-2 text-sm font-semibold'>Account</span>
                    </Link>
                </div>
            </aside>
        </>
    )
}

export default Aside