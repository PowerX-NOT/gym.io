import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, CreditCard } from 'lucide-react';
import { deleteCustomer, getCustomerById, getPaymentsByCustomerId } from '../lib/supabase';
import { Customer, Payment } from '../types';
import { formatDisplayDate, isPaymentOverdue } from '../utils/dateUtils';
import ConfirmationModal from '../components/ConfirmationModal';
import toast from 'react-hot-toast';

const CustomerDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    fetchCustomerData();
  }, [id]);

  const fetchCustomerData = async () => {
    try {
      const [customerResponse, paymentsResponse] = await Promise.all([
        getCustomerById(id!),
        getPaymentsByCustomerId(id!)
      ]);
      
      if (customerResponse.error) throw customerResponse.error;
      if (paymentsResponse.error) throw paymentsResponse.error;
      
      setCustomer(customerResponse.data || null);
      setPayments(paymentsResponse.data || []);
    } catch (error) {
      console.error('Error fetching customer data:', error);
      toast.error('Failed to load customer data');
      navigate('/customers');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      const { error } = await deleteCustomer(id!);
      if (error) throw error;
      
      toast.success('Customer deleted successfully');
      navigate('/customers');
    } catch (error) {
      console.error('Error deleting customer:', error);
      toast.error('Failed to delete customer');
    } finally {
      setShowDeleteModal(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Loading customer data...</p>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-gray-600">Customer not found</p>
        <Link to="/customers" className="mt-4 text-orange-600 hover:text-orange-500">
          Back to Customers
        </Link>
      </div>
    );
  }

  const isOverdue = isPaymentOverdue(customer.next_payment_date);

  return (
    <div>
      <div className="mb-6">
        <button
          onClick={() => navigate('/customers')}
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Customers
        </button>
        <div className="mt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold text-gray-900">{customer.name}</h1>
          <div className="mt-2 sm:mt-0 flex space-x-2">
            <Link
              to={`/customers/${id}/edit`}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
            >
              <Edit className="-ml-0.5 mr-2 h-4 w-4" />
              Edit
            </Link>
            <button
              onClick={handleDeleteClick}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none"
            >
              <Trash2 className="-ml-0.5 mr-2 h-4 w-4" />
              Delete
            </button>
            <Link
              to={`/payments/new?customerId=${id}`}
              className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none"
            >
              <CreditCard className="-ml-0.5 mr-2 h-4 w-4" />
              Record Payment
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">Customer Information</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Personal details and membership.</p>
          </div>
          <span
            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
              customer.fee_paid
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {customer.fee_paid ? 'Paid' : 'Unpaid'}
          </span>
        </div>
        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Full name</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{customer.name}</dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Phone number</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{customer.phone}</dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Joining date</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {formatDisplayDate(customer.joining_date)}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Membership plan</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {customer.membership_plan}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Next payment due</dt>
              <dd className={`mt-1 text-sm sm:mt-0 sm:col-span-2 ${
                isOverdue && !customer.fee_paid ? 'text-red-600 font-medium' : 'text-gray-900'
              }`}>
                {formatDisplayDate(customer.next_payment_date)}
                {isOverdue && !customer.fee_paid && ' (Overdue)'}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Payment mode</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {customer.payment_mode}
              </dd>
            </div>
            {customer.notes && (
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Notes</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {customer.notes}
                </dd>
              </div>
            )}
          </dl>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Payment History</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Record of all payments made by this customer.
          </p>
        </div>
        <div className="border-t border-gray-200">
          {payments.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Date
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Amount
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Plan
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Payment Mode
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Next Due Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {payments.map((payment) => (
                    <tr key={payment.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDisplayDate(payment.payment_date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ₹{payment.amount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {payment.membership_plan}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {payment.payment_mode}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDisplayDate(payment.next_payment_date)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="px-4 py-5 sm:p-6 text-center">
              <p className="text-sm text-gray-500">No payment records found.</p>
              <Link
                to={`/payments/new?customerId=${id}`}
                className="mt-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700"
              >
                Record First Payment
              </Link>
            </div>
          )}
        </div>
      </div>

      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Delete Customer"
        message="Are you sure you want to delete this customer? All associated payment records will also be deleted. This action cannot be undone."
      />
    </div>
  );
};

export default CustomerDetail;
