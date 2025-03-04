import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Dumbbell, Users, CreditCard, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  if (!user) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64 bg-gray-900">
          <div className="flex items-center justify-center h-16 bg-gray-800">
            <Link to="/" className="flex items-center">
              <Dumbbell className="h-8 w-8 text-orange-500" />
              <span className="ml-2 text-xl font-bold text-white">FlexTrack</span>
            </Link>
          </div>
          <div className="flex flex-col flex-grow px-4 mt-5">
            <nav className="flex-1 space-y-2">
              <Link
                to="/dashboard"
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                  isActive('/dashboard')
                    ? 'bg-gray-800 text-white'
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                <Dumbbell className="mr-3 h-5 w-5" />
                Dashboard
              </Link>
              <Link
                to="/customers"
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                  isActive('/customers')
                    ? 'bg-gray-800 text-white'
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                <Users className="mr-3 h-5 w-5" />
                Customers
              </Link>
              <Link
                to="/payments"
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                  isActive('/payments')
                    ? 'bg-gray-800 text-white'
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                <CreditCard className="mr-3 h-5 w-5" />
                Payments
              </Link>
            </nav>
            <div className="mt-auto pb-4">
              <button
                onClick={handleLogout}
                className="flex items-center px-4 py-2 text-sm font-medium text-gray-300 rounded-md hover:bg-gray-700 w-full"
              >
                <LogOut className="mr-3 h-5 w-5" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu button */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-10 bg-gray-900 flex items-center justify-between p-4">
        <Link to="/" className="flex items-center">
          <Dumbbell className="h-6 w-6 text-orange-500" />
          <span className="ml-2 text-lg font-bold text-white">FlexTrack</span>
        </Link>
        <button
          onClick={toggleMobileMenu}
          className="text-gray-300 hover:text-white focus:outline-none"
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-20 bg-gray-900 md:hidden pt-16">
          <nav className="px-4 pt-4 space-y-2">
            <Link
              to="/dashboard"
              className={`flex items-center px-4 py-3 text-base font-medium rounded-md ${
                isActive('/dashboard')
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-300 hover:bg-gray-700'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Dumbbell className="mr-3 h-5 w-5" />
              Dashboard
            </Link>
            <Link
              to="/customers"
              className={`flex items-center px-4 py-3 text-base font-medium rounded-md ${
                isActive('/customers')
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-300 hover:bg-gray-700'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Users className="mr-3 h-5 w-5" />
              Customers
            </Link>
            <Link
              to="/payments"
              className={`flex items-center px-4 py-3 text-base font-medium rounded-md ${
                isActive('/payments')
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-300 hover:bg-gray-700'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <CreditCard className="mr-3 h-5 w-5" />
              Payments
            </Link>
            <button
              onClick={() => {
                handleLogout();
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center px-4 py-3 text-base font-medium text-gray-300 rounded-md hover:bg-gray-700 w-full mt-auto"
            >
              <LogOut className="mr-3 h-5 w-5" />
              Logout
            </button>
          </nav>
        </div>
      )}

      {/* Main content */}
      <div className="flex flex-col flex-1 w-0 overflow-hidden">
        <main className="flex-1 relative overflow-y-auto focus:outline-none pt-16 md:pt-0">
          <div className="py-6 px-4 sm:px-6 md:px-8">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default Layout;