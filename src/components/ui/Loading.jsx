import React from "react";
import { motion } from "framer-motion";

const Loading = ({ type = "table" }) => {
  const shimmer = {
    initial: { backgroundPosition: "-200px 0" },
    animate: { backgroundPosition: "200px 0" },
    transition: {
      duration: 2,
      ease: "linear",
      repeat: Infinity
    }
  };

  const shimmerClass = "bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200px_100%]";

  if (type === "cards") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <motion.div
            key={i}
            className="bg-white rounded-lg shadow-card p-6 border border-slate-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <div className="flex items-center justify-between mb-4">
              <motion.div
                className={`w-8 h-8 rounded ${shimmerClass}`}
                {...shimmer}
              />
              <motion.div
                className={`w-16 h-4 rounded ${shimmerClass}`}
                {...shimmer}
              />
            </div>
            <motion.div
              className={`w-20 h-8 rounded mb-2 ${shimmerClass}`}
              {...shimmer}
            />
            <motion.div
              className={`w-24 h-4 rounded ${shimmerClass}`}
              {...shimmer}
            />
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-card border border-slate-200">
      <div className="p-6 border-b border-slate-200">
        <motion.div
          className={`w-48 h-6 rounded ${shimmerClass}`}
          {...shimmer}
        />
      </div>
      <div className="divide-y divide-slate-200">
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={i}
            className="p-4 flex items-center space-x-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.05 }}
          >
            <motion.div
              className={`w-full max-w-[200px] h-4 rounded ${shimmerClass}`}
              {...shimmer}
            />
            <motion.div
              className={`w-20 h-4 rounded ${shimmerClass}`}
              {...shimmer}
            />
            <motion.div
              className={`w-16 h-4 rounded ${shimmerClass}`}
              {...shimmer}
            />
            <motion.div
              className={`w-24 h-6 rounded-full ${shimmerClass}`}
              {...shimmer}
            />
            <motion.div
              className={`w-8 h-8 rounded ${shimmerClass}`}
              {...shimmer}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Loading;