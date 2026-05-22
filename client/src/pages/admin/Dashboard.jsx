import React from 'react';
import { Helmet } from 'react-helmet';
import { useSettings } from '../../context/SettingsContext';

const AdminDashboard = () => {
  const { settings } = useSettings();
  return (
    <>
      <Helmet>
        <title>Dashboard - {settings?.storeName || 'Zee Cart'} Admin</title>
      </Helmet>
      <div className="p-8">
        <h1 className="text-4xl font-playfair mb-8">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-card-bg p-6 rounded-lg">
            <h3 className="text-gray-400 mb-2">Total Products</h3>
            <p className="text-3xl font-playfair">0</p>
          </div>
          <div className="bg-card-bg p-6 rounded-lg">
            <h3 className="text-gray-400 mb-2">Total Categories</h3>
            <p className="text-3xl font-playfair">0</p>
          </div>
          <div className="bg-card-bg p-6 rounded-lg">
            <h3 className="text-gray-400 mb-2">Total Reviews</h3>
            <p className="text-3xl font-playfair">0</p>
          </div>
          <div className="bg-card-bg p-6 rounded-lg">
            <h3 className="text-gray-400 mb-2">360° Views</h3>
            <p className="text-3xl font-playfair">0</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
