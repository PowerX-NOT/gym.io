import React from 'react';
import { Link } from 'react-router-dom';
import { Dumbbell, ArrowRight, Users, CreditCard, BarChart } from 'lucide-react';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero Section */}
      <div className="relative bg-gray-900">
        <div className="absolute inset-0">
          <img
            className="w-full h-full object-cover"
            src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
            alt="Gym equipment"
          />
          <div className="absolute inset-0 bg-black opacity-70"></div>
        </div>
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center">
              <Dumbbell className="h-16 w-16 text-orange-500" />
            </div>
            <h1 className="mt-4 text-4xl font-extrabold text-white sm:text-5xl sm:tracking-tight lg:text-6xl">
              FlexTrack
            </h1>
            <p className="mt-6 max-w-lg mx-auto text-xl text-gray-300">
              Streamline your gym management. Elevate your business.
            </p>
            <div className="mt-10">
              <Link
                to="/login"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700"
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base font-semibold text-orange-600 tracking-wide uppercase">
              Features
            </h2>
            <p className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight">
              Everything you need to manage your gym
            </p>
            <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">
              Simplify operations, boost efficiency, and focus on growing your fitness business.
            </p>
          </div>

          <div className="mt-16">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              <div className="pt-6">
                <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-orange-500 rounded-md shadow-lg">
                        <Users className="h-6 w-6 text-white" aria-hidden="true" />
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">
                      Customer Management
                    </h3>
                    <p className="mt-5 text-base text-gray-500">
                      Easily add, update, and manage member profiles with comprehensive details and membership history.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-orange-500 rounded-md shadow-lg">
                        <CreditCard className="h-6 w-6 text-white" aria-hidden="true" />
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">
                      Payment Tracking
                    </h3>
                    <p className="mt-5 text-base text-gray-500">
                      Track payments, manage dues, and get automatic notifications for overdue payments.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-orange-500 rounded-md shadow-lg">
                        <BarChart className="h-6 w-6 text-white" aria-hidden="true" />
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">
                      Business Insights
                    </h3>
                    <p className="mt-5 text-base text-gray-500">
                      Get valuable insights into your gym's performance with intuitive dashboards and reports.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center">
            <Dumbbell className="h-10 w-10 text-orange-500" />
          </div>
          <p className="mt-4 text-center text-base text-gray-400">
            &copy; 2025 FlexTrack. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;