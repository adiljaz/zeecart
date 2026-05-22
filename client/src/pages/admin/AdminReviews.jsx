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
      <div className="flex bg-warm-white min-h-screen">
        <AdminSidebar />
        <div className="flex-1 p-4 md:p-8 overflow-x-hidden">
          <h1 className="text-3xl md:text-4xl font-serif font-black text-navy mb-8 pt-20 md:pt-0">Reviews</h1>
          <div className="bg-card-bg rounded-[2rem] p-6 md:p-10 shadow-premium border border-border">
            <p className="text-navy/40 text-[10px] font-black uppercase tracking-widest text-center">No reviews available</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminReviews;
