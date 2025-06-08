import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const FeatureCard = ({ children, delay = 0 }) => {
    const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });
  
    return (
      <motion.div
        ref={ref}
        className="ldp-features-card-c"
        initial={{ opacity: 0, y: 40 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay }}
      >
        {children}
      </motion.div>
    );
  };

export default FeatureCard;
  