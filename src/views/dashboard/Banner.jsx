import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

// material-ui
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import { BaseUrl } from 'BaseUrl';

// AuthImage component to fetch images with authentication
const AuthImage = ({ filePath }) => {
  const [src, setSrc] = useState('');
  const user = JSON.parse(sessionStorage.getItem('user'));

  useEffect(() => {
    if (!filePath) return;

    const fetchImage = async () => {
      try {
        const response = await axios.get(`${BaseUrl}/file/downloadFile/?filePath=${encodeURIComponent(filePath)}`, {
          headers: {
            Authorization: `Bearer ${user?.accessToken}`
          },
          responseType: 'blob'
        });
        const blob = new Blob([response.data], { type: response.headers['content-type'] });
        const imageUrl = URL.createObjectURL(blob);
        setSrc(imageUrl);
      } catch (error) {
        console.error('Error fetching image:', error);
        setSrc('');
      }
    };

    fetchImage();
  
    return () => {
      if (src) {
        URL.revokeObjectURL(src);
      }
    };
  }, [filePath, user?.accessToken]);

  return src ? (
    <img
      src={src}
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'cover'
      }}
      alt="Advertisement"
    />
  ) : (
    'Loading...'
  );
};

const fetchBanner = async (headers) => {
  try {
    const response = await fetch(`${BaseUrl}/advertisement/v1/queryAllAdvertisement`, {
      method: 'GET',
      headers: headers
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching banner data:', error);
    return [];
  }
};

const Banner = () => {
  const [advertisement, setAdvertisement] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  const user = JSON.parse(sessionStorage.getItem('user'));
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${user?.accessToken}`
  };

  useEffect(() => {
    const FetchData = async () => {
      setLoading(true);
      try {
        const fetchedData = await fetchBanner(headers);
        if (fetchedData.length > 0) {
          const tableData = fetchedData.map((p) => ({
            advertisementId: p.advertisementId,
            filePath: p.filePath || null
          }));
          setAdvertisement(tableData);
        } else {
          setAdvertisement([]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    FetchData();
  }, []);

  // Auto-play functionality
  useEffect(() => {
    if (advertisement.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % advertisement.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [advertisement.length]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % advertisement.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + advertisement.length) % advertisement.length);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  return (
    <Box
      sx={{
        width: '100%',
        height: { xs: 300, sm: 400, md: 450 },
        position: 'relative',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
        border: '1px solid #e2e8f0',
      }}
    >
      <Box sx={{ width: '100%', height: '100%', position: 'relative' }}>
        {loading ? (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              background: '#f8fafc',
            }}
          >
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                border: '3px solid #e2e8f0',
                borderTop: '3px solid #2a9d8f',
                animation: 'spin 1s linear infinite',
                '@keyframes spin': {
                  '0%': { transform: 'rotate(0deg)' },
                  '100%': { transform: 'rotate(360deg)' },
                },
              }}
            />
          </Box>
        ) : (
          <Box sx={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
            {advertisement.length > 0 ? (
              <>
                <Box
                  sx={{
                    display: 'flex',
                    width: `${advertisement.length * 100}%`,
                    height: '100%',
                    transform: `translateX(-${(currentIndex * 100) / advertisement.length}%)`,
                    transition: 'transform 0.5s ease-in-out',
                  }}
                >
                  {advertisement.map((ad, index) =>
                    ad.filePath ? (
                      <Box
                        key={ad.advertisementId}
                        sx={{
                          width: `${100 / advertisement.length}%`,
                          height: '100%',
                          flexShrink: 0,
                          position: 'relative',
                          '& img': {
                            borderRadius: '16px',
                          },
                        }}
                      >
                        <AuthImage filePath={ad.filePath} />
                      </Box>
                    ) : null
                  )}
                </Box>
                
                {/* Navigation arrows */}
                {advertisement.length > 1 && (
                  <>
                    <IconButton
                      onClick={prevSlide}
                      sx={{
                        position: 'absolute',
                        left: 16,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        color: '#374151',
                        width: 44,
                        height: 44,
                        transition: 'all 0.2s ease',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        '&:hover': { 
                          backgroundColor: 'white',
                          transform: 'translateY(-50%) scale(1.05)',
                          boxShadow: '0 6px 20px rgba(0,0,0,0.2)',
                        },
                        '& svg': {
                          fontSize: '1.25rem',
                        },
                      }}
                    >
                      <ChevronLeftIcon />
                    </IconButton>
                    <IconButton
                      onClick={nextSlide}
                      sx={{
                        position: 'absolute',
                        right: 16,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        color: '#374151',
                        width: 44,
                        height: 44,
                        transition: 'all 0.2s ease',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        '&:hover': { 
                          backgroundColor: 'white',
                          transform: 'translateY(-50%) scale(1.05)',
                          boxShadow: '0 6px 20px rgba(0,0,0,0.2)',
                        },
                        '& svg': {
                          fontSize: '1.25rem',
                        },
                      }}
                    >
                      <ChevronRightIcon />
                    </IconButton>
                  </>
                )}
                
                {/* Indicators */}
                {advertisement.length > 1 && (
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 20,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      display: 'flex',
                      gap: 1.5,
                    }}
                  >
                    {advertisement.map((_, index) => (
                      <Box
                        key={index}
                        onClick={() => goToSlide(index)}
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          backgroundColor: index === currentIndex ? '#2a9d8f' : 'rgba(255, 255, 255, 0.6)',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            backgroundColor: index === currentIndex ? '#03045e' : 'rgba(255, 255, 255, 0.9)',
                            transform: 'scale(1.2)',
                          },
                        }}
                      />
                    ))}
                  </Box>
                )}
              </>
            ) : (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                  background: '#f8fafc',
                  color: '#64748b',
                  fontSize: '1rem',
                  fontWeight: 500,
                }}
              >
                No advertisements available
              </Box>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};

Banner.propTypes = {
  isLoading: PropTypes.bool
};

export default Banner;