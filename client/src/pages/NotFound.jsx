import React from 'react';
import { Helmet } from 'react-helmet';
import ComingSoon from '../components/ComingSoon';
import { useSettings } from '../context/SettingsContext';

const NotFound = () => {
  const { settings } = useSettings();
  return (
    <>
      <Helmet>
        <title>Page Not Found | {settings?.storeName || 'Zee Cart'} Premium</title>
      </Helmet>
      <ComingSoon 
        title="Coming Soon" 
        subtitle="This page is currently under development. We are meticulously crafting every pixel to ensure it meets our premium standards. Please check back later."
      />
    </>
  );
};

export default NotFound;
