# FlexTrack - Gym Management System

FlexTrack is a modern, responsive web application designed to help gym owners efficiently manage their gym operations. This system streamlines customer management, payment tracking, and business insights in one intuitive interface.

![FlexTrack Dashboard](https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80)

## Features

- **Customer Management**: Add, view, update, and delete customer records
- **Payment Tracking**: Record and monitor membership fees and payment history
- **Dashboard**: Get quick insights into gym performance and member status
- **Responsive Design**: Works seamlessly on desktops, tablets, and smartphones
- **Secure Authentication**: Protects sensitive customer data

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **State Management**: React Context API
- **Routing**: React Router
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **UI Components**: Custom components with Lucide React icons
- **Notifications**: React Hot Toast

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/flextrack.git
   cd flextrack
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Start the development server:
   ```
   npm run dev
   ```

## Connecting to Supabase

### Setting Up Supabase

1. Create a Supabase account at [supabase.com](https://supabase.com)
2. Create a new project
3. Navigate to Project Settings > API to find your project URL and anon key
4. Add these credentials to your `.env` file

### Database Schema

The application requires two main tables:

1. **customers**:
   - id (uuid, primary key)
   - name (text)
   - phone (text)
   - joining_date (timestamptz)
   - membership_plan (text)
   - fee_paid (boolean)
   - payment_mode (text)
   - next_payment_date (timestamptz)
   - notes (text)
   - created_at (timestamptz)

2. **payments**:
   - id (uuid, primary key)
   - customer_id (uuid, foreign key to customers.id)
   - amount (numeric)
   - payment_date (timestamptz)
   - payment_mode (text)
   - membership_plan (text)
   - next_payment_date (timestamptz)
   - notes (text)
   - created_at (timestamptz)

### Running Migrations

The database schema can be set up using the migration file in the `supabase/migrations` directory:

1. Install Supabase CLI
2. Link your project: `supabase link --project-ref your-project-ref`
3. Run migrations: `supabase db push`

Alternatively, you can manually execute the SQL in the migration file through the Supabase SQL Editor.

## Usage Guide

### Authentication

1. Navigate to the login page
2. Enter your credentials (default demo: admin@flextrack.com / password123)
3. Upon successful login, you'll be redirected to the dashboard

### Managing Customers

#### Adding a New Customer
1. Navigate to Customers > Add Customer
2. Fill in the required details (name, phone, joining date, etc.)
3. Click "Add Customer"

#### Viewing Customer Details
1. Navigate to Customers
2. Click on a customer's name to view their details
3. View payment history and membership information

#### Updating Customer Information
1. Navigate to the customer's detail page
2. Click "Edit"
3. Update the necessary information
4. Click "Update Customer"

#### Deleting a Customer
1. Navigate to the customer's detail page
2. Click "Delete"
3. Confirm deletion in the popup

### Recording Payments

#### Adding a New Payment
1. Navigate to Payments > Record Payment
   - Or from a customer's detail page, click "Record Payment"
2. Select the customer (if not already selected)
3. Enter payment details (amount, date, plan, etc.)
4. Click "Record Payment"

#### Viewing Payment History
1. Navigate to Payments to see all payments
2. Or view a specific customer's payment history on their detail page

### Dashboard

The dashboard provides an overview of:
- Total members
- Active members
- Overdue payments
- Recent payments
- Quick access to common actions

## Deployment

### Building for Production

```
npm run build
```

This creates a `dist` folder with optimized production files.

### Hosting Options

- **Netlify**: Connect your GitHub repository for continuous deployment
- **Vercel**: Similar to Netlify, with automatic deployments
- **Firebase Hosting**: Good option if you're using other Firebase services
- **GitHub Pages**: Simple option for static hosting

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Supabase](https://supabase.com/)
- [Lucide Icons](https://lucide.dev/)
- [React Router](https://reactrouter.com/)