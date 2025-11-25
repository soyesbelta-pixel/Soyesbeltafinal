import { motion } from 'framer-motion';
// NOTA: Se removió AnimatePresence para evitar conflictos DOM
import { CheckCircle, AlertCircle, Info } from 'lucide-react';
import useStore from '../store/useStore';

const Notifications = () => {
  const { notifications } = useStore();

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'info':
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getStyles = (type) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'info':
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  return (
    <div className="fixed top-20 right-4 z-50 space-y-2">
      {/* Sin AnimatePresence - renderizado simple */}
      {notifications.map((notification) => (
        <motion.div
          key={notification.id}
          initial={{ opacity: 0, x: 100, scale: 0.8 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg ${getStyles(notification.type)} max-w-sm`}
        >
          {getIcon(notification.type)}
          <p className="text-sm flex-1">{notification.message}</p>
        </motion.div>
      ))}
    </div>
  );
};

export default Notifications;
