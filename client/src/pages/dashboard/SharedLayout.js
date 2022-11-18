import { Outlet } from 'react-router-dom'
import Wrapper from '../../assets/wrappers/SharedLayout'
import {
  SmallSidebar,
  BigSidebar,
  Navbar,
} from '../../components'

const SharedLayout = () => {
  return (
    <Wrapper>
      <main className='dashboard'>
        {/* media query in CSS */}
        <SmallSidebar />
        <BigSidebar />
        {/* second column */}
        <div>
          <Navbar />
          <div className='dashboard-page'>
            <Outlet />
          </div>
        </div>
      </main>
    </Wrapper>
  )
}
export default SharedLayout