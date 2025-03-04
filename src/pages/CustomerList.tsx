import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Plus, Filter, X, Edit, Trash2 } from 'lucide-react';
import { getCustomers, deleteCustomer } from '../lib/supabase';
import { Customer } from '../types';
import { formatDisplayDate, isPaymentOverdue } from '../utils/dateUtils';
import ConfirmationModal from '../components/ConfirmationModal';
import toast from 'react-hot-toast';

const CustomerList: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<string | null>(null);
  
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const filterParam = queryParams.get('filter');
    if (filterParam) {
      setFilterBy(filterParam);
    }
  }, [location]);

  useEffect(() => {
    fetchCustomers();
  }, [filterBy]);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const { data, error } = await getCustomers(searchTerm, filterBy);
      if (error) throw error;
      if (data) {
        setCustomers(data);
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
      toast.error('Failed to load customers');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCustomers();
  };

  const handleFilterChange = (newFilter: string) => {
    setFilterBy(newFilter);
    navigate(newFilter ? `?filter=${newFilter}` : '');
  };

  const handleDeleteClick = (id: string) => {
    setCustomerToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!customerToDelete) return;
    
    try {
      const { error } = await deleteCustomer(customerToDelete);
      if (error) throw error;
      
      setCustomers(customers.filter(c => c.id !== customerToDelete));
      toast.success('Customer deleted successfully');
    } catch (error) {
      console.error('Error deleting customer:', error);
      toast.error('Failed to delete customer');
    } finally {
      setShowDeleteModal(false);
      setCustomerToDelete(null);
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your gym members and their memberships
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link
            to="/customers/new"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none"
          >
            <Plus className="-ml-1 mr-2 h-5 w-5" />
            Add Customer
          </Link>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-4 border-b border-gray-200 sm:p-6 sm:flex sm:items-center sm:justify-between">
          <form onSubmit={handleSearch} className="sm:flex-1 sm:flex sm:items-center">
            <div className="relative rounded-md shadow-sm w-full sm:max-w-xs">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="focus:ring-orange-500 focus:border-orange-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                placeholder="Search customers..."
              />
            </div>
            <button
              type="submit"
              className="mt-3 w-full sm:mt-0 sm:ml-3 sm:w-auto inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
            >
              Search
            </button>
          </form>

          <div className="mt-4 sm:mt-0 flex flex-wrap items-center">
            <span className="mr-2 text-sm text-gray-500 hidden sm:inline">Filter:</span>
            <div className="flex space-x-2 mt-2 sm:mt-0">
              <button
                onClick={() => handleFilterChange('')}
                className={`px-3 py-1 rounded-md text-sm ${
                  filterBy === ''
                    ? 'bg-orange-100 text-orange-800'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => handleFilterChange('due')}
                className={`px-3 py-1 rounded-md text-sm ${
                  filterBy === 'due'
                    ? 'bg-orange-100 text-orange-800'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                Payment Due
              </button>
              <button
                onClick={() => handleFilterChange('paid')}
                className={`px-3 py-1 rounded-md text-sm ${
                  filterBy === 'paid'
                    ? 'bg-orange-100 text-orange-800'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                Paid
              </button>
              <button
                onClick={() => handleFilterChange('unpaid')}
                className={`px-3 py-1 rounded-md text-sm ${
                  filterBy === 'unpaid'
                    ? 'bg-orange-100 text-orange-800'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                Unpaid
              </button>
            </div>
            {filterBy && (
              <button
                onClick={() => handleFilterChange('')}
                className="ml-2 text-gray-400 hover:text-gray-500"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="px-4 py-5 sm:p-6 text-center">
            <p>Loading customers...</p>
          </div>
        ) : customers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Phone
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Membership
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Next Payment
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {customers.map((customer) => {
                  const isOverdue = isPaymentOverdue(customer.next_payment_date);
                  return (
                    <tr key={customer.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          <Link
                            to={`/customers/${customer.id}`}
                            className="hover:text-orange-600"
                          >
                            {customer.name}
                          </Link>
                        </div>
                        <div className="text-sm text-gray-500">
                          Joined: {formatDisplayDate(customer.joining_date)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {customer.phone}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {customer.membership_plan}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            customer.fee_paid
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {customer.fee_paid ? 'Paid' : 'Unpaid'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span
                          className={
                            isOverdue && !customer.fee_paid
                              ? 'text-red-600 font-medium'
                              : ''
                          }
                        >
                          {formatDisplayDate(customer.next_payment_date)}
                          {isOverdue && !customer.fee_paid && ' (Overdue)'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <Link
                            to={`/customers/${customer.id}/edit`}
                            className="text-orange-600 hover:text-orange-900"
                          >
                            <Edit className="h-5 w-5" />
                          </Link>
                          <button
                            onClick={() => handleDeleteClick(customer.id!)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="px-4 py-5 sm:p-6 text-center">
            <p className="text-gray-500">No customers found.</p>
            {(searchTerm || filterBy) && (
              <p className="mt-2 text-sm text-gray-500">
                Try adjusting your search or filter criteria.
              </p>
            )}
          </div>
        )}
      </div>

      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Delete Customer"
        message="Are you sure you want to delete this customer? This action cannot be undone."
      />
    </div>
  );
};

export default CustomerList;