import { Users, TrendingUp, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

const StatsCards = ({ stats }) => {
  const cards = [
    {
      title: 'Total Suscriptores',
      value: stats?.total || 0,
      icon: Users,
      color: 'from-esbelta-terracotta to-esbelta-terracotta-dark',
      textColor: 'text-esbelta-terracotta'
    },
    {
      title: 'Hoy',
      value: stats?.today || 0,
      icon: TrendingUp,
      color: 'from-esbelta-sand to-esbelta-terracotta-dark',
      textColor: 'text-esbelta-sand'
    },
    {
      title: 'Esta Semana',
      value: stats?.week || 0,
      icon: Calendar,
      color: 'from-esbelta-chocolate to-esbelta-chocolate-light',
      textColor: 'text-esbelta-chocolate'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {cards.map((card, index) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white rounded-xl shadow-lg p-6 border border-esbelta-sand-light"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-esbelta-chocolate-light font-medium mb-1">
                {card.title}
              </p>
              <p className={`text-4xl font-bold ${card.textColor}`}>
                {card.value.toLocaleString()}
              </p>
            </div>
            <div className={`w-16 h-16 bg-gradient-to-br ${card.color} rounded-xl flex items-center justify-center shadow-md`}>
              <card.icon className="w-8 h-8 text-white" />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default StatsCards;