import React from 'react';
import { Helmet } from 'react-helmet';
import ComingSoon from '../components/ComingSoon';
import { useSettings } from '../context/SettingsContext';

const About = () => {
  const { settings } = useSettings();
  return (
    <>
      <Helmet>
        <title>About Us | {settings?.storeName || 'Zee Cart'} Premium</title>
      </Helmet>
      <ComingSoon 
        title="Our Story" 
        subtitle="A journey through luxury, craftsmanship, and the evolution of fashion. We are building a narrative that reflects our commitment to excellence."
      />
    </>
  );
};

export default About;
