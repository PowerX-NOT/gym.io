import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CustomerList from './pages/CustomerList';
import CustomerForm from './pages/CustomerForm';
import CustomerDetail from './pages/CustomerDetail';
import PaymentList from './pages/PaymentList';
import PaymentForm from './pages/PaymentForm';

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          
          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/customers"
            element={
              <ProtectedRoute>
                <Layout>
                  <CustomerList />
                </Layout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/customers/new"
            element={
              <ProtectedRoute>
                <Layout>
                  <CustomerForm />
                </Layout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/customers/:id"
            element={
              <ProtectedRoute>
                <Layout>
                  <CustomerDetail />
                </Layout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/customers/:id/edit"
            element={
              <ProtectedRoute>
                <Layout>
                  <CustomerForm />
                </Layout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/payments"
            element={
              <ProtectedRoute>
                <Layout>
                  <PaymentList />
                </Layout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/payments/new"
            element={
              <ProtectedRoute>
                <Layout>
                  <PaymentForm />
                </Layout>
              </ProtectedRoute>
            }
          />
          
          {/* Redirect any unknown routes to dashboard if logged in, or home if not */}
          <Route
            path="*"
            element={
              <ProtectedRoute>
                <Navigate to="/dashboard" replace />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
