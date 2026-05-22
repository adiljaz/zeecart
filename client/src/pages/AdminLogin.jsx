import React from 'react';
import { Helmet } from 'react-helmet';
import { useSettings } from '../context/SettingsContext';

const AdminLogin = () => {
  const { settings } = useSettings();
  return (
    <>
      <Helmet>
        <title>Admin Login - {settings?.storeName || 'Zee Cart'}</title>
      </Helmet>
      <div className="text-center py-20">
        <h1 className="text-4xl font-playfair mb-4">Admin Access</h1>
        <p className="text-gray-400">This area is restricted to administrators only.</p>
      </div>
    </>
  );
};

export default AdminLogin;
