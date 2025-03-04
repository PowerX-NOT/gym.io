export interface Customer {
  id?: string;
  name: string;
  phone: string;
  joining_date: string;
  membership_plan: '1-month' | '3-months' | '6-months' | '1-year';
  fee_paid: boolean;
  payment_mode?: 'Cash' | 'Online';
  next_payment_date: string;
  notes?: string;
  created_at?: string;
}

export interface Payment {
  id?: string;
  customer_id: string;
  amount: number;
  payment_date: string;
  payment_mode: 'Cash' | 'Online';
  membership_plan: '1-month' | '3-months' | '6-months' | '1-year';
  next_payment_date: string;
  notes?: string;
  created_at?: string;
}

export interface User {
  id: string;
  email: string;
}