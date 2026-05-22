import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import AdminSidebar from '../../components/AdminSidebar';
import { useSettings } from '../../context/SettingsContext';

const AdminReviews = () => {
  const { settings } = useSettings();
  const [reviews, setReviews] = useState([]);

  return (
    <>
      <Helmet>
        <title>Reviews - {settings?.storeName || 'Zee Cart'} Admin</title>
      </Helmet>
      <div className="flex">
        <AdminSidebar />
        <div className="flex-1 p-8">
          <h1 className="text-4xl font-playfair mb-8">Reviews</h1>
          <div className="bg-card-bg rounded-lg p-6">
            <p className="text-gray-400">Loading reviews...</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminReviews;
