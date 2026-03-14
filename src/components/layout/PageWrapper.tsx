import { motion } from 'framer-motion';

interface PageWrapperProps {
  children: React.ReactNode;
  title?: string;
}

export default function PageWrapper({ children }: PageWrapperProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-6"
    >
      {children}
    </motion.div>
  );
}
