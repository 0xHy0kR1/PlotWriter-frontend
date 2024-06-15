import clsx from "clsx";
import React, { useState } from 'react';
import { KTIcon, toAbsoluteUrl } from "../../../helpers";
import {
  HeaderNotificationsMenu,
  HeaderUserMenu,
  Search,
  ThemeModeSwitcher,
} from "../../../partials";
import { useLayout } from "../../core";
import { useLocation } from "react-router-dom";
import CreateScriptModal from '../../../../app/modules/modals/CreateScriptModal';

const itemClass = "ms-1 ms-md-4";
const btnClass =
  "btn btn-icon btn-custom btn-icon-muted btn-active-light btn-active-color-primary w-35px h-35px";
const userAvatarClass = "symbol-35px";
const btnIconClass = "fs-2";

const Navbar = () => {
  const { config } = useLayout();
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreateScriptClick = () => {
    setIsModalOpen(true); // Open the modal
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // Close the modal
  };

  // Check if the current route is the Home page
  const isHomePage = location.pathname === "/";
  return (
    <div className="app-navbar flex-shrink-0">
      {/* create script button */}
      <div className={clsx('app-navbar-item ', itemClass)}>
        <button
          className='btn text-white rounded-pill d-flex justify-content-center align-items-center'
          style={{ backgroundColor: '#6A0DAD', height: '50%' }}
          onClick={handleCreateScriptClick}
        >
          <div
            className='d-flex justify-content-center align-items-center me-2'
            style={{
              width: '20px',
              height: '20px',
              backgroundColor: 'white',
              borderRadius: '50%',
            }}
          >
            <KTIcon iconName='plus' className='' />
          </div>
          <p className='mb-0' style={{ fontSize: '14px' }}>
            Create Script
          </p>
        </button>
      </div>
      <div className={clsx("app-navbar-item", itemClass)}>
        <ThemeModeSwitcher
          toggleBtnClass={clsx("btn-active-light-primary btn-custom")}
        />
      </div>

      {!isHomePage && (
        <div className={clsx("app-navbar-item", itemClass)}>
          <div
            className={clsx("cursor-pointer symbol", userAvatarClass)}
            data-kt-menu-trigger="{default: 'click'}"
            data-kt-menu-attach="parent"
            data-kt-menu-placement="bottom-end"
          >
            <img src={toAbsoluteUrl("media/avatars/300-3.jpg")} alt="" />
          </div>
          <HeaderUserMenu />
        </div>
      )}

      {config.app?.header?.default?.menu?.display && (
        <div
          className="app-navbar-item d-lg-none ms-2 me-n3"
          title="Show header menu"
        >
          <div
            className="btn btn-icon btn-active-color-primary w-35px h-35px"
            id="kt_app_header_menu_toggle"
          >
            <KTIcon iconName="text-align-left" className={btnIconClass} />
          </div>
        </div>
      )}
       {/* Render CreateScriptModal */}
       <CreateScriptModal isOpen={isModalOpen} onRequestClose={handleCloseModal} />
    </div>
  );
};

export { Navbar };
