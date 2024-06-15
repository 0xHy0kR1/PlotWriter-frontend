import {useIntl} from 'react-intl'
import {MenuItem} from './MenuItem'
import {MenuInnerWithSub} from './MenuInnerWithSub'
import {MegaMenu} from './MegaMenu'
import { Link, useLocation } from 'react-router-dom';
import logo from '/src/assets/logo/index_logo.png';

export function MenuInner() {
  const intl = useIntl();
  const { pathname } = useLocation();
  return (
    <>
        <div className='d-flex align-items-center flex-grow-1 flex-lg-grow-0'>
          <Link to='/' className=''>
            <img
              alt='Logo'
              src={logo}
              className='h-30px'
            />
          </Link>
        </div>
        <MenuItem title={intl.formatMessage({id: 'MENU.DASHBOARD'})} to='/dashboard' />
        {pathname === '/' && (
          <>
            <MenuItem title='Features' to='/features' />
            <MenuItem title='Construct script' to='/script' />

            <MenuItem title='Blogs' to='/blogs' />
          </>
      )}
    </>
  )
}
