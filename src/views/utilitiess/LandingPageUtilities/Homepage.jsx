import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { scroller } from 'react-scroll';
import Header from './Header';
import HomeBanner from './HomeBanner';
import Footer from './Footer';
import CreditCards from './CreditCards';
import Products from './Products';
import Portfolio from './Portfolio';
import Contact from './Contact';

const Homepage = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const section = location.hash.substring(1);
      scroller.scrollTo(section, {
        smooth: true,
        duration: 500,
        offset: 120, 
      });
    }
  }, [location]);

  return (
    <>
      <Header />
      <div style={{ paddingTop: '80px' }}>
        <HomeBanner />
        {/* <CreditCards /> */}
        {/* <Products /> */}
        {/* <Portfolio /> */}
        {/* <div id="contact-section">
          <Contact />
        </div> */}
        <Footer />
      </div>
    </>
  );
};

export default Homepage;
