import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar, Dropdown } from 'flowbite-react';
import { HiMenu, HiUser, HiCash, HiCog, HiOutlineLogout, HiTemplate, HiViewGrid  } from 'react-icons/hi';

const NavbarComponent = ({ user, onLogout }) => {
  const navigate = useNavigate();

  return (
    <Navbar fluid className="bg-[#0353A4]">
      <Navbar.Brand href="/">
        <span className="self-center whitespace-nowrap text-xl font-semibold text-white">
          Spendix
        </span>
      </Navbar.Brand>
      <div className="flex md:order-2">
        <Dropdown
          arrowIcon={false}
          inline
          label={<HiMenu className="w-6 h-6 text-white" />}
        >
          <Dropdown.Header>
            <span className="block text-sm">
              {user?.name}
            </span>
            <span className="block truncate text-sm font-medium">
              {user?.email}
            </span>
          </Dropdown.Header>
          <Dropdown.Item icon={HiUser} onClick={() => navigate('/profile')}>
            Profilo
          </Dropdown.Item>
          <Dropdown.Item icon={HiCash} onClick={() => navigate('/transactions')}>
            Transazioni
          </Dropdown.Item>
          <Dropdown.Item icon={HiCog} onClick={() => navigate('/settings')}>
            Impostazioni
          </Dropdown.Item>
          <Dropdown.Item icon={HiTemplate} onClick={() => navigate('/dashboard')}>
            Dashboard
          </Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item icon={HiOutlineLogout} onClick={onLogout}>
            Logout
          </Dropdown.Item>
        </Dropdown>
      </div>
    </Navbar>
  );
};

export default NavbarComponent;