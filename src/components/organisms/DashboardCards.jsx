import React from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import { formatCurrency } from "@/utils/formatters";

const DashboardCards = ({ stats }) => {
  const cards = [
    {
      title: "Total Products",
      value: stats.totalProducts,
      icon: "Package",
      color: "primary",
      trend: null
    },
    {
      title: "Low Stock Items",
      value: stats.lowStockCount,
      icon: "AlertTriangle",
      color: "warning",
      trend: null
    },
    {
      title: "Out of Stock",
      value: stats.outOfStockCount,
      icon: "XCircle",
      color: "error",
      trend: null
    },
    {
      title: "Total Value",
      value: formatCurrency(stats.totalValue),
      icon: "DollarSign",
      color: "success",
      trend: null
    }
  ];

  const colorClasses = {
    primary: {
      icon: "from-primary-500 to-primary-600 text-white",
      bg: "from-primary-50 to-primary-100",
      text: "text-primary-700"
    },
    warning: {
      icon: "from-warning-500 to-warning-600 text-white",
      bg: "from-warning-50 to-warning-100",
      text: "text-warning-700"
    },
    error: {
      icon: "from-error-500 to-error-600 text-white",
      bg: "from-error-50 to-error-100",
      text: "text-error-700"
    },
    success: {
      icon: "from-success-500 to-success-600 text-white",
      bg: "from-success-50 to-success-100",
      text: "text-success-700"
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card, index) => {
        const colors = colorClasses[card.color];
        return (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
            className={`bg-gradient-to-br ${colors.bg} rounded-xl shadow-card hover:shadow-card-hover transition-all duration-300 p-6 border border-white/50`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colors.icon} flex items-center justify-center shadow-lg`}>
                <ApperIcon name={card.icon} className="w-6 h-6" />
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-slate-600">
                {card.title}
              </h3>
              <p className={`text-2xl font-bold ${colors.text}`}>
                {card.value}
              </p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default DashboardCards;