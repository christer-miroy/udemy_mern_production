import Wrapper from '../assets/wrappers/Navbar'
import { FaAlignLeft, FaUserCircle, FaCaretDown } from 'react-icons/fa'
import { useAppContext } from '../context/appContext'
import Logo from './Logo'
import { useState } from 'react'

const Navbar = () => {
  /* set default value of showLogout and setShowLogout to false */
  const [ showLogout, setShowLogout ] = useState(false)

  const { toggleSidebar, logoutUser, user } = useAppContext()

  return (
    <Wrapper>
      <div className='nav-center'>
        {/* toggle sidebar */}
        <button
          type='button'
          className='toggle-btn'
          onClick={toggleSidebar}
        >
          <FaAlignLeft />
        </button>
        <div>
          <Logo />
          <h3 className='logo-text'>
            dashboard
          </h3>
        </div>
        {/* display user name + logout function */}
        <div className='btn-container'>
          {/* show/hide logout dropdown */}
          <button
            type='button'
            className='btn'
            onClick={() => setShowLogout(!showLogout)}
          >
            <FaUserCircle />
            {/* dynamic display of user name */}
            {user?.name}
            {user?.lastName}
            <FaCaretDown />
          </button>
          {/* logout button */}
          <div className={showLogout ? 'dropdown show-dropdown' : 'dropdown'}>
            <button
              type='button'
              className='dropdown-btn'
              onClick={logoutUser}
            >
              logout
            </button>
          </div>
        </div>
      </div>
    </Wrapper>
  )
}
export default Navbar