/*
  # Initial schema for FlexTrack Gym Management System

  1. New Tables
    - `customers`
      - `id` (uuid, primary key)
      - `name` (text, not null)
      - `phone` (text, not null)
      - `joining_date` (timestamptz, not null)
      - `membership_plan` (text, not null)
      - `fee_paid` (boolean, not null)
      - `payment_mode` (text)
      - `next_payment_date` (timestamptz, not null)
      - `notes` (text)
      - `created_at` (timestamptz, default now())
    
    - `payments`
      - `id` (uuid, primary key)
      - `customer_id` (uuid, foreign key to customers.id)
      - `amount` (numeric, not null)
      - `payment_date` (timestamptz, not null)
      - `payment_mode` (text, not null)
      - `membership_plan` (text, not null)
      - `next_payment_date` (timestamptz, not null)
      - `notes` (text)
      - `created_at` (timestamptz, default now())
  
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their data
*/

-- Create customers table
CREATE TABLE IF NOT EXISTS customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phone text NOT NULL,
  joining_date timestamptz NOT NULL,
  membership_plan text NOT NULL,
  fee_paid boolean NOT NULL DEFAULT false,
  payment_mode text,
  next_payment_date timestamptz NOT NULL,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  amount numeric NOT NULL,
  payment_date timestamptz NOT NULL,
  payment_mode text NOT NULL,
  membership_plan text NOT NULL,
  next_payment_date timestamptz NOT NULL,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Create policies for customers table
CREATE POLICY "Authenticated users can read customers"
  ON customers
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert customers"
  ON customers
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update customers"
  ON customers
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete customers"
  ON customers
  FOR DELETE
  TO authenticated
  USING (true);

-- Create policies for payments table
CREATE POLICY "Authenticated users can read payments"
  ON payments
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert payments"
  ON payments
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update payments"
  ON payments
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete payments"
  ON payments
  FOR DELETE
  TO authenticated
  USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS customers_name_idx ON customers (name);
CREATE INDEX IF NOT EXISTS customers_phone_idx ON customers (phone);
CREATE INDEX IF NOT EXISTS customers_next_payment_date_idx ON customers (next_payment_date);
CREATE INDEX IF NOT EXISTS payments_customer_id_idx ON payments (customer_id);
CREATE INDEX IF NOT EXISTS payments_payment_date_idx ON payments (payment_date);