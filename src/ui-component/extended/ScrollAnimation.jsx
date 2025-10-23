import React from 'react';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import useIntersectionObserver from '../../hooks/useIntersectionObserver';

/**
 * ScrollAnimation component that triggers animations when element comes into view
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to animate
 * @param {string} props.animation - Animation type ('fadeIn', 'slideUp', 'slideDown', 'slideLeft', 'slideRight', 'scaleIn', 'rotateIn')
 * @param {number} props.delay - Animation delay in seconds
 * @param {number} props.duration - Animation duration in seconds
 * @param {number} props.threshold - Intersection observer threshold
 * @param {string} props.rootMargin - Intersection observer root margin
 * @param {boolean} props.triggerOnce - Whether to trigger animation only once
 * @param {Object} props.customVariants - Custom animation variants
 */
const ScrollAnimation = ({
  children,
  animation = 'fadeIn',
  delay = 0,
  duration = 0.6,
  threshold = 0.1,
  rootMargin = '0px',
  triggerOnce = true,
  customVariants = null,
  ...props
}) => {
  const { ref, hasIntersected } = useIntersectionObserver({
    threshold,
    rootMargin,
    triggerOnce
  });

  // Default animation variants
  const defaultVariants = {
    fadeIn: {
      hidden: { opacity: 0 },
      visible: { opacity: 1 }
    },
    slideUp: {
      hidden: { opacity: 0, y: 50 },
      visible: { opacity: 1, y: 0 }
    },
    slideDown: {
      hidden: { opacity: 0, y: -50 },
      visible: { opacity: 1, y: 0 }
    },
    slideLeft: {
      hidden: { opacity: 0, x: 50 },
      visible: { opacity: 1, x: 0 }
    },
    slideRight: {
      hidden: { opacity: 0, x: -50 },
      visible: { opacity: 1, x: 0 }
    },
    scaleIn: {
      hidden: { opacity: 0, scale: 0.8 },
      visible: { opacity: 1, scale: 1 }
    },
    rotateIn: {
      hidden: { opacity: 0, rotate: -10, scale: 0.9 },
      visible: { opacity: 1, rotate: 0, scale: 1 }
    }
  };

  const variants = customVariants || defaultVariants[animation] || defaultVariants.fadeIn;

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={hasIntersected ? "visible" : "hidden"}
      variants={variants}
      transition={{
        duration,
        delay,
        ease: "easeOut"
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

ScrollAnimation.propTypes = {
  children: PropTypes.node.isRequired,
  animation: PropTypes.oneOf([
    'fadeIn',
    'slideUp',
    'slideDown',
    'slideLeft',
    'slideRight',
    'scaleIn',
    'rotateIn'
  ]),
  delay: PropTypes.number,
  duration: PropTypes.number,
  threshold: PropTypes.number,
  rootMargin: PropTypes.string,
  triggerOnce: PropTypes.bool,
  customVariants: PropTypes.object
};

export default ScrollAnimation;
