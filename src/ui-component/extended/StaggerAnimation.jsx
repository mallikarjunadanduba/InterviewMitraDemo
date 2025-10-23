import React from 'react';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import useIntersectionObserver from '../../hooks/useIntersectionObserver';

/**
 * StaggerAnimation component for animating multiple children with staggered timing
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to animate
 * @param {number} props.staggerDelay - Delay between each child animation
 * @param {string} props.animation - Animation type for individual children
 * @param {number} props.delay - Initial animation delay
 * @param {number} props.duration - Animation duration
 * @param {number} props.threshold - Intersection observer threshold
 * @param {string} props.rootMargin - Intersection observer root margin
 * @param {boolean} props.triggerOnce - Whether to trigger animation only once
 */
const StaggerAnimation = ({
  children,
  staggerDelay = 0.1,
  animation = 'slideUp',
  delay = 0,
  duration = 0.6,
  threshold = 0.1,
  rootMargin = '0px',
  triggerOnce = true,
  ...props
}) => {
  const { ref, hasIntersected } = useIntersectionObserver({
    threshold,
    rootMargin,
    triggerOnce
  });

  // Animation variants for individual children
  const childVariants = {
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
    }
  };

  // Container variants for staggered animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: delay
      }
    }
  };

  const childVariant = childVariants[animation] || childVariants.slideUp;

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={hasIntersected ? "visible" : "hidden"}
      variants={containerVariants}
      {...props}
    >
      {React.Children.map(children, (child, index) => (
        <motion.div
          key={index}
          variants={childVariant}
          transition={{
            duration,
            ease: "easeOut"
          }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
};

StaggerAnimation.propTypes = {
  children: PropTypes.node.isRequired,
  staggerDelay: PropTypes.number,
  animation: PropTypes.oneOf([
    'fadeIn',
    'slideUp',
    'slideDown',
    'slideLeft',
    'slideRight',
    'scaleIn'
  ]),
  delay: PropTypes.number,
  duration: PropTypes.number,
  threshold: PropTypes.number,
  rootMargin: PropTypes.string,
  triggerOnce: PropTypes.bool
};

export default StaggerAnimation;
