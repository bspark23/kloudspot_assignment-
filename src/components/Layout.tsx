// Main layout component with sidebar navigation
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  Table, 
  MapPin
} from 'lucide-react';
import { NotificationsDropdown } from './NotificationsDropdown';
import LogoutButton from './LogoutButton';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {

  const navItems = [
    {
      name: 'Overview',
      href: '/',
      icon: Home,
    },
    {
      name: 'Crowd Entries',
      href: '/crowd-entries',
      icon: Table,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar with Frame.png background */}
      <div className="w-64 relative">
        {/* Frame.png as background */}
        <div 
          className="absolute inset-0 bg-cover bg-top bg-no-repeat"
          style={{ backgroundImage: 'url(/Frame.png)' }}
        ></div>
        
        {/* Clickable navigation overlay */}
        <div className="relative z-10 h-full flex flex-col">
          {/* Navigation buttons positioned over the frame image */}
          <nav className="flex-1 pt-24">
            <ul className="space-y-2 px-4">
              {navItems.map((item) => (
                <li key={item.name}>
                  <NavLink
                    to={item.href}
                    className={({ isActive }) =>
                      `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                        isActive
                          ? 'bg-white bg-opacity-20 text-white border-l-4 border-white'
                          : 'text-white hover:bg-white hover:bg-opacity-10'
                      }`
                    }
                  >
                    {item.name === 'Crowd Entries' ? (
                      <img 
                        src="/fi_2782996.png" 
                        alt="Crowd Entries"
                        className="mr-3 h-5 w-5 object-contain"
                      />
                    ) : (
                      <item.icon className="mr-3 h-5 w-5" />
                    )}
                    {item.name}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* Logout section at bottom */}
          <div className="p-4">
            <LogoutButton />
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Top bar - matching the provided image */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <h1 className="text-base font-medium text-gray-900">Crowd Solutions</h1>
              
              {/* Separator */}
              <div className="w-px h-4 bg-gray-300"></div>
              
              {/* Avenue Mall Dropdown */}
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                <select className="text-sm text-gray-700 bg-transparent border-none focus:outline-none cursor-pointer">
                  <option>Avenue Mall</option>
                  <option>Central Plaza</option>
                  <option>Metro Center</option>
                </select>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {/* Sort By Button with Image */}
              <button 
                className="flex items-center justify-center border border-gray-300 bg-white hover:bg-gray-50 transition-colors"
                style={{
                  width: '80px',
                  height: '48px',
                  paddingTop: '4px',
                  paddingRight: '8px',
                  paddingBottom: '4px',
                  paddingLeft: '8px',
                  borderRadius: '36px',
                  borderWidth: '1px'
                }}
              >
                <img 
                  src="/Sort by.png" 
                  alt="Sort By"
                  className="w-20 h-12 object-cover"
                />
              </button>
              
              {/* Notifications */}
              <NotificationsDropdown />
              
              {/* Profile Avatar */}
              <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-gray-200">
                <img 
                  src="/ebccabf5ca7c178c67ef3b6d998546ed12a03421.png" 
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};