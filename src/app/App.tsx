import {Suspense} from 'react'
import {Outlet} from 'react-router-dom'
import {I18nProvider} from '../_metronic/i18n/i18nProvider'
import {LayoutProvider, LayoutSplashScreen} from '../_metronic/layout/core'
import {MasterInit} from '../_metronic/layout/MasterInit'
import {AuthInit} from './modules/auth'
import { ThemeModeProvider, useThemeMode } from '../_metronic/partials';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Provider } from 'react-redux'; // Import Provider
import { store } from './modules/apps/scripts/store'; // Import the store

const App = () => {
  const { mode } = useThemeMode();

  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Provider store={store}>
      <I18nProvider>
        <LayoutProvider>
          <ThemeModeProvider>
            <AuthInit>
              <Outlet />
              <MasterInit />
              <ToastContainer 
                theme={mode === 'dark' ? 'dark' : 'light'}
                autoClose={3000} // Set autoClose to 3 seconds
              />
            </AuthInit>
          </ThemeModeProvider>
        </LayoutProvider>
      </I18nProvider>
      </Provider>
    </Suspense>
  )
}

export {App}
