import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, CreditCard, AlertTriangle, TrendingUp } from 'lucide-react';
import { getCustomers } from '../lib/supabase';
import { Customer } from '../types';
import { isPaymentOverdue } from '../utils/dateUtils';

const Dashboard: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCustomers: 0,
    activeCustomers: 0,
    overduePayments: 0,
    recentPayments: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await getCustomers();
        if (error) throw error;
        
        if (data) {
          setCustomers(data);
          
          // Calculate stats
          const overdueCount = data.filter(customer => 
            !customer.fee_paid || isPaymentOverdue(customer.next_payment_date)
          ).length;
          
          const activeCount = data.filter(customer => 
            customer.fee_paid && !isPaymentOverdue(customer.next_payment_date)
          ).length;
          
          // Get payments from the last 30 days
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
          
          setStats({
            totalCustomers: data.length,
            activeCustomers: activeCount,
            overduePayments: overdueCount,
            recentPayments: 0, // This would be calculated from payments table
          });
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Get customers with overdue payments
  const overdueCustomers = customers.filter(
    customer => !customer.fee_paid || isPaymentOverdue(customer.next_payment_date)
  ).slice(0, 5);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Overview of your gym's performance and member status
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <p>Loading dashboard data...</p>
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Users className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Total Members
                      </dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900">
                          {stats.totalCustomers}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <div className="text-sm">
                  <Link
                    to="/customers"
                    className="font-medium text-orange-600 hover:text-orange-500"
                  >
                    View all
                  </Link>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <TrendingUp className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Active Members
                      </dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900">
                          {stats.activeCustomers}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <div className="text-sm">
                  <Link
                    to="/customers"
                    className="font-medium text-orange-600 hover:text-orange-500"
                  >
                    View details
                  </Link>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <AlertTriangle className="h-6 w-6 text-red-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Overdue Payments
                      </dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900">
                          {stats.overduePayments}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <div className="text-sm">
                  <Link
                    to="/customers?filter=due"
                    className="font-medium text-orange-600 hover:text-orange-500"
                  >
                    View all
                  </Link>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <CreditCard className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Recent Payments
                      </dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900">
                          {stats.recentPayments}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <div className="text-sm">
                  <Link
                    to="/payments"
                    className="font-medium text-orange-600 hover:text-orange-500"
                  >
                    View all
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Overdue Payments Section */}
          <div className="mt-8">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900">Overdue Payments</h2>
              <Link
                to="/customers?filter=due"
                className="text-sm font-medium text-orange-600 hover:text-orange-500"
              >
                View all
              </Link>
            </div>
            <div className="mt-4 bg-white shadow overflow-hidden sm:rounded-md">
              {overdueCustomers.length > 0 ? (
                <ul className="divide-y divide-gray-200">
                  {overdueCustomers.map((customer) => (
                    <li key={customer.id}>
                      <Link
                        to={`/customers/${customer.id}`}
                        className="block hover:bg-gray-50"
                      >
                        <div className="px-4 py-4 sm:px-6">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-orange-600 truncate">
                              {customer.name}
                            </p>
                            <div className="ml-2 flex-shrink-0 flex">
                              <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                Overdue
                              </p>
                            </div>
                          </div>
                          <div className="mt-2 sm:flex sm:justify-between">
                            <div className="sm:flex">
                              <p className="flex items-center text-sm text-gray-500">
                                {customer.phone}
                              </p>
                              <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                                {customer.membership_plan}
                              </p>
                            </div>
                            <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                              <p>
                                Due: {new Date(customer.next_payment_date).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="px-4 py-5 sm:p-6 text-center">
                  <p className="text-sm text-gray-500">No overdue payments found.</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8">
            <h2 className="text-lg font-medium text-gray-900">Quick Actions</h2>
            <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium text-gray-900">Add New Member</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Register a new member to your gym.
                  </p>
                  <div className="mt-4">
                    <Link
                      to="/customers/new"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700"
                    >
                      Add Member
                    </Link>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium text-gray-900">Record Payment</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Record a new payment for an existing member.
                  </p>
                  <div className="mt-4">
                    <Link
                      to="/payments/new"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700"
                    >
                      Record Payment
                    </Link>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium text-gray-900">View All Members</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    See a complete list of all your gym members.
                  </p>
                  <div className="mt-4">
                    <Link
                      to="/customers"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700"
                    >
                      View Members
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;