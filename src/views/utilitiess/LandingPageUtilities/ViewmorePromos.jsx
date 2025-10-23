import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import Header from './Header';
import Footer from './Footer';
import { BaseUrl } from 'BaseUrl';
import Contact from './Contact';

const ViewmorePromos = () => {
  const [promos, setPromos] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPromos = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${BaseUrl}/promo/v1/getAllPromoByPagination/${page}/20?pageNumber=${page}&pageSize=20`
        );
        const data = await response.json();
        setPromos(data.content);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error('Error fetching promotions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPromos();
  }, [page]);

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setPage(newPage);
    }
  };

  const promoCardStyle = {
    backgroundColor: '#fff',
    border: '1px solid #ddd',
    borderRadius: '15px',
    overflow: 'hidden',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
    textAlign: 'center',
    padding: '20px',
    transition: 'transform 0.3s, box-shadow 0.3s',
    cursor: 'pointer',
  };

  const promoCardHover = {
    scale: 1.05,
    boxShadow: '0 12px 24px rgba(0, 0, 0, 0.3)',
  };

  const promoVideoStyle = {
    marginBottom: '15px',
    width: '100%',
    height: 'auto',
    aspectRatio: '16 / 9',
  };

  const promoCardsGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)',
    gap: '20px',
    margin: '20px',
  };

  const paginationStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '10px',
    marginTop: '20px',
  };

  const paginationButtonStyle = {
    padding: '10px 20px',
    backgroundColor: '#2a9d8f',
    color: 'white',
    border: 'none',
    borderRadius: '25px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  };

  const paginationButtonDisabledStyle = {
    backgroundColor: '#ccc',
    cursor: 'not-allowed',
  };

  const paginationTextStyle = {
    fontSize: '1.2em',
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <br/>
      <div style={promoCardsGridStyle}>
        {promos.map((promo) => (
          <motion.div
            key={promo.promoId}
            style={promoCardStyle}
            whileHover={promoCardHover}
          >
            <div style={promoVideoStyle}>
              <iframe
                title="promo-video"
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${promo.youTube}`}
                frameBorder="0"
                allowFullScreen
              ></iframe>
            </div>
            <h3>{promo.promoName}</h3>
          </motion.div>
        ))}
      </div>
      <div style={paginationStyle}>
        <button
          onClick={() => handlePageChange(page - 1)}
          style={page === 0 ? { ...paginationButtonStyle, ...paginationButtonDisabledStyle } : paginationButtonStyle}
          disabled={page === 0}
        >
          <FaArrowLeft /> Previous
        </button>
        <span style={paginationTextStyle}>
          Page {page + 1} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(page + 1)}
          style={page === totalPages - 1 ? { ...paginationButtonStyle, ...paginationButtonDisabledStyle } : paginationButtonStyle}
          disabled={page === totalPages - 1}
        >
          Next <FaArrowRight />
        </button>
      </div>
      <br/><br/>
       {/* Add the Contact section with the correct id */}
       <div id="contact-section">
        <Contact/>
      </div>
      <Footer />
      <Footer />
    </>
  );
};

export default ViewmorePromos;