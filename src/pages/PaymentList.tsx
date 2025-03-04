import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Customer, Payment } from '../types';
import { formatDisplayDate } from '../utils/dateUtils';

interface PaymentWithCustomer extends Payment {
  customer?: Customer;
}

const PaymentList: React.FC = () => {
  const [payments, setPayments] = useState<PaymentWithCustomer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const { data, error } = await supabase
        .from('payments')
        .select(`
          *,
          customer:customer_id (
            id,
            name,
            phone
          )
        `)
        .order('payment_date', { ascending: false });

      if (error) throw error;
      
      setPayments(data || []);
    } catch (error) {
      console.error('Error fetching payments:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payments</h1>
          <p className="mt-1 text-sm text-gray-500">
            Track all payments made by your gym members
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link
            to="/payments/new"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none"
          >
            <Plus className="-ml-1 mr-2 h-5 w-5" />
            Record Payment
          </Link>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        {loading ? (
          <div className="px-4 py-5 sm:p-6 text-center">
            <p>Loading payments...</p>
          </div>
        ) : payments.length > 0 ? (
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
                    Customer
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
                    <td className="px-6 py-4 whitespace-nowrap">
                      {payment.customer ? (
                        <Link
                          to={`/customers/${payment.customer_id}`}
                          className="text-sm font-medium text-orange-600 hover:text-orange-900"
                        >
                          {payment.customer.name}
                        </Link>
                      ) : (
                        <span className="text-sm text-gray-500">Unknown Customer</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${payment.amount}
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
            <p className="text-gray-500">No payment records found.</p>
            <Link
              to="/payments/new"
              className="mt-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700"
            >
              Record First Payment
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentList;