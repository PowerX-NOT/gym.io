import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase client
// Note: In a production environment, these would be environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Authentication functions
export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  const { data } = await supabase.auth.getUser();
  return data?.user;
};

// Customer management functions
export const getCustomers = async (searchTerm = '', filterBy = '') => {
  let query = supabase.from('customers').select('*');

  if (searchTerm) {
    query = query.or(`name.ilike.%${searchTerm}%,phone.ilike.%${searchTerm}%`);
  }

  if (filterBy === 'due') {
    const today = new Date().toISOString().split('T')[0];
    query = query.lte('next_payment_date', today);
  } else if (filterBy === 'paid') {
    query = query.eq('fee_paid', true);
  } else if (filterBy === 'unpaid') {
    query = query.eq('fee_paid', false);
  }

  const { data, error } = await query.order('joining_date', { ascending: false });
  return { data, error };
};

export const addCustomer = async (customer: any) => {
  const { data, error } = await supabase.from('customers').insert([customer]).select();
  return { data, error };
};

export const updateCustomer = async (id: string, updates: any) => {
  const { data, error } = await supabase
    .from('customers')
    .update(updates)
    .eq('id', id)
    .select();
  return { data, error };
};

export const deleteCustomer = async (id: string) => {
  const { error } = await supabase.from('customers').delete().eq('id', id);
  return { error };
};

export const getCustomerById = async (id: string) => {
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .eq('id', id)
    .single();
  return { data, error };
};

// Payment functions
export const addPayment = async (payment: any) => {
  const { data, error } = await supabase.from('payments').insert([payment]).select();
  return { data, error };
};

export const getPaymentsByCustomerId = async (customerId: string) => {
  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .eq('customer_id', customerId)
    .order('payment_date', { ascending: false });
  return { data, error };
};