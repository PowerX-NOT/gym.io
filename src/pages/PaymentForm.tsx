import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { addPayment, getCustomers, updateCustomer } from '../lib/supabase';
import { Customer } from '../types';
import { calculateNextPaymentDate } from '../utils/dateUtils';
import toast from 'react-hot-toast';

const PaymentForm: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const customerId = queryParams.get('customerId');

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [payment, setPayment] = useState({
    customer_id: customerId || '',
    amount: '',
    payment_date: new Date().toISOString().split('T')[0],
    payment_mode: 'Cash',
    membership_plan: '1-month',
    next_payment_date: '',
    notes: '',
  });

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    if (payment.customer_id && payment.membership_plan) {
      updateNextPaymentDate(payment.payment_date, payment.membership_plan);
    }
  }, [payment.customer_id, payment.payment_date, payment.membership_plan]);

  const fetchCustomers = async () => {
    try {
      const { data, error } = await getCustomers();
      if (error) throw error;
      if (data) {
        setCustomers(data);
        
        // If a customer ID is provided and exists in the data, pre-select it
        if (customerId && data.some(c => c.id === customerId)) {
          const selectedCustomer = data.find(c => c.id === customerId);
          if (selectedCustomer) {
            setPayment(prev => ({
              ...prev,
              customer_id: customerId,
              membership_plan: selectedCustomer.membership_plan,
            }));
          }
        }
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
      toast.error('Failed to load customers');
    } finally {
      setLoading(false);
    }
  };

  const updateNextPaymentDate = (
    startDate: string,
    plan: '1-month' | '3-months' | '6-months' | '1-year'
  ) => {
    const nextDate = calculateNextPaymentDate(startDate, plan);
    setPayment((prev) => ({ ...prev, next_payment_date: nextDate }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setPayment((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Add the payment record
      const { error: paymentError } = await addPayment({
        ...payment,
        amount: parseFloat(payment.amount),
      });
      
      if (paymentError) throw paymentError;
      
      // Update the customer's payment status and next payment date
      if (payment.customer_id) {
        const { error: customerError } = await updateCustomer(payment.customer_id, {
          fee_paid: true,
          next_payment_date: payment.next_payment_date,
          payment_mode: payment.payment_mode as 'Cash' | 'Online',
          membership_plan: payment.membership_plan as '1-month' | '3-months' | '6-months' | '1-year',
        });
        
        if (customerError) throw customerError;
      }
      
      toast.success('Payment recorded successfully');
      navigate(payment.customer_id ? `/customers/${payment.customer_id}` : '/payments');
    } catch (error) {
      console.error('Error recording payment:', error);
      toast.error('Failed to record payment');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back
        </button>
        <h1 className="mt-2 text-2xl font-bold text-gray-900">Record Payment</h1>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-6">
              <label htmlFor="customer_id" className="block text-sm font-medium text-gray-700">
                Customer
              </label>
              <div className="mt-1">
                <select
                  id="customer_id"
                  name="customer_id"
                  required
                  value={payment.customer_id}
                  onChange={handleChange}
                  className="shadow-sm focus:ring-orange-500 focus:border-orange-500 block w-full sm:text-sm border-gray-300 rounded-md"
                >
                  <option value="">Select a customer</option>
                  {customers.map((customer) => (
                    <option key={customer.id} value={customer.id}>
                      {customer.name} - {customer.phone}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                Amount
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  type="number"
                  name="amount"
                  id="amount"
                  required
                  min="0"
                  step="0.01"
                  value={payment.amount}
                  onChange={handleChange}
                  className="focus:ring-orange-500 focus:border-orange-500 block w-full pl-7 sm:text-sm border-gray-300 rounded-md"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="payment_date" className="block text-sm font-medium text-gray-700">
                Payment Date
              </label>
              <div className="mt-1">
                <input
                  type="date"
                  name="payment_date"
                  id="payment_date"
                  required
                  value={payment.payment_date}
                  onChange={handleChange}
                  className="shadow-sm focus:ring-orange-500 focus:border-orange-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="membership_plan" className="block text-sm font-medium text-gray-700">
                Membership Plan
              </label>
              <div className="mt-1">
                <select
                  id="membership_plan"
                  name="membership_plan"
                  required
                  value={payment.membership_plan}
                  onChange={handleChange}
                  className="shadow-sm focus:ring-orange-500 focus:border-orange-500 block w-full sm:text-sm border-gray-300 rounded-md"
                >
                  <option value="1-month">1 Month</option>
                  <option value="3-months">3 Months</option>
                  <option value="6-months">6 Months</option>
                  <option value="1-year">1 Year</option>
                </select>
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="payment_mode" className="block text-sm font-medium text-gray-700">
                Payment Mode
              </label>
              <div className="mt-1">
                <select
                  id="payment_mode"
                  name="payment_mode"
                  required
                  value={payment.payment_mode}
                  onChange={handleChange}
                  className="shadow-sm focus:ring-orange-500 focus:border-orange-500 block w-full sm:text-sm border-gray-300 rounded-md"
                >
                  <option value="Cash">Cash</option>
                  <option value="Online">Online</option>
                </select>
              </div>
            </div>

            <div className="sm:col-span-6">
              <label htmlFor="next_payment_date" className="block text-sm font-medium text-gray-700">
                Next Payment Due Date
              </label>
              <div className="mt-1">
                <input
                  type="date"
                  name="next_payment_date"
                  id="next_payment_date"
                  required
                  value={payment.next_payment_date}
                  onChange={handleChange}
                  className="shadow-sm focus:ring-orange-500 focus:border-orange-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
              <p className="mt-1 text-sm text-gray-500">
                This date will be updated on the customer's profile.
              </p>
            </div>

            <div className="sm:col-span-6">
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                Notes
              </label>
              <div className="mt-1">
                <textarea
                  id="notes"
                  name="notes"
                  rows={3}
                  value={payment.notes}
                  onChange={handleChange}
                  className="shadow-sm focus:ring-orange-500 focus:border-orange-500 block w-full sm:text-sm border-gray-300 rounded-md"
                ></textarea>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="mr-3 bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none disabled:opacity-50"
            >
              {submitting ? 'Recording...' : 'Record Payment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentForm;