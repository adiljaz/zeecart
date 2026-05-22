import React from 'react';
import { Helmet } from 'react-helmet';
import ComingSoon from '../components/ComingSoon';
import { useSettings } from '../context/SettingsContext';

const Contact = () => {
  const { settings } = useSettings();
  return (
    <>
      <Helmet>
        <title>Contact Us | {settings?.storeName || 'Zee Cart'} Premium</title>
      </Helmet>
      <ComingSoon 
        title="Get In Touch" 
        subtitle="Our concierge team is preparing to provide you with the most seamless support experience. In the meantime, feel free to explore our collection."
      />
    </>
  );
};

export default Contact;
