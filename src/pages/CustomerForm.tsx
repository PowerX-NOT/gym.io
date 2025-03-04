import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { addCustomer, getCustomerById, updateCustomer } from '../lib/supabase';
import { Customer } from '../types';
import { calculateNextPaymentDate } from '../utils/dateUtils';
import toast from 'react-hot-toast';

const CustomerForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = Boolean(id) && id !== 'new';

  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  const [customer, setCustomer] = useState<Customer>({
    name: '',
    phone: '',
    joining_date: new Date().toISOString().split('T')[0],
    membership_plan: '1-month',
    fee_paid: false,
    payment_mode: 'Cash',
    next_payment_date: '',
    notes: '',
  });

  useEffect(() => {
    if (isEditMode && id) {
      fetchCustomer();
    } else {
      // For new customers, calculate the next payment date based on today and the selected plan
      updateNextPaymentDate(customer.joining_date, customer.membership_plan);
    }
  }, [id, isEditMode]);

  const fetchCustomer = async () => {
    if (!id) return;
    
    try {
      const { data, error } = await getCustomerById(id);
      if (error) throw error;
      if (data) {
        setCustomer({
          ...data,
          joining_date: data.joining_date.split('T')[0],
          next_payment_date: data.next_payment_date.split('T')[0],
        });
      }
    } catch (error) {
      console.error('Error fetching customer:', error);
      toast.error('Failed to load customer data');
      navigate('/customers');
    } finally {
      setLoading(false);
    }
  };

  const updateNextPaymentDate = (
    startDate: string,
    plan: '1-month' | '3-months' | '6-months' | '1-year'
  ) => {
    const nextDate = calculateNextPaymentDate(startDate, plan);
    setCustomer((prev) => ({ ...prev, next_payment_date: nextDate }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setCustomer((prev) => ({ ...prev, [name]: checked }));
    } else {
      setCustomer((prev) => ({ ...prev, [name]: value }));
      
      // Recalculate next payment date when joining date or membership plan changes
      if (name === 'joining_date' || name === 'membership_plan') {
        const date = name === 'joining_date' ? value : customer.joining_date;
        const plan = name === 'membership_plan' 
          ? value as '1-month' | '3-months' | '6-months' | '1-year'
          : customer.membership_plan;
        
        updateNextPaymentDate(date, plan);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (isEditMode && id) {
        const { error } = await updateCustomer(id, customer);
        if (error) throw error;
        toast.success('Customer updated successfully');
      } else {
        const { error } = await addCustomer(customer);
        if (error) throw error;
        toast.success('Customer added successfully');
      }
      navigate('/customers');
    } catch (error) {
      console.error('Error saving customer:', error);
      toast.error(isEditMode ? 'Failed to update customer' : 'Failed to add customer');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Loading customer data...</p>
      </div>
    );
  }

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
        <h1 className="mt-2 text-2xl font-bold text-gray-900">
          {isEditMode ? 'Edit Customer' : 'Add New Customer'}
        </h1>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="name"
                  id="name"
                  required
                  value={customer.name}
                  onChange={handleChange}
                  className="shadow-sm focus:ring-orange-500 focus:border-orange-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <div className="mt-1">
                <input
                  type="tel"
                  name="phone"
                  id="phone"
                  required
                  value={customer.phone}
                  onChange={handleChange}
                  className="shadow-sm focus:ring-orange-500 focus:border-orange-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="joining_date" className="block text-sm font-medium text-gray-700">
                Joining Date
              </label>
              <div className="mt-1">
                <input
                  type="date"
                  name="joining_date"
                  id="joining_date"
                  required
                  value={customer.joining_date}
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
                  value={customer.membership_plan}
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
              <label htmlFor="next_payment_date" className="block text-sm font-medium text-gray-700">
                Next Payment Due Date
              </label>
              <div className="mt-1">
                <input
                  type="date"
                  name="next_payment_date"
                  id="next_payment_date"
                  required
                  value={customer.next_payment_date}
                  onChange={handleChange}
                  className="shadow-sm focus:ring-orange-500 focus:border-orange-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
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
                  value={customer.payment_mode}
                  onChange={handleChange}
                  className="shadow-sm focus:ring-orange-500 focus:border-orange-500 block w-full sm:text-sm border-gray-300 rounded-md"
                >
                  <option value="Cash">Cash</option>
                  <option value="Online">Online</option>
                </select>
              </div>
            </div>

            <div className="sm:col-span-6">
              <div className="flex items-center">
                <input
                  id="fee_paid"
                  name="fee_paid"
                  type="checkbox"
                  checked={customer.fee_paid}
                  onChange={handleChange}
                  className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                />
                <label htmlFor="fee_paid" className="ml-2 block text-sm text-gray-700">
                  Fee Paid
                </label>
              </div>
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
                  value={customer.notes}
                  onChange={handleChange}
                  className="shadow-sm focus:ring-orange-500 focus:border-orange-500 block w-full sm:text-sm border-gray-300 rounded-md"
                ></textarea>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={() => navigate('/customers')}
              className="mr-3 bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none disabled:opacity-50"
            >
              {submitting ? 'Saving...' : isEditMode ? 'Update Customer' : 'Add Customer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomerForm;