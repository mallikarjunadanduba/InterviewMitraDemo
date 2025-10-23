import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import Header from './Header';
import Footer from './Footer';
import { BaseUrl } from 'BaseUrl';

const ViewmoreSuccess = () => {
  const [successStories, setSuccessStories] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const ImageUrl = `${BaseUrl}/file/downloadFile/?filePath=`;

  useEffect(() => {
    const fetchSuccessStories = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${BaseUrl}/success/v1/getAllSuccessStoryByPagination/${page}/20?pageNumber=${page}&pageSize=20`
        );
        const data = await response.json();
        setSuccessStories(data.content);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error('Error fetching success stories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSuccessStories();
  }, [page]);

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setPage(newPage);
    }
  };

  const successCardStyle = {
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

  const successCardHover = {
    scale: 1.05,
    boxShadow: '0 12px 24px rgba(0, 0, 0, 0.3)',
  };

  const successImageStyle = {
    width: '100%',
    height: 'auto',
    borderRadius: '10px',
  };

  const successCardsGridStyle = {
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
      <br />
      <div style={successCardsGridStyle}>
        {successStories.map((story) => (
          <motion.div
            key={story.successstoryId}
            style={successCardStyle}
            whileHover={successCardHover}
          >
            <img
              src={ImageUrl + story.photoPath} // Ensure correct path
              alt={story.successstoryName}
              style={successImageStyle}
            />
            <h3>{story.successstoryName}</h3>
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
      <br />
      <br />
      <Footer />
    </>
  );
};

export default ViewmoreSuccess;